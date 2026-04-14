package com.constructionplatform.app.enums;

/**
 * The three rule types supported by the dynamic rule engine.
 */
public enum RuleType {
    /** Conditional scoring with nested if-else conditions and attribute mappings. */
    CONDITIONAL_MATCH,
    /** Directly boosts or deducts score for specific products. */
    SCORE_ADJUST,
    /** Completely removes specific products from recommendations. */
    PRODUCT_EXCLUSION
}
