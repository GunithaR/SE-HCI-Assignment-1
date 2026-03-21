package com.constructionplatform.app.service;

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

    public RecommendationService(ProductRepository productRepository,
                                  RecommendationEngine recommendationEngine) {
        this.productRepository = productRepository;
        this.recommendationEngine = recommendationEngine;
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
}
