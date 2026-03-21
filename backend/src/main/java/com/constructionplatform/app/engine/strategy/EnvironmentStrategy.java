package com.constructionplatform.app.engine.strategy;

import com.constructionplatform.app.engine.UserAnswers;
import com.constructionplatform.app.entity.Product;
import com.constructionplatform.app.entity.ProductAttribute;
import org.springframework.stereotype.Component;

/**
 * Evaluates how well a product suits the user's environmental conditions.
 * Maps location answers (coastal, heavy rain, hot/dry, humid) to product resistance attributes.
 * Score: 10 = product has HIGH resistance for needed attribute, 5 = MEDIUM, 2 = LOW/missing.
 */
@Component
public class EnvironmentStrategy implements RecommendationStrategy {

    @Override
    public double evaluate(Product product, UserAnswers answers) {
        ProductAttribute attr = product.getAttribute();
        if (attr == null) {
            return 2.0;
        }

        // Check location-based answer (Roofing Q1)
        String location = answers.getAnswer("location");
        // Check environment answer (Wall Q3, general)
        String environment = answers.getAnswer("environment");
        // Check usage environment (Accessories Q4)
        String envUsage = answers.getAnswer("usage_environment");

        double score = 5.0; // Neutral default

        if (location != null && !location.isBlank()) {
            score = evaluateLocation(location, attr);
        } else if (environment != null && !environment.isBlank()) {
            score = evaluateEnvironment(environment, attr);
        } else if (envUsage != null && !envUsage.isBlank()) {
            score = evaluateUsageEnvironment(envUsage, attr);
        }

        return score;
    }

    @Override
    public String getStrategyName() {
        return "ENVIRONMENT";
    }

    private double evaluateLocation(String location, ProductAttribute attr) {
        return switch (location.toLowerCase()) {
            case "coastal", "coastal area" -> scoreResistance(attr.getCorrosionResistance());
            case "heavy rain", "heavy rain area" -> scoreResistance(attr.getWaterResistance());
            case "hot/dry", "hot/dry area" -> scoreResistance(attr.getHeatResistance());
            case "urban/normal", "urban", "normal" -> 7.0; // Most products work fine
            default -> 5.0;
        };
    }

    private double evaluateEnvironment(String environment, ProductAttribute attr) {
        return switch (environment.toLowerCase()) {
            case "humid" -> scoreResistance(attr.getWaterResistance());
            case "dry" -> scoreResistance(attr.getHeatResistance());
            case "normal" -> 7.0;
            default -> 5.0;
        };
    }

    private double evaluateUsageEnvironment(String env, ProductAttribute attr) {
        return switch (env.toLowerCase()) {
            case "outdoor" -> {
                double water = scoreResistance(attr.getWaterResistance());
                double corrosion = scoreResistance(attr.getCorrosionResistance());
                yield (water + corrosion) / 2.0;
            }
            case "indoor" -> 7.0; // Most products are fine indoors
            default -> 5.0;
        };
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
