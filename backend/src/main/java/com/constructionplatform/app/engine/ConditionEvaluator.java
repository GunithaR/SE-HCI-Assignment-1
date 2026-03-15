package com.constructionplatform.app.engine;

import com.constructionplatform.app.entity.Product;
import com.constructionplatform.app.entity.ProductAttribute;
import com.constructionplatform.app.entity.RuleCondition;
import com.constructionplatform.app.enums.OperandSource;
import org.springframework.stereotype.Component;

@Component
public class ConditionEvaluator {

    public boolean evaluate(RuleCondition condition, InputProfile inputProfile, Product product) {
        String actualValue = resolveValue(condition, inputProfile, product);
        
        if (actualValue == null) {
            return false; // Safely fail if value is missing for comparison
        }

        return compare(actualValue, condition.getOperator().name(), condition.getExpectedValue());
    }

    public boolean evaluateDynamic(String dynamicAttr, InputProfile inputProfile, Product product) {
        String inputValue = resolveFromInput(dynamicAttr, inputProfile);
        
        if (inputValue == null) {
            return false;
        }
        
        // Map the input attribute name to the underlying product attribute name to reuse resolution logic
        String targetProductAttr = mapInputToProductAttr(dynamicAttr);
        String productValue = resolveFromProduct(targetProductAttr, product);
        
        if (productValue == null) {
            return false;
        }
        
        // Dynamic match means they must inherently EQUAL each other OR product supports "ALL"
        if (productValue.equalsIgnoreCase("ALL")) {
            return true;
        }

        return inputValue.equalsIgnoreCase(productValue);
    }

    private String mapInputToProductAttr(String inputAttr) {
        return switch (inputAttr) {
            case "budget" -> "budgetLevel";
            case "climate" -> "climateSuitability";
            case "style" -> "style";
            case "durabilityPreference" -> "durabilityRating"; // In practice, numeric rating might need specific mapping but keeping it simple
            case "maintenancePreference" -> "maintenanceLevel";
            case "houseType" -> "categoryName"; // Technically unstructured but mapped
            default -> inputAttr;
        };
    }

    private String resolveValue(RuleCondition condition, InputProfile profile, Product product) {
        if (condition.getOperandSource() == OperandSource.INPUT) {
            return resolveFromInput(condition.getAttributeName(), profile);
        } else if (condition.getOperandSource() == OperandSource.PRODUCT) {
            return resolveFromProduct(condition.getAttributeName(), product);
        }
        throw new IllegalArgumentException("Unsupported operand source: " + condition.getOperandSource());
    }

    private String resolveFromInput(String attributeName, InputProfile profile) {
        if (profile == null) return null;

        return switch (attributeName) {
            case "budget" -> profile.getBudget();
            case "climate" -> profile.getClimate();
            case "style" -> profile.getStyle();
            case "durabilityPreference" -> profile.getDurabilityPreference();
            case "maintenancePreference" -> profile.getMaintenancePreference();
            case "houseType" -> profile.getHouseType();
            default -> throw new IllegalArgumentException("Unsupported input attribute: " + attributeName);
        };
    }

    private String resolveFromProduct(String attributeName, Product product) {
        if (product == null) return null;

        if ("categoryName".equals(attributeName)) {
            return product.getCategory() != null ? product.getCategory().getName() : null;
        }

        ProductAttribute attr = product.getAttribute();
        if (attr == null) return null;

        return switch (attributeName) {
            case "budgetLevel" -> attr.getBudgetLevel() != null ? attr.getBudgetLevel().name() : null;
            case "climateSuitability" -> attr.getClimateSuitability() != null ? attr.getClimateSuitability().name() : null;
            case "style" -> attr.getStyle();
            case "durabilityRating" -> attr.getDurabilityRating() != null ? attr.getDurabilityRating().toString() : null;
            case "maintenanceLevel" -> attr.getMaintenanceLevel() != null ? attr.getMaintenanceLevel().name() : null;
            default -> throw new IllegalArgumentException("Unsupported product attribute: " + attributeName);
        };
    }

    private boolean compare(String actual, String operator, String expected) {
        if (actual == null || expected == null) return false;

        // Attempt numeric comparison if both are valid numbers
        try {
            double actualNum = Double.parseDouble(actual);
            double expectedNum = Double.parseDouble(expected);
            
            return switch (operator) {
                case "EQUALS" -> actualNum == expectedNum;
                case "NOT_EQUALS" -> actualNum != expectedNum;
                case "GREATER_THAN" -> actualNum > expectedNum;
                case "LESS_THAN" -> actualNum < expectedNum;
                case "GREATER_OR_EQUAL" -> actualNum >= expectedNum;
                case "LESS_OR_EQUAL" -> actualNum <= expectedNum;
                default -> false; // Fallback to string if operators like CONTAINS were passed to numeric
            };
        } catch (NumberFormatException e) {
            // Not a numeric comparison, fallback to string comparison
            return switch (operator) {
                case "EQUALS" -> actual.equalsIgnoreCase(expected);
                case "NOT_EQUALS" -> !actual.equalsIgnoreCase(expected);
                case "CONTAINS" -> actual.toLowerCase().contains(expected.toLowerCase());
                // String comparison for greater/less is generally unsupported unless lexically required,
                // but for rule engines usually we fail false if trying to > < pure text
                case "GREATER_THAN", "LESS_THAN", "GREATER_OR_EQUAL", "LESS_OR_EQUAL" -> false;
                default -> false;
            };
        }
    }
}
