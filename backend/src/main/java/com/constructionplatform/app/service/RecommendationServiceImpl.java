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
import com.constructionplatform.app.repository.ProductRepository;
import com.constructionplatform.app.repository.RecommendationHistoryRepository;
import com.constructionplatform.app.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class RecommendationServiceImpl implements RecommendationService {

    private static final Logger log = LoggerFactory.getLogger(RecommendationServiceImpl.class);
    private static final int TOP_N = 5;

    @Value("${ai.gemini.api-key:UNCONFIGURED}")
    private String geminiApiKey;

    @Value("${ai.gemini.url:https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent}")
    private String geminiUrl;

    private final ProductRepository productRepository;
    private final RecommendationEngine recommendationEngine;
    private final ExplanationAIService explanationAIService;
    private final RecommendationAugmentationService recommendationAugmentationService;
    private final AnswerNormalizationService normalizationService;
    private final RulePostProcessor rulePostProcessor;
    private final RecommendationHistoryRepository historyRepository;
    private final UserRepository userRepository;

    public RecommendationServiceImpl(ProductRepository productRepository,
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

    @Override
    public List<RecommendationResponseDTO> generateRecommendations(RecommendationRequestDTO requestDTO) {
        return generateRankedRecommendations(requestDTO);
    }

    @Override
    public HybridRecommendationResponseDTO generateHybridRecommendations(RecommendationRequestDTO requestDTO) {
        List<RecommendationResponseDTO> rankedRecommendations = generateRankedRecommendations(requestDTO);

        geminiDelay();
        batchEnhanceExplanations(rankedRecommendations);

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

        saveRecommendationHistory(requestDTO, responseDTO);

        return responseDTO;
    }

    @Override
    public ComparisonResponseDTO compareRecommendations(ComparisonRequestDTO requestDTO) {
        List<Long> selectedIds = requestDTO.getSelectedProductIds();
        List<RecommendationResponseDTO> recommendations = requestDTO.getRecommendations();

        if (selectedIds == null || selectedIds.size() < 2) {
            throw new IllegalArgumentException("At least 2 products are required for comparison.");
        }

        if (recommendations == null || recommendations.isEmpty()) {
            throw new IllegalArgumentException("Product recommendation data is required for comparison.");
        }

        List<ComparisonProductDTO> comparisonProducts = recommendations.stream()
                .map(this::mapRecommendationToComparisonDTO)
                .collect(Collectors.toList());

        String narrative = generateComparativeNarrative(comparisonProducts);
        boolean fallbackUsed = isFallbackNarrative(narrative);

        ComparisonResponseDTO response = new ComparisonResponseDTO();
        response.setProducts(comparisonProducts);
        response.setComparativeNarrative(narrative);
        response.setFallbackUsed(fallbackUsed);
        response.setRankingOrder(new ArrayList<>(selectedIds));

        return response;
    }

    private List<RecommendationResponseDTO> generateRankedRecommendations(RecommendationRequestDTO requestDTO) {
        String category = requestDTO.getCategory();
        Map<String, String> rawAnswers = requestDTO.getAnswers();

        Map<String, String> normalizedAnswers = normalizationService.normalize(category, rawAnswers);
        UserAnswers userAnswers = new UserAnswers(category, normalizedAnswers);
        List<Product> candidates = loadCandidates(category);

        if (candidates.isEmpty()) {
            return List.of();
        }

        List<ProductScore> strategyScores = recommendationEngine.recommend(candidates, userAnswers, TOP_N);
        List<AdjustedProductScore> adjustedScores = rulePostProcessor.applyRules(strategyScores, normalizedAnswers);

        return adjustedScores.stream()
                .map(this::mapAdjustedToResponseDTO)
                .collect(Collectors.toList());
    }

    private List<Product> loadCandidates(String category) {
        List<Product> products = productRepository.findByCategoryNameAndIsActiveTrue(category);
        if (!products.isEmpty()) return products;

        String simpleName = category.replace(" Solution", "").trim();
        products = productRepository.findByCategoryNameContainingAndIsActiveTrue(simpleName);
        if (!products.isEmpty()) return products;

        return productRepository.findByIsActiveTrue();
    }

    private RecommendationResponseDTO mapAdjustedToResponseDTO(AdjustedProductScore adjusted) {
        RecommendationResponseDTO dto = new RecommendationResponseDTO();
        Product product = adjusted.getProduct();

        dto.setProductId(product.getId());
        dto.setProductName(product.getName());
        dto.setBrandName(product.getBrand() != null ? product.getBrand().getName() : null);
        dto.setCategoryName(product.getCategory() != null ? product.getCategory().getName() : null);
        dto.setBasePrice(product.getBasePrice());
        
        String imageUrl = product.getImageUrl();
        if ((imageUrl == null || imageUrl.trim().isEmpty())
                && product.getImages() != null
                && !product.getImages().isEmpty()) {
            imageUrl = product.getImages().get(0).getImageUrl();
        }
        dto.setImageUrl(imageUrl);

        dto.setTotalScore(adjusted.getFinalScore());
        dto.setStrategyScores(adjusted.getStrategyScores());
        dto.setTradeOffs(adjusted.getTradeOffs());
        dto.setRuleAdjustment(adjusted.getRuleAdjustment());
        dto.setAppliedRuleNames(adjusted.getAppliedRuleNames());
        dto.setExcluded(adjusted.isExcluded());
        dto.setExcludedByRules(adjusted.getExcludedByRules());
        dto.setExplanation(buildExplanation(adjusted));

        List<String> topStrategies = new ArrayList<>();
        adjusted.getStrategyScores().forEach((strategy, score) -> {
            if (score >= 8.0) topStrategies.add(strategy + " match");
        });
        dto.setMatchedRuleNames(topStrategies);

        return dto;
    }

    private String buildExplanation(AdjustedProductScore adjusted) {
        if (adjusted.isExcluded()) {
            return "⛔ Excluded by rule: " + String.join(", ", adjusted.getExcludedByRules()) + ".";
        }

        Map<String, Double> scores = adjusted.getStrategyScores();
        List<String> strengths = new ArrayList<>();
        scores.forEach((strategy, score) -> {
            if (score >= 8.0) strengths.add(strategy.toLowerCase());
        });

        StringBuilder sb = new StringBuilder();
        if (!strengths.isEmpty()) {
            sb.append("Strong match for: ").append(String.join(", ", strengths)).append(". ");
        }
        if (!adjusted.getTradeOffs().isEmpty()) {
            sb.append("⚠️ Trade-off: ").append(String.join("; ", adjusted.getTradeOffs())).append(". ");
        }
        return sb.toString().trim();
    }

    private ComparisonProductDTO mapRecommendationToComparisonDTO(RecommendationResponseDTO rec) {
        ComparisonProductDTO dto = new ComparisonProductDTO();
        dto.setProductId(rec.getProductId());
        dto.setProductName(rec.getProductName());
        dto.setBrandName(rec.getBrandName());
        dto.setCategoryName(rec.getCategoryName());
        dto.setBasePrice(rec.getBasePrice());
        dto.setImageUrl(rec.getImageUrl());
        dto.setTotalScore(rec.getTotalScore());

        productRepository.findById(rec.getProductId()).ifPresent(product -> {
            if (product.getAttribute() != null) {
                ProductAttribute attr = product.getAttribute();
                List<ComparisonAttributeDTO> attributes = new ArrayList<>();
                addAttributeIfNotNull(attributes, "Durability", attr.getDurabilityRating() != null ? attr.getDurabilityRating().toString() : "N/A");
                addAttributeIfNotNull(attributes, "Maintenance Level", attr.getMaintenanceLevel() != null ? attr.getMaintenanceLevel().toString() : "N/A");
                addAttributeIfNotNull(attributes, "Climate Suitability", attr.getClimateSuitability() != null ? attr.getClimateSuitability().toString() : "N/A");
                addAttributeIfNotNull(attributes, "Budget Level", attr.getBudgetLevel() != null ? attr.getBudgetLevel().toString() : "N/A");
                addAttributeIfNotNull(attributes, "Size", attr.getSize() != null ? attr.getSize().toString() : "N/A");
                addAttributeIfNotNull(attributes, "Material", attr.getMaterial() != null ? attr.getMaterial().toString() : "N/A");
                addAttributeIfNotNull(attributes, "Style", attr.getStyle());
                dto.setAttributes(attributes);
            }
        });
        return dto;
    }

    private void addAttributeIfNotNull(List<ComparisonAttributeDTO> attributes, String name, String value) {
        if (value != null && !value.isEmpty()) {
            attributes.add(new ComparisonAttributeDTO(name, value));
        }
    }

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
            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            List<String> explanations = mapper.readValue(aiResponse, 
                mapper.getTypeFactory().constructCollectionType(List.class, String.class));

            for (int i = 0; i < Math.min(explanations.size(), products.size()); i++) {
                String aiExplanation = explanations.get(i).trim();
                if (!aiExplanation.isBlank()) {
                    products.get(i).setExplanation(aiExplanation);
                }
            }
        } catch (Exception e) {
            log.warn("Batch AI explanations failed, keeping deterministic fallback. reason={}", e.getMessage());
        }
    }

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
        org.springframework.http.HttpEntity<String> entity = new org.springframework.http.HttpEntity<>(mapper.writeValueAsString(body), headers);
        org.springframework.web.client.RestTemplate rest = new org.springframework.web.client.RestTemplate();
        org.springframework.http.ResponseEntity<String> response = rest.postForEntity(urlWithKey, entity, String.class);
        com.fasterxml.jackson.databind.JsonNode root = mapper.readTree(response.getBody());
        return root.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText().trim();
    }

    private void saveRecommendationHistory(RecommendationRequestDTO requestDTO, HybridRecommendationResponseDTO responseDTO) {
        try {
            RecommendationHistory history = new RecommendationHistory();
            history.setCategory(requestDTO.getCategory() != null ? requestDTO.getCategory() : "Unknown");
            long startedAtMillis = requestDTO.getStartedAt() != null ? requestDTO.getStartedAt() : System.currentTimeMillis();
            history.setStartedAt(java.time.Instant.ofEpochMilli(startedAtMillis).atZone(java.time.ZoneId.systemDefault()).toLocalDateTime());
            history.setCompletedAt(LocalDateTime.now());

            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
                String userEmail = auth.getName();
                history.setUserEmail(userEmail);
                userRepository.findByEmail(userEmail).ifPresent(user -> history.setUserId(user.getId()));
            }

            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            history.setAnswersJson(mapper.writeValueAsString(requestDTO.getAnswers()));
            history.setResultSummaryJson(mapper.writeValueAsString(responseDTO));

            java.util.Set<String> allAppliedRules = new java.util.HashSet<>();
            if (responseDTO.getRecommendations() != null) {
                for (RecommendationResponseDTO rec : responseDTO.getRecommendations()) {
                    if (rec.getAppliedRuleNames() != null) allAppliedRules.addAll(rec.getAppliedRuleNames());
                    if (rec.getExcludedByRules() != null) {
                        for (String ruleName : rec.getExcludedByRules()) allAppliedRules.add(ruleName + " [FILTER_OUT]");
                    }
                }
            }
            history.setAppliedRulesJson(mapper.writeValueAsString(allAppliedRules));
            historyRepository.save(history);
        } catch (Exception e) {
            log.error("Failed to save recommendation history: {}", e.getMessage(), e);
        }
    }

    private String generateComparativeNarrative(List<ComparisonProductDTO> products) {
        if (products.isEmpty()) return "No products to compare.";
        StringBuilder sb = new StringBuilder();
        sb.append("Top ranked is ").append(products.get(0).getProductName());
        if (products.size() > 1) {
            sb.append(". ").append(products.get(1).getProductName()).append(" is a competitive alternative");
        }
        sb.append(". Compare key attributes like price, durability, and maintenance level to find the best fit for your needs.");
        return sb.toString();
    }

    private boolean isFallbackNarrative(String narrative) {
        return narrative.contains("Compare key attributes");
    }

    private void geminiDelay() {
        try { Thread.sleep(2000); } catch (InterruptedException ignored) { Thread.currentThread().interrupt(); }
    }
}
