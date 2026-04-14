package com.constructionplatform.app.enums;

/**
 * Determines how the rule engine scores a product attribute against a user answer.
 *
 * <ul>
 *   <li>LEVELED — The attribute has ordered tiers (LOW/MEDIUM/HIGH). Score is based on
 *       deviation from the ideal level: exact match → highest score, 1 level away → lower, etc.</li>
 *   <li>CATEGORICAL — The attribute has unordered values (e.g., style, material).
 *       Exact match → matchScore, no match → noMatchScore.</li>
 *   <li>FIXED — Returns a static score regardless of the product attribute value.
 *       Used for answers like "urban/normal" where most products are fine (score=7.0).</li>
 * </ul>
 */
public enum ScoringMode {
    LEVELED,
    CATEGORICAL,
    FIXED
}
