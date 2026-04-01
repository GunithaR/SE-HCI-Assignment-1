package com.constructionplatform.app.service;

import com.constructionplatform.app.dto.explanation.ExplanationRequestDTO;
import com.constructionplatform.app.dto.recommendation.ComparisonAttributeDTO;
import com.constructionplatform.app.dto.recommendation.ComparisonProductDTO;
import com.constructionplatform.app.dto.recommendation.ComparisonRequestDTO;
import com.constructionplatform.app.dto.recommendation.ComparisonResponseDTO;
import com.constructionplatform.app.dto.recommendation.RecommendationRequestDTO;
import com.constructionplatform.app.dto.recommendation.RecommendationResponseDTO;
import com.constructionplatform.app.engine.RecommendationEngine;
import com.constructionplatform.app.engine.RecommendationEngine.ProductScore;
import com.constructionplatform.app.engine.UserAnswers;
import com.constructionplatform.app.entity.Product;
import com.constructionplatform.app.entity.ProductAttribute;
import com.constructionplatform.app.repository.ProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Orchestrates the recommendation flow:
 * 1. Receive category + answers from frontend
 * 2. Load candidate products by category
 * 3. Run the Strategy Pattern–based RecommendationEngine
 * 4. Map results to response DTOs with score breakdowns and trade-off warnings
 */
@Service
public class RecommendationService {

    private static final Logger log = LoggerFactory.getLogger(RecommendationService.class);
    private static final int TOP_N = 5;

    private final ProductRepository productRepository;
    private final RecommendationEngine recommendationEngine;
    private final ExplanationAIService explanationAIService;

    public RecommendationService(ProductRepository productRepository,
                                  RecommendationEngine recommendationEngine,
                                  ExplanationAIService explanationAIService) {
        this.productRepository = productRepository;
        this.recommendationEngine = recommendationEngine;
        this.explanationAIService = explanationAIService;
    }

    /**
     * Generate ranked product recommendations based on user's category selection and answers.
     */
    public List<RecommendationResponseDTO> generateRecommendations(RecommendationRequestDTO requestDTO) {
        String category = requestDTO.getCategory();
        Map<String, String> answers = requestDTO.getAnswers();

        log.info("Generating recommendations for category='{}' with {} answers", category, answers.size());

        // 1. Build UserAnswers
        UserAnswers userAnswers = new UserAnswers(category, answers);

        // 2. Load candidate products (by category, or all if category not found)
        List<Product> candidates = loadCandidates(category);
        log.info("Found {} candidate products for category '{}'", candidates.size(), category);

        if (candidates.isEmpty()) {
            return List.of();
        }

        // 3. Run the recommendation engine (scores every product, never filters out)
        List<ProductScore> scoredProducts = recommendationEngine.recommend(candidates, userAnswers, TOP_N);

        // 4. Convert to response DTOs
        return scoredProducts.stream()
                .map(this::mapToResponseDTO)
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

    private RecommendationResponseDTO mapToResponseDTO(ProductScore scored) {
        RecommendationResponseDTO dto = new RecommendationResponseDTO();
        Product product = scored.getProduct();

        dto.setProductId(product.getId());
        dto.setProductName(product.getName());
        dto.setBrandName(product.getBrand() != null ? product.getBrand().getName() : null);
        dto.setCategoryName(product.getCategory() != null ? product.getCategory().getName() : null);
        dto.setBasePrice(product.getBasePrice());
        dto.setImageUrl(product.getImageUrl());

        dto.setTotalScore(scored.getTotalScore());
        dto.setStrategyScores(scored.getStrategyScores());
        dto.setTradeOffs(scored.getTradeOffs());
        dto.setExcluded(false);

        // Build human-readable explanation
        dto.setExplanation(buildExplanation(scored));

        // Identify top-scoring strategies for matchedRuleNames (backward compat)
        List<String> topStrategies = new ArrayList<>();
        scored.getStrategyScores().forEach((strategy, score) -> {
            if (score >= 8.0) {
                topStrategies.add(strategy + " match");
            }
        });
        dto.setMatchedRuleNames(topStrategies);

        return dto;
    }

    private String buildExplanation(ProductScore scored) {
        Map<String, Double> scores = scored.getStrategyScores();
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
        if (!strengths.isEmpty()) {
            sb.append("Strong match for: ").append(String.join(", ", strengths)).append(". ");
        }

        if (!scored.getTradeOffs().isEmpty()) {
            sb.append("⚠️ Trade-off: ").append(String.join("; ", scored.getTradeOffs())).append(".");
        } else if (weaknesses.isEmpty() && !strengths.isEmpty()) {
            sb.append("Well-rounded recommendation.");
        } else if (strengths.isEmpty()) {
            sb.append("Moderate match across all criteria.");
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
    private String generateComparativeNarrative(List<ComparisonProductDTO> products) {
        try {
            // Build a narrative describing the products
            List<String> productNames = products.stream()
                    .map(p -> p.getProductName())
                    .collect(Collectors.toList());

            StringBuilder prompt = new StringBuilder();
            prompt.append("You are a helpful assistant. Compare these products in 1-2 sentences, highlighting their key differences and strengths: ");
            prompt.append(String.join(", ", productNames)).append(".");

            // For now, return fallback since we don't have real AI integration
            // In production, this would call the actual AI service
            return generateFallbackComparison(products);

        } catch (Exception e) {
            log.warn("Failed to generate AI comparative narrative: {}", e.getMessage());
            return generateFallbackComparison(products);
        }
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

