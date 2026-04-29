package com.constructionplatform.app.engine;

import com.constructionplatform.app.entity.Product;
import com.constructionplatform.app.entity.ProductAttribute;
import com.constructionplatform.app.entity.RuleCondition;
import com.constructionplatform.app.enums.ConditionOperator;
import com.constructionplatform.app.enums.OperandSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.Map;

/**
 * Evaluates individual {@link RuleCondition}s against user answers and product attributes.
 * Supports comparison operators: EQUALS, NOT_EQUALS, GREATER_THAN, LESS_THAN,
 * GREATER_OR_EQUAL, LESS_OR_EQUAL, IN, CONTAINS.
 */
@Component
public class ConditionMatcher {

    private static final Logger log = LoggerFactory.getLogger(ConditionMatcher.class.getName());

    /**
     * Evaluate a single condition against user answers and product data.
     *
     * @param condition         the rule condition to evaluate
     * @param normalizedAnswers the normalised user answers
     * @param product           the product being evaluated
     * @return true if the condition is satisfied
     */
    public boolean evaluate(RuleCondition condition, Map<String, String> normalizedAnswers, Product product) {
        String actual = resolveValue(condition.getOperandSource(), condition.getAttributeName(),
                normalizedAnswers, product);
        if (actual == null) {
            return false;
        }
        return compare(actual, condition.getOperator(), condition.getExpectedValue());
    }

    /**
     * Dynamic match: compare normalised user answer to the corresponding product attribute.
     * Used when the rule's combinationType is NONE and dynamicAttribute is set.
     */
    public boolean evaluateDynamic(String dynamicAttribute, Map<String, String> normalizedAnswers, Product product) {
        String userValue = normalizedAnswers.get(dynamicAttribute);
        if (userValue == null) return false;

        String productAttrName = mapInputToProductAttr(dynamicAttribute);
        String productValue = resolveFromProduct(productAttrName, product);

        if ("ALL".equalsIgnoreCase(productValue)) return true;
        if (productValue == null) return false;

        return userValue.equalsIgnoreCase(productValue);
    }

    // Value resolution

    String resolveValue(OperandSource source, String attributeName,
                        Map<String, String> normalizedAnswers, Product product) {
        return switch (source) {
            case USER_INPUT -> normalizedAnswers.get(attributeName);
            case PRODUCT -> resolveFromProduct(attributeName, product);
        };
    }

    String resolveFromProduct(String attributeName, Product product) {
        ProductAttribute attr = product.getAttribute();
        if (attr == null) return null;

        return switch (attributeName.toLowerCase()) {
            case "budgetlevel", "budget_level" ->
                    attr.getBudgetLevel() != null ? attr.getBudgetLevel().name() : null;
            case "maintenancelevel", "maintenance_level" ->
                    attr.getMaintenanceLevel() != null ? attr.getMaintenanceLevel().name() : null;
            case "style" -> attr.getStyle();
            case "durabilityrating", "durability_rating" ->
                    attr.getDurabilityRating() != null ? String.valueOf(attr.getDurabilityRating()) : null;
            case "climatesuitability", "climate_suitability" ->
                    attr.getClimateSuitability() != null ? attr.getClimateSuitability().name() : null;
            case "waterresistance", "water_resistance" ->
                    attr.getWaterResistance() != null ? attr.getWaterResistance().name() : null;
            case "corrosionresistance", "corrosion_resistance" ->
                    attr.getCorrosionResistance() != null ? attr.getCorrosionResistance().name() : null;
            case "heatresistance", "heat_resistance" ->
                    attr.getHeatResistance() != null ? attr.getHeatResistance().name() : null;
            case "slipresistance", "slip_resistance" ->
                    attr.getSlipResistance() != null ? attr.getSlipResistance().name() : null;
            case "noisereduction", "noise_reduction" ->
                    attr.getNoiseReduction() != null ? attr.getNoiseReduction().name() : null;
            case "material" -> attr.getMaterial() != null ? attr.getMaterial().name() : null;
            case "size" -> attr.getSize() != null ? attr.getSize().name() : null;
            case "usagearea", "usage_area" -> attr.getUsageArea();
            case "category" ->
                    product.getCategory() != null ? product.getCategory().getName() : null;
            case "name" -> product.getName();
            default -> {
                log.debug("Unknown product attribute: {}", attributeName);
                yield null;
            }
        };
    }

    private String mapInputToProductAttr(String inputAttr) {
        return switch (inputAttr.toLowerCase()) {
            case "budget" -> "budgetLevel";
            case "maintenance", "maintenancepreference" -> "maintenanceLevel";
            case "style" -> "style";
            case "climate", "location", "environment" -> "climateSuitability";
            default -> inputAttr;
        };
    }

    // Comparison engine

    boolean compare(String actual, ConditionOperator operator, String expected) {
        if (actual == null || expected == null) return false;

        return switch (operator) {
            case EQUALS -> actual.equalsIgnoreCase(expected);
            case NOT_EQUALS -> !actual.equalsIgnoreCase(expected);
            case CONTAINS -> actual.toLowerCase().indexOf(expected.toLowerCase()) != -1;
            case IN -> {
                String[] parts = expected.split(",");
                for (String part : parts) {
                    if (actual.equalsIgnoreCase(part.trim())) yield true;
                }
                yield false;
            }
            case GREATER_THAN, LESS_THAN, GREATER_OR_EQUAL, LESS_OR_EQUAL ->
                    compareNumeric(actual, operator, expected);
        };
    }

    private boolean compareNumeric(String actual, ConditionOperator op, String expected) {
        try {
            double a = Double.parseDouble(actual);
            double b = Double.parseDouble(expected);
            return switch (op) {
                case GREATER_THAN -> a > b;
                case LESS_THAN -> a < b;
                case GREATER_OR_EQUAL -> a >= b;
                case LESS_OR_EQUAL -> a <= b;
                default -> false;
            };
        } catch (NumberFormatException e) {
            log.debug("Non-numeric comparison attempted: actual='{}' expected='{}'", actual, expected);
            return false;
        }
    }
}
