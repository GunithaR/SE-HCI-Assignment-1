package com.constructionplatform.app.enums;

/**
 * Rule priority determines the weight of a rule in the scoring formula.
 * Weights match the original strategy weights:
 *   HIGH(25)   → Budget, Environment, Performance  (0.25 each)
 *   MEDIUM(15) → Style                             (0.15)
 *   LOW(10)    → Maintenance, Usage                (0.10 each)
 */
public enum RulePriority {
    HIGH(25),
    MEDIUM(15),
    LOW(10);

    private final int defaultWeight;

    RulePriority(int defaultWeight) {
        this.defaultWeight = defaultWeight;
    }

    public int getDefaultWeight() {
        return defaultWeight;
    }
}
