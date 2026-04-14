package com.constructionplatform.app.controller;

import com.constructionplatform.app.engine.AdjustedProductScore;
import com.constructionplatform.app.engine.DynamicRuleEngine;
import com.constructionplatform.app.entity.Product;
import com.constructionplatform.app.repository.ProductRepository;
import com.constructionplatform.app.service.AnswerNormalizationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * Debug endpoints to inspect how the AI normalizer and dynamic rule engine
 * transform data through the recommendation pipeline.
 */
@RestController
@RequestMapping("/api/public/debug")
public class RecommendationDebugController {

    private final AnswerNormalizationService normalizationService;
    private final DynamicRuleEngine dynamicRuleEngine;
    private final ProductRepository productRepository;

    public RecommendationDebugController(AnswerNormalizationService normalizationService,
                                          DynamicRuleEngine dynamicRuleEngine,
                                          ProductRepository productRepository) {
        this.normalizationService = normalizationService;
        this.dynamicRuleEngine = dynamicRuleEngine;
        this.productRepository = productRepository;
    }

    @PostMapping("/normalize")
    public ResponseEntity<Map<String, Object>> testNormalization(@RequestBody Map<String, Object> request) {
        String category = (String) request.getOrDefault("category", "Unknown");

        @SuppressWarnings("unchecked")
        Map<String, String> rawAnswers = (Map<String, String>) request.getOrDefault("answers", Map.of());

        Map<String, String> aiNormalized = normalizationService.normalize(category, rawAnswers);
        Map<String, String> fallbackNormalized = normalizationService.fallbackNormalize(category, rawAnswers);

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

    @PostMapping("/rule-impact")
    public ResponseEntity<Map<String, Object>> testRuleImpact(@RequestBody Map<String, Object> request) {
        String category = (String) request.getOrDefault("category", "Unknown");

        @SuppressWarnings("unchecked")
        Map<String, String> rawAnswers = (Map<String, String>) request.getOrDefault("answers", Map.of());

        Map<String, String> normalized = normalizationService.normalize(category, rawAnswers);

        List<Product> candidates = loadCandidates(category);
        if (candidates.isEmpty()) {
            return ResponseEntity.ok(Map.of("message", "No products found for category: " + category));
        }

        // Run dynamic rule engine
        List<AdjustedProductScore> scoredProducts = dynamicRuleEngine.scoreProducts(candidates, normalized, 10);

        List<Map<String, Object>> products = new ArrayList<>();
        for (AdjustedProductScore adj : scoredProducts) {
            Map<String, Object> row = new LinkedHashMap<>();
            row.put("productName", adj.getProduct().getName());
            row.put("category", adj.getProduct().getCategory() != null ? adj.getProduct().getCategory().getName() : "—");
            row.put("baseScore", round(adj.getStrategyScore()));
            row.put("ruleAdjustment", round(adj.getRuleAdjustment()));
            row.put("finalScore", round(adj.getFinalScore()));
            row.put("scoreDelta", adj.getRuleAdjustment() != 0
                    ? (adj.getRuleAdjustment() > 0 ? "+" : "") + round(adj.getRuleAdjustment())
                    : "—");
            row.put("excluded", adj.isExcluded());
            row.put("appliedRules", adj.getAppliedRuleNames());
            row.put("excludedByRules", adj.getExcludedByRules());
            row.put("ruleBreakdown", adj.getStrategyScores());
            row.put("tradeOffs", adj.getTradeOffs());
            products.add(row);
        }

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("category", category);
        result.put("normalizedAnswers", normalized);
        result.put("totalProducts", products.size());
        result.put("excludedCount", scoredProducts.stream().filter(AdjustedProductScore::isExcluded).count());
        result.put("products", products);

        return ResponseEntity.ok(result);
    }

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
