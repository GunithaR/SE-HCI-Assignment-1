package com.constructionplatform.app.engine.strategy;

import com.constructionplatform.app.engine.UserAnswers;
import com.constructionplatform.app.entity.Product;
import com.constructionplatform.app.entity.ProductAttribute;
import org.springframework.stereotype.Component;

/**
 * Evaluates how well a product fits the intended usage area.
 * Maps usage answers (living room, bathroom, outdoor, commercial, etc.)
 * to product attributes like water resistance, slip resistance, and usage area.
 */
@Component
public class UsageStrategy implements RecommendationStrategy {

    @Override
    public double evaluate(Product product, UserAnswers answers) {
        ProductAttribute attr = product.getAttribute();
        if (attr == null) {
            return 2.0;
        }

        // Check flooring usage area (Flooring Q1)
        String flooringUsage = answers.getAnswer("flooring_usage");
        // Check wall usage area (Wall Q1)
        String wallUsage = answers.getAnswer("wall_usage");
        // Check ceiling room type (Ceiling Q2)
        String roomType = answers.getAnswer("room_type");
        // Check traffic level (Flooring Q2)
        String traffic = answers.getAnswer("traffic");
        // Check accessory type (Accessories Q1)
        String accessoryType = answers.getAnswer("accessory_type");
        // Check accessory usage duration (Accessories Q3)
        String usageDuration = answers.getAnswer("usage_duration");

        double score = 5.0;
        int factors = 0;
        double totalScore = 0.0;

        // Evaluate flooring usage
        if (flooringUsage != null && !flooringUsage.isBlank()) {
            totalScore += evaluateFlooringUsage(flooringUsage, attr);
            factors++;
        }

        // Evaluate wall usage
        if (wallUsage != null && !wallUsage.isBlank()) {
            totalScore += evaluateWallUsage(wallUsage, attr);
            factors++;
        }

        // Evaluate room type
        if (roomType != null && !roomType.isBlank()) {
            totalScore += evaluateRoomType(roomType, attr);
            factors++;
        }

        // Evaluate traffic level
        if (traffic != null && !traffic.isBlank()) {
            totalScore += evaluateTraffic(traffic, attr);
            factors++;
        }

        // Evaluate accessory compatibility
        if (accessoryType != null && !accessoryType.isBlank()) {
            totalScore += evaluateAccessoryType(accessoryType, attr);
            factors++;
        }

        // Evaluate usage duration
        if (usageDuration != null && !usageDuration.isBlank()) {
            totalScore += evaluateUsageDuration(usageDuration, attr);
            factors++;
        }

        if (factors > 0) {
            score = totalScore / factors;
        }

        return score;
    }

    @Override
    public String getStrategyName() {
        return "USAGE";
    }

    private double evaluateFlooringUsage(String usage, ProductAttribute attr) {
        return switch (usage.toLowerCase()) {
            case "bathroom", "bathroom/wet area", "wet area" -> {
                double water = scoreResistance(attr.getWaterResistance());
                double slip = scoreResistance(attr.getSlipResistance());
                yield (water + slip) / 2.0;
            }
            case "outdoor" -> {
                double water = scoreResistance(attr.getWaterResistance());
                double heat = scoreResistance(attr.getHeatResistance());
                yield (water + heat) / 2.0;
            }
            case "commercial" -> scoreDurability(attr.getDurabilityRating(), 8);
            case "living/bedroom", "living", "bedroom" -> 7.0; // Most products work
            default -> 5.0;
        };
    }

    private double evaluateWallUsage(String usage, ProductAttribute attr) {
        return switch (usage.toLowerCase()) {
            case "bathroom" -> scoreResistance(attr.getWaterResistance());
            case "kitchen" -> {
                double water = scoreResistance(attr.getWaterResistance());
                double heat = scoreResistance(attr.getHeatResistance());
                yield (water + heat) / 2.0;
            }
            case "living room", "bedroom" -> 7.0;
            default -> 5.0;
        };
    }

    private double evaluateRoomType(String roomType, ProductAttribute attr) {
        return switch (roomType.toLowerCase()) {
            case "kitchen" -> scoreResistance(attr.getHeatResistance());
            case "office" -> scoreResistance(attr.getNoiseReduction());
            case "living room", "bedroom" -> 7.0;
            default -> 5.0;
        };
    }

    private double evaluateTraffic(String traffic, ProductAttribute attr) {
        return switch (traffic.toLowerCase()) {
            case "high" -> scoreDurability(attr.getDurabilityRating(), 8);
            case "medium" -> scoreDurability(attr.getDurabilityRating(), 5);
            case "low" -> 7.0; // Low traffic — most products are fine
            default -> 5.0;
        };
    }

    private double evaluateAccessoryType(String type, ProductAttribute attr) {
        return switch (type.toLowerCase()) {
            case "installation" -> scoreDurability(attr.getDurabilityRating(), 6);
            case "finishing" -> 7.0;
            case "decorative" -> 6.0;
            default -> 5.0;
        };
    }

    private double evaluateUsageDuration(String duration, ProductAttribute attr) {
        return switch (duration.toLowerCase()) {
            case "long-term" -> scoreDurability(attr.getDurabilityRating(), 7);
            case "one-time" -> 7.0; // Any durability is fine
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

    private double scoreDurability(Integer durabilityRating, int threshold) {
        if (durabilityRating == null) return 3.0;
        if (durabilityRating >= threshold) return 10.0;
        if (durabilityRating >= threshold - 2) return 6.0;
        return 2.0;
    }
}
