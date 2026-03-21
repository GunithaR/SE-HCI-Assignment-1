package com.constructionplatform.app.engine.strategy;

import com.constructionplatform.app.engine.UserAnswers;
import com.constructionplatform.app.entity.Product;
import com.constructionplatform.app.entity.ProductAttribute;
import org.springframework.stereotype.Component;

/**
 * Evaluates how well a product's price/budget level matches the user's budget preference.
 * Score: 10 = exact match, 5 = adjacent level, 2 = mismatch.
 */
@Component
public class BudgetStrategy implements RecommendationStrategy {

    @Override
    public double evaluate(Product product, UserAnswers answers) {
        String budgetAnswer = answers.getAnswer("budget");
        if (budgetAnswer == null || budgetAnswer.isBlank()) {
            return 5.0; // Neutral if not answered
        }

        ProductAttribute attr = product.getAttribute();
        if (attr == null || attr.getBudgetLevel() == null) {
            return 3.0;
        }

        String userBudget = normalizeBudget(budgetAnswer);
        String productBudget = attr.getBudgetLevel().name();

        if (userBudget.equals(productBudget)) {
            return 10.0; // Exact match
        }

        // Adjacent match (e.g., user wants MEDIUM, product is LOW or HIGH)
        int userRank = budgetRank(userBudget);
        int productRank = budgetRank(productBudget);
        int diff = Math.abs(userRank - productRank);

        if (diff == 1) {
            return 5.0; // One level away
        }

        return 2.0; // Two levels apart
    }

    @Override
    public String getStrategyName() {
        return "BUDGET";
    }

    private String normalizeBudget(String answer) {
        return switch (answer.toLowerCase()) {
            case "economy", "low", "affordable", "cost", "budget" -> "LOW";
            case "mid-range", "mid", "medium", "moderate" -> "MEDIUM";
            case "premium", "high", "luxury" -> "HIGH";
            default -> "MEDIUM";
        };
    }

    private int budgetRank(String level) {
        return switch (level) {
            case "LOW" -> 1;
            case "MEDIUM" -> 2;
            case "HIGH" -> 3;
            default -> 2;
        };
    }
}
