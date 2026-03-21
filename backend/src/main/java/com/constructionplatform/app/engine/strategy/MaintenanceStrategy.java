package com.constructionplatform.app.engine.strategy;

import com.constructionplatform.app.engine.UserAnswers;
import com.constructionplatform.app.entity.Product;
import com.constructionplatform.app.entity.ProductAttribute;
import org.springframework.stereotype.Component;

/**
 * Evaluates how well a product's maintenance requirements match the user's preference.
 * Score: 10 = exact match, 5 = adjacent level, 2 = mismatch.
 */
@Component
public class MaintenanceStrategy implements RecommendationStrategy {

    @Override
    public double evaluate(Product product, UserAnswers answers) {
        String maintenanceAnswer = answers.getAnswer("maintenance");
        if (maintenanceAnswer == null || maintenanceAnswer.isBlank()) {
            return 5.0; // Neutral
        }

        ProductAttribute attr = product.getAttribute();
        if (attr == null || attr.getMaintenanceLevel() == null) {
            return 3.0;
        }

        String userPref = normalizeMaintenance(maintenanceAnswer);
        String productLevel = attr.getMaintenanceLevel().name();

        if (userPref.equals(productLevel)) {
            return 10.0;
        }

        // Users wanting LOW maintenance prefer products that also need LOW maintenance
        // So we match the preference direction
        int userRank = maintenanceRank(userPref);
        int productRank = maintenanceRank(productLevel);
        int diff = Math.abs(userRank - productRank);

        if (diff == 1) {
            return 5.0;
        }

        return 2.0;
    }

    @Override
    public String getStrategyName() {
        return "MAINTENANCE";
    }

    private String normalizeMaintenance(String answer) {
        return switch (answer.toLowerCase()) {
            case "very low", "low", "minimal" -> "LOW";
            case "medium", "moderate", "occasional" -> "MEDIUM";
            case "high", "regular" -> "HIGH";
            default -> "MEDIUM";
        };
    }

    private int maintenanceRank(String level) {
        return switch (level) {
            case "LOW" -> 1;
            case "MEDIUM" -> 2;
            case "HIGH" -> 3;
            default -> 2;
        };
    }
}
