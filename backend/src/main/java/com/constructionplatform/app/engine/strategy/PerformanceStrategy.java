package com.constructionplatform.app.engine.strategy;

import com.constructionplatform.app.engine.UserAnswers;
import com.constructionplatform.app.entity.Product;
import com.constructionplatform.app.entity.ProductAttribute;
import org.springframework.stereotype.Component;

/**
 * Evaluates how well a product meets performance-related concerns.
 * Maps "main concern" / "priority" / "main goal" answers to product attributes
 * like durability, noise reduction, heat resistance, and water resistance.
 */
@Component
public class PerformanceStrategy implements RecommendationStrategy {

    @Override
    public double evaluate(Product product, UserAnswers answers) {
        ProductAttribute attr = product.getAttribute();
        if (attr == null) {
            return 2.0;
        }

        // Check main concern (Roofing Q2)
        String concern = answers.getAnswer("concern");
        // Check priority (Flooring Q3, Wall Q2, Accessories Q2)
        String priority = answers.getAnswer("priority");
        // Check main goal (Ceiling Q1)
        String goal = answers.getAnswer("goal");
        // Check slip resistance needed (Flooring Q4)
        String slipNeeded = answers.getAnswer("slip_resistance");

        double score = 5.0;
        int factors = 0;
        double totalScore = 0.0;

        if (concern != null && !concern.isBlank()) {
            totalScore += evaluateConcern(concern, attr);
            factors++;
        }

        if (priority != null && !priority.isBlank()) {
            totalScore += evaluatePriority(priority, attr);
            factors++;
        }

        if (goal != null && !goal.isBlank()) {
            totalScore += evaluateGoal(goal, attr);
            factors++;
        }

        if (slipNeeded != null && !slipNeeded.isBlank()) {
            totalScore += evaluateSlipResistance(slipNeeded, attr);
            factors++;
        }

        if (factors > 0) {
            score = totalScore / factors;
        }

        return score;
    }

    @Override
    public String getStrategyName() {
        return "PERFORMANCE";
    }

    private double evaluateConcern(String concern, ProductAttribute attr) {
        return switch (concern.toLowerCase()) {
            case "keep cost low", "affordable", "cost" -> 5.0; // Handled by BudgetStrategy
            case "keep house cool", "heat reduction" -> scoreResistance(attr.getHeatResistance());
            case "long-lasting", "long lasting", "durability" -> scoreResistance(attr.getDurabilityRating());
            case "reduce noise", "noise", "sound insulation" -> scoreResistance(attr.getNoiseReduction());
            default -> 5.0;
        };
    }

    private double evaluatePriority(String priority, ProductAttribute attr) {
        return switch (priority.toLowerCase()) {
            case "affordable", "cost", "budget" -> 5.0; // Handled by BudgetStrategy
            case "appearance", "decoration" -> 7.0; // Style handles appearance
            case "long-lasting", "durability" -> scoreResistance(attr.getDurabilityRating());
            case "easy to clean", "easy cleaning", "protection" -> scoreResistance(attr.getWaterResistance());
            case "compatibility" -> 6.0; // Neutral
            default -> 5.0;
        };
    }

    private double evaluateGoal(String goal, ProductAttribute attr) {
        return switch (goal.toLowerCase()) {
            case "appearance" -> 7.0; // Style handles this
            case "heat reduction" -> scoreResistance(attr.getHeatResistance());
            case "hide wiring" -> 7.0; // Most ceiling solutions handle this
            case "sound insulation" -> scoreResistance(attr.getNoiseReduction());
            default -> 5.0;
        };
    }

    private double evaluateSlipResistance(String needed, ProductAttribute attr) {
        if ("yes".equalsIgnoreCase(needed)) {
            return scoreResistance(attr.getSlipResistance());
        }
        return 7.0; // Not needed — most products are fine
    }

    private double scoreResistance(ProductAttribute.ResistanceLevel level) {
        if (level == null) return 3.0;
        return switch (level) {
            case HIGH -> 10.0;
            case MEDIUM -> 6.0;
            case LOW -> 2.0;
        };
    }
}
