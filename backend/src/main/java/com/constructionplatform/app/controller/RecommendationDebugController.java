package com.constructionplatform.app.controller;

import com.constructionplatform.app.engine.AdjustedProductScore;
import com.constructionplatform.app.engine.RecommendationEngine;
import com.constructionplatform.app.engine.RecommendationEngine.ProductScore;
import com.constructionplatform.app.engine.RulePostProcessor;
import com.constructionplatform.app.engine.UserAnswers;
import com.constructionplatform.app.entity.Product;
import com.constructionplatform.app.repository.ProductRepository;
import com.constructionplatform.app.service.AnswerNormalizationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Debug endpoints to inspect how the AI normalizer and rule post-processor
 * transform data through the recommendation pipeline.
 *
 * <p>These endpoints are public and intended for development/demo use only.
 * In production, they should be secured or removed.</p>
 */
@RestController
@RequestMapping("/api/public/debug")
public class RecommendationDebugController {

    private final AnswerNormalizationService normalizationService;
    private final RecommendationEngine recommendationEngine;
    private final RulePostProcessor rulePostProcessor;
    private final ProductRepository productRepository;

    public RecommendationDebugController(AnswerNormalizationService normalizationService,
                                          RecommendationEngine recommendationEngine,
                                          RulePostProcessor rulePostProcessor,
                                          ProductRepository productRepository) {
        this.normalizationService = normalizationService;
        this.recommendationEngine = recommendationEngine;
        this.rulePostProcessor = rulePostProcessor;
        this.productRepository = productRepository;
    }

    // ── 1. Test AI Normalization ─────────────────────────────────────────────

    /**
     * POST /api/public/debug/normalize
     *
     * Test how the AI normalizer converts raw user answers into system values.
     *
     * Request body example:
     * {
     *   "category": "Roofing Solution",
     *   "answers": {
     *     "budget": "economy",
     *     "location": "coastal area",
     *     "maintenance": "very low",
     *     "style": "modern"
     *   }
     * }
     */
    @PostMapping("/normalize")
    public ResponseEntity<Map<String, Object>> testNormalization(@RequestBody Map<String, Object> request) {
        String category = (String) request.getOrDefault("category", "Unknown");

        @SuppressWarnings("unchecked")
        Map<String, String> rawAnswers = (Map<String, String>) request.getOrDefault("answers", Map.of());

        // Run AI normalization
        Map<String, String> aiNormalized = normalizationService.normalize(category, rawAnswers);

        // Also run fallback normalization for comparison
        Map<String, String> fallbackNormalized = normalizationService.fallbackNormalize(category, rawAnswers);

        // Build comparison
        List<Map<String, String>> comparison = new ArrayList<>();
        for (String key : rawAnswers.keySet()) {
            Map<String, String> row = new LinkedHashMap<>();
            row.put("field", key);
            row.put("rawInput", rawAnswers.get(key));
            row.put("aiNormalized", aiNormalized.getOrDefault(key, "—"));
            row.put("fallbackNormalized", fallbackNormalized.getOrDefault(key, "—"));
            row.put("match", aiNormalized.getOrDefault(key, "").equals(fallbackNormalized.getOrDefault(key, "")) ? "✅" : "⚠️ different");
            comparison.add(row);
        }

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("category", category);
        result.put("rawAnswers", rawAnswers);
        result.put("aiNormalized", aiNormalized);
        result.put("fallbackNormalized", fallbackNormalized);
        result.put("comparison", comparison);

        return ResponseEntity.ok(result);
    }

    // ── 2. Rule Impact Analysis ─────────────────────────────────────────────

    /**
     * POST /api/public/debug/rule-impact
     *
     * Shows how rules affect scores — comparing BEFORE (strategy-only) vs AFTER (with rules).
     *
     * Request body: same as /api/public/recommendations
     * {
     *   "category": "Roofing Solution",
     *   "answers": { "budget": "economy", "location": "coastal area" }
     * }
     */
    @PostMapping("/rule-impact")
    public ResponseEntity<Map<String, Object>> testRuleImpact(@RequestBody Map<String, Object> request) {
        String category = (String) request.getOrDefault("category", "Unknown");

        @SuppressWarnings("unchecked")
        Map<String, String> rawAnswers = (Map<String, String>) request.getOrDefault("answers", Map.of());

        // Step 1: Normalize
        Map<String, String> normalized = normalizationService.normalize(category, rawAnswers);

        // Step 2: Load candidates
        List<Product> candidates = loadCandidates(category);
        if (candidates.isEmpty()) {
            return ResponseEntity.ok(Map.of("message", "No products found for category: " + category));
        }

        // Step 3: Strategy scoring
        UserAnswers userAnswers = new UserAnswers(category, normalized);
        List<ProductScore> strategyScores = recommendationEngine.recommend(candidates, userAnswers, 10);

        // Step 4: Rule post-processing
        List<AdjustedProductScore> adjustedScores = rulePostProcessor.applyRules(strategyScores, normalized);

        // Build comparison table: before vs after
        List<Map<String, Object>> products = new ArrayList<>();
        for (AdjustedProductScore adj : adjustedScores) {
            Map<String, Object> row = new LinkedHashMap<>();
            row.put("productName", adj.getProduct().getName());
            row.put("category", adj.getProduct().getCategory() != null ? adj.getProduct().getCategory().getName() : "—");
            row.put("strategyScore", round(adj.getStrategyScore()));
            row.put("ruleAdjustment", round(adj.getRuleAdjustment()));
            row.put("finalScore", round(adj.getFinalScore()));
            row.put("scoreDelta", adj.getRuleAdjustment() != 0
                    ? (adj.getRuleAdjustment() > 0 ? "+" : "") + round(adj.getRuleAdjustment())
                    : "—");
            row.put("excluded", adj.isExcluded());
            row.put("appliedRules", adj.getAppliedRuleNames());
            row.put("excludedByRules", adj.getExcludedByRules());
            row.put("strategyBreakdown", adj.getStrategyScores());
            row.put("tradeOffs", adj.getTradeOffs());
            products.add(row);
        }

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("category", category);
        result.put("normalizedAnswers", normalized);
        result.put("totalProducts", products.size());
        result.put("excludedCount", adjustedScores.stream().filter(AdjustedProductScore::isExcluded).count());
        result.put("rulesAppliedCount", adjustedScores.stream()
                .mapToInt(a -> a.getAppliedRuleNames().size())
                .sum());
        result.put("products", products);

        return ResponseEntity.ok(result);
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    private List<Product> loadCandidates(String category) {
        List<Product> products = productRepository.findByCategoryNameAndIsActiveTrue(category);
        if (!products.isEmpty()) return products;

        String simpleName = category.replace(" Solution", "").trim();
        products = productRepository.findByCategoryNameContainingAndIsActiveTrue(simpleName);
        if (!products.isEmpty()) return products;

        return productRepository.findByIsActiveTrue();
    }

    private double round(double value) {
        return Math.round(value * 10.0) / 10.0;
    }
}
