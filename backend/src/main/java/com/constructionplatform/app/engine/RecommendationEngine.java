package com.constructionplatform.app.engine;

import com.constructionplatform.app.engine.strategy.RecommendationStrategy;
import com.constructionplatform.app.entity.Product;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Core recommendation engine that aggregates multiple strategy evaluations
 * with weighted scoring. Every product receives a score — no products are
 * filtered out completely. Mismatches receive low (but non-zero) scores.
 *
 * <p>Weighted scoring formula:
 * <pre>
 * Final Score = (Budget × 0.25) + (Environment × 0.25) + (Performance × 0.25)
 *            + (Style × 0.15) + (Maintenance × 0.10)
 * </pre>
 */
@Component
public class RecommendationEngine {

    private static final Logger log = LoggerFactory.getLogger(RecommendationEngine.class);

    private static final Map<String, Double> STRATEGY_WEIGHTS = Map.of(
            "BUDGET", 0.25,
            "ENVIRONMENT", 0.25,
            "PERFORMANCE", 0.25,
            "STYLE", 0.15,
            "MAINTENANCE", 0.10
    );

    /** Default weight for any strategy not explicitly listed above. */
    private static final double DEFAULT_WEIGHT = 0.10;

    private final List<RecommendationStrategy> strategies;

    public RecommendationEngine(List<RecommendationStrategy> strategies) {
        this.strategies = strategies;
        log.info("RecommendationEngine initialized with {} strategies: {}",
                strategies.size(),
                strategies.stream().map(RecommendationStrategy::getStrategyName).toList());
    }

    /**
     * Score and rank all given products based on user answers.
     *
     * @param products    candidate products (should already be filtered by category if applicable)
     * @param userAnswers the user's questionnaire answers
     * @param topN        maximum number of results to return
     * @return ranked list of scored products (highest score first)
     */
    public List<ProductScore> recommend(List<Product> products, UserAnswers userAnswers, int topN) {
        List<ProductScore> scoredProducts = new ArrayList<>();

        for (Product product : products) {
            ProductScore ps = scoreProduct(product, userAnswers);
            scoredProducts.add(ps);
        }

        // Sort by total score descending, then by product name for deterministic order
        scoredProducts.sort(Comparator
                .comparingDouble(ProductScore::getTotalScore).reversed()
                .thenComparing(ps -> ps.getProduct().getName()));

        // Return top N results
        return scoredProducts.stream()
                .limit(topN)
                .collect(Collectors.toList());
    }

    /**
     * Score a single product across all strategies.
     */
    private ProductScore scoreProduct(Product product, UserAnswers userAnswers) {
        ProductScore ps = new ProductScore();
        ps.setProduct(product);

        Map<String, Double> strategyScores = new LinkedHashMap<>();
        List<String> tradeOffs = new ArrayList<>();
        double totalWeightedScore = 0.0;

        for (RecommendationStrategy strategy : strategies) {
            double rawScore = strategy.evaluate(product, userAnswers);
            String stratName = strategy.getStrategyName();
            double weight = STRATEGY_WEIGHTS.getOrDefault(stratName, DEFAULT_WEIGHT);

            strategyScores.put(stratName, rawScore);
            totalWeightedScore += rawScore * weight;

            // Detect trade-offs: high score in one critical area but low in another
            if (rawScore <= 3.0 && weight >= 0.20) {
                tradeOffs.add(stratName + " score is low (" + String.format("%.1f", rawScore) + "/10)");
            }
        }

        ps.setTotalScore(Math.round(totalWeightedScore * 100.0) / 100.0);
        ps.setStrategyScores(strategyScores);
        ps.setTradeOffs(tradeOffs);

        return ps;
    }

    /**
     * Holds the score breakdown for a single product.
     */
    public static class ProductScore {
        private Product product;
        private double totalScore;
        private Map<String, Double> strategyScores = new LinkedHashMap<>();
        private List<String> tradeOffs = new ArrayList<>();

        public Product getProduct() {
            return product;
        }

        public void setProduct(Product product) {
            this.product = product;
        }

        public double getTotalScore() {
            return totalScore;
        }

        public void setTotalScore(double totalScore) {
            this.totalScore = totalScore;
        }

        public Map<String, Double> getStrategyScores() {
            return strategyScores;
        }

        public void setStrategyScores(Map<String, Double> strategyScores) {
            this.strategyScores = strategyScores;
        }

        public List<String> getTradeOffs() {
            return tradeOffs;
        }

        public void setTradeOffs(List<String> tradeOffs) {
            this.tradeOffs = tradeOffs;
        }
    }
}
