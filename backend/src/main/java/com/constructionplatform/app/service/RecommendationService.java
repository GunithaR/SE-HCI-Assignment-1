package com.constructionplatform.app.service;

import com.constructionplatform.app.dto.comparison.ComparisonAttributeDTO;
import com.constructionplatform.app.dto.comparison.ComparisonProductDTO;
import com.constructionplatform.app.dto.comparison.ComparisonRequestDTO;
import com.constructionplatform.app.dto.comparison.ComparisonResponseDTO;
import com.constructionplatform.app.dto.recommendation.RecommendationRequestDTO;
import com.constructionplatform.app.dto.recommendation.RecommendationResponseDTO;
import com.constructionplatform.app.engine.RecommendationEngine;
import com.constructionplatform.app.engine.RecommendationEngine.ProductScore;
import com.constructionplatform.app.engine.UserAnswers;
import com.constructionplatform.app.entity.Product;
import com.constructionplatform.app.entity.ProductAttribute;
import com.constructionplatform.app.repository.ProductRepository;
import com.constructionplatform.app.service.ExplanationAIService;
import com.constructionplatform.app.service.ExplanationAIService.AITextResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
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

    /**
     * Compare multiple recommended products side-by-side with AI-generated explanation.
     */
    public ComparisonResponseDTO compareRecommendations(ComparisonRequestDTO requestDTO) {
        List<Long> selectedIds = requestDTO.getSelectedProductIds();

        // Validate: at least 2 products selected
        if (selectedIds == null || selectedIds.size() < 2) {
            throw new IllegalArgumentException("Select at least two products to compare.");
        }

        // Hydrate product entities from DB
        List<Product> products = productRepository.findByIdInAndIsActiveTrue(selectedIds);

        // Verify all selected products were found and are active
        if (products.size() != selectedIds.size()) {
            throw new IllegalArgumentException("One or more selected products are not available for comparison.");
        }

        // Map to ComparisonProductDTO (includes attribute hydration)
        List<ComparisonProductDTO> comparisonProducts = products.stream()
                .map(this::mapToComparisonProductDTO)
                .collect(Collectors.toList());

        // Generate AI-assisted narrative
        AITextResult aiResult = explanationAIService.generateComparisonExplanation(comparisonProducts);

        // Build response, preserving original selection order
        ComparisonResponseDTO response = new ComparisonResponseDTO();
        response.setProducts(comparisonProducts);
        response.setComparativeNarrative(aiResult.text());
        response.setFallbackUsed(aiResult.fallbackUsed());
        response.setRankingOrder(selectedIds);

        return response;
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

    private ComparisonProductDTO mapToComparisonProductDTO(Product product) {
        ComparisonProductDTO dto = new ComparisonProductDTO();
        ProductAttribute attr = product.getAttribute();

        dto.setProductId(product.getId());
        dto.setProductName(product.getName());
        dto.setBrandName(product.getBrand() != null ? product.getBrand().getName() : null);
        dto.setBasePrice(product.getBasePrice().doubleValue());
        dto.setTotalScore(null); // Will be populated from recommendation scores
        dto.setStrategyScores(Map.of()); // Empty, will come from recommendation context
        dto.setMatchedRuleNames(List.of());
        dto.setTradeOffs(List.of());

        // Build attribute list
        List<ComparisonAttributeDTO> attributes = new ArrayList<>();
        if (attr != null) {
            attributes.add(new ComparisonAttributeDTO("Durability", attr.getDurabilityRating() != null ? String.valueOf(attr.getDurabilityRating()) : "N/A"));
            attributes.add(new ComparisonAttributeDTO("Maintenance", attr.getMaintenanceLevel() != null ? attr.getMaintenanceLevel().toString() : "N/A"));
            attributes.add(new ComparisonAttributeDTO("Climate", attr.getClimateSuitability() != null ? attr.getClimateSuitability().toString() : "N/A"));
            attributes.add(new ComparisonAttributeDTO("Budget Level", attr.getBudgetLevel() != null ? attr.getBudgetLevel().toString() : "N/A"));
            attributes.add(new ComparisonAttributeDTO("Size", attr.getSize() != null ? attr.getSize().toString() : "N/A"));
            attributes.add(new ComparisonAttributeDTO("Material", attr.getMaterial() != null ? attr.getMaterial().toString() : "N/A"));
            attributes.add(new ComparisonAttributeDTO("Usage Area", attr.getUsageArea() != null ? attr.getUsageArea() : "N/A"));
        } else {
            // Fallback: all N/A
            attributes.add(new ComparisonAttributeDTO("Durability", "N/A"));
            attributes.add(new ComparisonAttributeDTO("Maintenance", "N/A"));
            attributes.add(new ComparisonAttributeDTO("Climate", "N/A"));
            attributes.add(new ComparisonAttributeDTO("Budget Level", "N/A"));
            attributes.add(new ComparisonAttributeDTO("Size", "N/A"));
            attributes.add(new ComparisonAttributeDTO("Material", "N/A"));
            attributes.add(new ComparisonAttributeDTO("Usage Area", "N/A"));
        }
        dto.setAttributes(attributes);

        return dto;
    }
}
