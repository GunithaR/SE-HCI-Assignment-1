package com.constructionplatform.app.service;

import com.constructionplatform.app.dto.recommendation.ComparisonAttributeDTO;
import com.constructionplatform.app.dto.recommendation.ComparisonProductDTO;
import com.constructionplatform.app.dto.recommendation.ComparisonRequestDTO;
import com.constructionplatform.app.dto.recommendation.ComparisonResponseDTO;
import com.constructionplatform.app.dto.recommendation.HybridRecommendationResponseDTO;
import com.constructionplatform.app.dto.recommendation.RecommendationRequestDTO;
import com.constructionplatform.app.dto.recommendation.RecommendationResponseDTO;
import com.constructionplatform.app.engine.AdjustedProductScore;
import com.constructionplatform.app.engine.RecommendationEngine;
import com.constructionplatform.app.engine.RecommendationEngine.ProductScore;
import com.constructionplatform.app.engine.RulePostProcessor;
import com.constructionplatform.app.engine.UserAnswers;
import com.constructionplatform.app.entity.Product;
import com.constructionplatform.app.entity.ProductAttribute;
import com.constructionplatform.app.entity.RecommendationHistory;
import com.constructionplatform.app.entity.User;
import com.constructionplatform.app.repository.ProductRepository;
import com.constructionplatform.app.repository.RecommendationHistoryRepository;
import com.constructionplatform.app.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Orchestrates the recommendation flow:
 * 1. AI-normalise user answers (with deterministic fallback)
 * 2. Load candidate products by category
 * 3. Run the Strategy Pattern–based RecommendationEngine
 * 4. Apply admin-configured rules as post-processing adjustments
 * 5. Map results to response DTOs with score breakdowns and trade-off warnings
 */
@Service
public class RecommendationService {

    private static final Logger log = LoggerFactory.getLogger(RecommendationService.class);
    private static final int TOP_N = 5;

    @org.springframework.beans.factory.annotation.Value("${ai.gemini.api-key:UNCONFIGURED}")
    private String geminiApiKey;

    @org.springframework.beans.factory.annotation.Value("${ai.gemini.url:https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent}")
    private String geminiUrl;

    private final ProductRepository productRepository;
    private final RecommendationEngine recommendationEngine;
    private final ExplanationAIService explanationAIService;
    private final RecommendationAugmentationService recommendationAugmentationService;
    private final AnswerNormalizationService normalizationService;
    private final RulePostProcessor rulePostProcessor;
    private final RecommendationHistoryRepository historyRepository;
    private final UserRepository userRepository;

    public RecommendationService(ProductRepository productRepository,
                                  RecommendationEngine recommendationEngine,
                                  ExplanationAIService explanationAIService,
                                  RecommendationAugmentationService recommendationAugmentationService,
                                  AnswerNormalizationService normalizationService,
                                  RulePostProcessor rulePostProcessor,
                                  RecommendationHistoryRepository historyRepository,
                                  UserRepository userRepository) {
        this.productRepository = productRepository;
        this.recommendationEngine = recommendationEngine;
        this.explanationAIService = explanationAIService;
        this.recommendationAugmentationService = recommendationAugmentationService;
        this.normalizationService = normalizationService;
        this.rulePostProcessor = rulePostProcessor;
        this.historyRepository = historyRepository;
        this.userRepository = userRepository;
    }

    /**
     * Generate ranked product recommendations based on user's category selection and answers.
     */
    public List<RecommendationResponseDTO> generateRecommendations(RecommendationRequestDTO requestDTO) {
        return generateRankedRecommendations(requestDTO);
        }

        /**
         * Generate ranked recommendations with AI explanations and contextual insights.
         * Pipeline: Normalize(1 call) → 4s → BatchExplain(1 call) → 4s → Augment(1 call)
         * Total: 3 Gemini calls, well within 15 RPM free tier.
         */
        public HybridRecommendationResponseDTO generateHybridRecommendations(RecommendationRequestDTO requestDTO) {
        List<RecommendationResponseDTO> rankedRecommendations = generateRankedRecommendations(requestDTO);

        // --- Step 2: Batch-generate AI explanations for all products (single Gemini call) ---
        geminiDelay();
        batchEnhanceExplanations(rankedRecommendations);

        // --- Step 3: Generate augmentation insights (single Gemini call) ---
        geminiDelay();
        RecommendationAugmentationService.AugmentationResult augmentation =
            recommendationAugmentationService.generateInsights(
                requestDTO.getCategory(),
                requestDTO.getAnswers(),
                rankedRecommendations
            );

        HybridRecommendationResponseDTO responseDTO = new HybridRecommendationResponseDTO(
            rankedRecommendations,
            augmentation.insights(),
            augmentation.fallbackUsed()
        );

        // --- Step 4: Save History Log ---
        saveRecommendationHistory(requestDTO, responseDTO);

        return responseDTO;
        }

