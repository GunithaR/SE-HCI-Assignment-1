package com.constructionplatform.app.engine.strategy;

import com.constructionplatform.app.engine.UserAnswers;
import com.constructionplatform.app.entity.Product;

/**
 * Strategy Pattern interface for product recommendation scoring.
 * Each implementation evaluates a specific dimension (budget, environment, etc.)
 * and returns a score between 0 and 10.
 */
public interface RecommendationStrategy {

    /**
     * Evaluate a product against the user's answers for a specific dimension.
     *
     * @param product the product to evaluate
     * @param answers the user's questionnaire answers
     * @return a score between 0.0 and 10.0 (higher = better match)
     */
    double evaluate(Product product, UserAnswers answers);

    /**
     * @return the name of this strategy (e.g., "BUDGET", "ENVIRONMENT")
     */
    String getStrategyName();
}