        private void saveRecommendationHistory(RecommendationRequestDTO requestDTO, HybridRecommendationResponseDTO responseDTO) {
            try {
                RecommendationHistory history = new RecommendationHistory();
                history.setCategory(requestDTO.getCategory() != null ? requestDTO.getCategory() : "Unknown");

                // Timestamps
                long startedAtMillis = requestDTO.getStartedAt() != null ? requestDTO.getStartedAt() : System.currentTimeMillis();
                history.setStartedAt(java.time.Instant.ofEpochMilli(startedAtMillis)
                        .atZone(java.time.ZoneId.systemDefault()).toLocalDateTime());
                history.setCompletedAt(LocalDateTime.now());

                // Find logged-in user if available
                Authentication auth = SecurityContextHolder.getContext().getAuthentication();
                if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
                    String userEmail = auth.getName();
                    history.setUserEmail(userEmail);
                    userRepository.findByEmail(userEmail).ifPresent(user -> history.setUserId(user.getId()));
                }

                // Serialize JSON manually or via simple Jackson
                com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
                String answersJson = mapper.writeValueAsString(requestDTO.getAnswers());
                String resultSummaryJson = mapper.writeValueAsString(responseDTO);

                // Collect unique set of applied and excluded rules across all recommended products
                java.util.Set<String> allAppliedRules = new java.util.HashSet<>();
                if (responseDTO.getRecommendations() != null) {
                    for (RecommendationResponseDTO rec : responseDTO.getRecommendations()) {
                        if (rec.getAppliedRuleNames() != null) {
                            allAppliedRules.addAll(rec.getAppliedRuleNames());
                        }
                        if (rec.getExcludedByRules() != null) {
                            for (String ruleName : rec.getExcludedByRules()) {
                                allAppliedRules.add(ruleName + " [FILTER_OUT]");
                            }
                        }
                    }
                }
                String appliedRulesJson = mapper.writeValueAsString(allAppliedRules);

                history.setAnswersJson(answersJson);
                history.setResultSummaryJson(resultSummaryJson);
                history.setAppliedRulesJson(appliedRulesJson);

                historyRepository.save(history);
            } catch (Exception e) {
                log.error("Failed to save recommendation history: {}", e.getMessage(), e);
            }
        }

    /**
     * Batch-generates AI explanations for all products in a single Gemini call.
     * Falls back to the existing deterministic explanations on failure.
     */
    private void batchEnhanceExplanations(List<RecommendationResponseDTO> products) {
        try {
            StringBuilder prompt = new StringBuilder();
            prompt.append("You are an expert construction materials advisor. ");
            prompt.append("For each product below, write a concise 1-2 sentence explanation of why it's recommended. ");
            prompt.append("Return ONLY a JSON array of strings, one per product, in the same order. ");
            prompt.append("No markdown, no numbering, just the JSON array.\n\n");

            for (int i = 0; i < products.size(); i++) {
                RecommendationResponseDTO p = products.get(i);
                prompt.append(String.format("[%d] %s (score: %.1f/10", i + 1, p.getProductName(), p.getTotalScore()));
                if (p.getStrategyScores() != null) {
                    p.getStrategyScores().forEach((strategy, score) -> {
                        if (score >= 7.0) {
                            prompt.append(String.format(", strong %s: %.1f", strategy.toLowerCase(), score));
                        }
                    });
                }
                if (p.getTradeOffs() != null && !p.getTradeOffs().isEmpty()) {
                    prompt.append(", trade-offs: ").append(String.join(", ", p.getTradeOffs()));
                }
                prompt.append(")\n");
            }

            String aiResponse = callGeminiText(prompt.toString());
            
            // Parse JSON array of explanations
            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            List<String> explanations = mapper.readValue(aiResponse, 
                mapper.getTypeFactory().constructCollectionType(List.class, String.class));

            // Assign AI explanations to products
            for (int i = 0; i < Math.min(explanations.size(), products.size()); i++) {
                String aiExplanation = explanations.get(i).trim();
                if (!aiExplanation.isBlank()) {
                    products.get(i).setExplanation(aiExplanation);
                }
            }

            log.info("Batch AI explanations generated for {} products", Math.min(explanations.size(), products.size()));

        } catch (Exception e) {
            log.warn("Batch AI explanations failed, keeping deterministic fallback. reason={}", e.getMessage());
            // Keep the existing deterministic explanations — no change needed
        }
    }

    /**
     * Calls Gemini API for a plain-text response. Used for batch explanations.
     */
    private String callGeminiText(String prompt) throws Exception {
        if ("UNCONFIGURED".equals(geminiApiKey)) {
            throw new IllegalStateException("Gemini API key not configured");
        }

        com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();

        Map<String, Object> body = Map.of(
            "contents", List.of(Map.of("parts", List.of(Map.of("text", prompt)))),
            "generationConfig", Map.of(
                "temperature", 0.7,
                "maxOutputTokens", 800,
                "responseMimeType", "application/json"
            )
        );

        org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
        headers.setContentType(org.springframework.http.MediaType.APPLICATION_JSON);

        String urlWithKey = geminiUrl + "?key=" + geminiApiKey;
        org.springframework.http.HttpEntity<String> entity =
            new org.springframework.http.HttpEntity<>(mapper.writeValueAsString(body), headers);

        org.springframework.web.client.RestTemplate rest = new org.springframework.web.client.RestTemplate();
        org.springframework.http.ResponseEntity<String> response = rest.postForEntity(urlWithKey, entity, String.class);

        com.fasterxml.jackson.databind.JsonNode root = mapper.readTree(response.getBody());
        return root.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText().trim();
    }

    /** 2-second delay between Gemini calls to avoid rate limiting on free tier. */
    private void geminiDelay() {
        try { Thread.sleep(2000); } catch (InterruptedException ignored) { Thread.currentThread().interrupt(); }
    }

    private List<RecommendationResponseDTO> generateRankedRecommendations(RecommendationRequestDTO requestDTO) {
        String category = requestDTO.getCategory();
        Map<String, String> rawAnswers = requestDTO.getAnswers();

        log.info("Generating recommendations for category='{}' with {} answers", category, rawAnswers.size());

        // 1. AI-normalise user answers (with deterministic fallback)
        Map<String, String> normalizedAnswers = normalizationService.normalize(category, rawAnswers);
        log.debug("Normalised answers: {}", normalizedAnswers);

        // 2. Build UserAnswers with normalised values
        UserAnswers userAnswers = new UserAnswers(category, normalizedAnswers);

        // 3. Load candidate products (by category, or all if category not found)
        List<Product> candidates = loadCandidates(category);
        log.info("Found {} candidate products for category '{}'", candidates.size(), category);

        if (candidates.isEmpty()) {
            return List.of();
        }

        // 4. Run the recommendation engine (scores every product, never filters out)
        List<ProductScore> strategyScores = recommendationEngine.recommend(candidates, userAnswers, TOP_N);

        // 5. Apply admin-configured rules as post-processing adjustments
        List<AdjustedProductScore> adjustedScores = rulePostProcessor.applyRules(strategyScores, normalizedAnswers);

        // 6. Convert to response DTOs — include excluded products (shown greyed-out)
        return adjustedScores.stream()
                .map(this::mapAdjustedToResponseDTO)
                .collect(Collectors.toList());
    }

    // ── Private helpers ──────────────────────────────────────────────────────

    private List<Product> loadCandidates(String category) {
        // Try loading by category name
        List<Product> products = productRepository.findByCategoryNameAndIsActiveTrue(category);
        if (!products.isEmpty()) {
            return products;
        }

        // Fallback: try partial match by removing "Solution" suffix
        String simpleName = category.replace(" Solution", "").trim();
        products = productRepository.findByCategoryNameContainingAndIsActiveTrue(simpleName);
        if (!products.isEmpty()) {
            return products;
        }

        // Last resort: return all active products
        log.warn("No products found for category '{}', returning all active products", category);
        return productRepository.findByIsActiveTrue();
    }

    /**
     * Maps a rule-adjusted product score to the response DTO.
     * Uses finalScore (strategy + rule adjustments) as the totalScore.
     * Excluded products are included with excluded=true for greyed-out display.
     */
    private RecommendationResponseDTO mapAdjustedToResponseDTO(AdjustedProductScore adjusted) {
        RecommendationResponseDTO dto = new RecommendationResponseDTO();
        Product product = adjusted.getProduct();

        dto.setProductId(product.getId());
        dto.setProductName(product.getName());
        dto.setBrandName(product.getBrand() != null ? product.getBrand().getName() : null);
        dto.setCategoryName(product.getCategory() != null ? product.getCategory().getName() : null);
        dto.setBasePrice(product.getBasePrice());
        dto.setImageUrl(product.getImageUrl());

        dto.setTotalScore(adjusted.getFinalScore());
        dto.setStrategyScores(adjusted.getStrategyScores());
        dto.setTradeOffs(adjusted.getTradeOffs());

        // Rule adjustment info
        dto.setRuleAdjustment(adjusted.getRuleAdjustment());
        dto.setAppliedRuleNames(adjusted.getAppliedRuleNames());
        dto.setExcluded(adjusted.isExcluded());
        dto.setExcludedByRules(adjusted.getExcludedByRules());

        // Build human-readable explanation
        dto.setExplanation(buildExplanation(adjusted));

        // Identify top-scoring strategies for matchedRuleNames (backward compat)
        List<String> topStrategies = new ArrayList<>();
        adjusted.getStrategyScores().forEach((strategy, score) -> {
            if (score >= 8.0) {
                topStrategies.add(strategy + " match");
            }
        });
        dto.setMatchedRuleNames(topStrategies);

        return dto;
    }

    private String buildExplanation(AdjustedProductScore adjusted) {
        Map<String, Double> scores = adjusted.getStrategyScores();
        List<String> strengths = new ArrayList<>();
        List<String> weaknesses = new ArrayList<>();

        scores.forEach((strategy, score) -> {
            if (score >= 8.0) {
                strengths.add(strategy.toLowerCase());
            } else if (score <= 3.0) {
                weaknesses.add(strategy.toLowerCase());
            }
        });

        StringBuilder sb = new StringBuilder();

        if (adjusted.isExcluded()) {
            sb.append("⛔ Excluded by rule: ").append(String.join(", ", adjusted.getExcludedByRules())).append(". ");
            return sb.toString().trim();
        }

        if (!strengths.isEmpty()) {
            sb.append("Strong match for: ").append(String.join(", ", strengths)).append(". ");
        }

        if (!adjusted.getTradeOffs().isEmpty()) {
            sb.append("⚠️ Trade-off: ").append(String.join("; ", adjusted.getTradeOffs())).append(". ");
        } else if (weaknesses.isEmpty() && !strengths.isEmpty()) {
            sb.append("Well-rounded recommendation. ");
        } else if (strengths.isEmpty()) {
            sb.append("Moderate match across all criteria. ");
        }

        if (adjusted.getRuleAdjustment() != 0) {
            String sign = adjusted.getRuleAdjustment() > 0 ? "+" : "";
            sb.append("Rule adjustment: ").append(sign)
              .append(String.format("%.1f", adjusted.getRuleAdjustment())).append(".");
        }

        return sb.toString().trim();
    }

    /**
     * Compare two or more recommended products side-by-side.
     * Assembles structured product data and generates a comparative narrative.
     */
    public ComparisonResponseDTO compareRecommendations(ComparisonRequestDTO requestDTO) {
        List<Long> selectedIds = requestDTO.getSelectedProductIds();
        List<RecommendationResponseDTO> recommendations = requestDTO.getRecommendations();

        log.info("Comparison requested for {} products", selectedIds.size());

        // 1. Validate: minimum 2 products required
        if (selectedIds == null || selectedIds.size() < 2) {
            throw new IllegalArgumentException("At least 2 products are required for comparison.");
        }

        if (recommendations == null || recommendations.isEmpty()) {
            throw new IllegalArgumentException("Product recommendation data is required for comparison.");
        }

        // 2. Convert recommendation data to comparison DTOs (using provided data, not fetching from DB)
        List<ComparisonProductDTO> comparisonProducts = recommendations.stream()
                .map(rec -> mapRecommendationToComparisonDTO(rec))
                .collect(Collectors.toList());

        if (comparisonProducts.isEmpty()) {
            throw new IllegalArgumentException("No valid products found for comparison.");
        }

        // 3. Generate comparative narrative via AI
        String narrative = generateComparativeNarrative(comparisonProducts);
        boolean fallbackUsed = isFallbackNarrative(narrative);

        // 4. Build response
        ComparisonResponseDTO response = new ComparisonResponseDTO();
        response.setProducts(comparisonProducts);
        response.setComparativeNarrative(narrative);
        response.setFallbackUsed(fallbackUsed);
        response.setRankingOrder(new ArrayList<>(selectedIds));

        log.info("Comparison completed. Fallback used: {}", fallbackUsed);
        return response;
    }

    /**
     * Maps a RecommendationResponseDTO to ComparisonProductDTO, preserving scores and adding attributes.
     */
    private ComparisonProductDTO mapRecommendationToComparisonDTO(RecommendationResponseDTO rec) {
        ComparisonProductDTO dto = new ComparisonProductDTO();
        dto.setProductId(rec.getProductId());
        dto.setProductName(rec.getProductName());
        dto.setBrandName(rec.getBrandName());
        dto.setCategoryName(rec.getCategoryName());
        dto.setBasePrice(rec.getBasePrice());
        dto.setImageUrl(rec.getImageUrl());
        
        // Preserve the total score from recommendation
        dto.setTotalScore(rec.getTotalScore());

        // Fetch product from DB to get attributes
        Product product = productRepository.findById(rec.getProductId()).orElse(null);
        if (product != null && product.getAttribute() != null) {
            ProductAttribute attr = product.getAttribute();
            List<ComparisonAttributeDTO> attributes = new ArrayList<>();

            // Add all relevant attributes
            addAttributeIfNotNull(attributes, "Durability", attr.getDurabilityRating() != null ? 
                    attr.getDurabilityRating().toString() : "N/A");
            addAttributeIfNotNull(attributes, "Maintenance Level", attr.getMaintenanceLevel() != null ?
                    attr.getMaintenanceLevel().toString() : "N/A");
            addAttributeIfNotNull(attributes, "Climate Suitability", attr.getClimateSuitability() != null ?
                    attr.getClimateSuitability().toString() : "N/A");
            addAttributeIfNotNull(attributes, "Budget Level", attr.getBudgetLevel() != null ?
                    attr.getBudgetLevel().toString() : "N/A");
            addAttributeIfNotNull(attributes, "Size", attr.getSize() != null ?
                    attr.getSize().toString() : "N/A");
            addAttributeIfNotNull(attributes, "Material", attr.getMaterial() != null ?
                    attr.getMaterial().toString() : "N/A");
            addAttributeIfNotNull(attributes, "Style", attr.getStyle());

            dto.setAttributes(attributes);
        }

        return dto;
    }

    private void addAttributeIfNotNull(List<ComparisonAttributeDTO> attributes, String name, String value) {
        if (value != null && !value.isEmpty()) {
            attributes.add(new ComparisonAttributeDTO(name, value));
        }
    }

    /**
     * Generates a comparative narrative explaining key differences between products.
     * Falls back to rule-based narrative if AI service fails.
     */
    /**
     * Generates a comparative narrative.
     * Uses deterministic fallback (AI augmentation for comparisons is handled
     * separately via the hybrid endpoint if needed).
     */
    private String generateComparativeNarrative(List<ComparisonProductDTO> products) {
        return generateFallbackComparison(products);
    }

    /**
     * Rule-based fallback narrative when AI is unavailable.
     */
    private String generateFallbackComparison(List<ComparisonProductDTO> products) {
        if (products.isEmpty()) {
            return "No products to compare.";
        }

        // Build a simple comparative summary
        StringBuilder sb = new StringBuilder();
        
        // Rank by product name for deterministic ordering
        List<ComparisonProductDTO> sorted = new ArrayList<>(products);
        
        if (sorted.size() > 0) {
            ComparisonProductDTO first = sorted.get(0);
            sb.append("Top ranked is ").append(first.getProductName());
            
            if (sorted.size() > 1) {
                sb.append(". ");
                ComparisonProductDTO second = sorted.get(1);
                sb.append(second.getProductName()).append(" is a competitive alternative");
            }
            
            sb.append(". Compare key attributes like price, durability, and maintenance level to find the best fit for your needs.");
        }

        return sb.toString();
    }

    private boolean isFallbackNarrative(String narrative) {
        // Simple heuristic: check if narrative contains fallback indicators
        return narrative.contains("Compare key attributes") || narrative.contains("best fit");
    }
}

