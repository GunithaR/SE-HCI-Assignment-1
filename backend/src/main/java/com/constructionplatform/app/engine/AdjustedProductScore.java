package com.constructionplatform.app.engine;

import com.constructionplatform.app.entity.Product;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Holds the final scored result for a product after the dynamic rule engine processes it.
 * Includes per-rule score breakdown, adjustments, trade-offs, and exclusion info.
 */
public class AdjustedProductScore {

    private Product product;
    private double baseScore;        // From ATTRIBUTE_MATCH rules (weighted average)
    private double ruleAdjustment;   // From SCORE_ADJUST rules
    private double finalScore;       // baseScore + ruleAdjustment, clamped 0-10
    private boolean excluded;        // From PRODUCT_EXCLUSION rules
    private Map<String, Double> strategyScores;  // Per-rule score breakdown
    private List<String> tradeOffs;
    private List<String> appliedRuleNames;
    private List<String> excludedByRules;

    public AdjustedProductScore() {
        this.strategyScores = new LinkedHashMap<>();
        this.tradeOffs = new ArrayList<>();
        this.appliedRuleNames = new ArrayList<>();
        this.excludedByRules = new ArrayList<>();
    }

    /**
     * Factory: create a scored product with its base score from ATTRIBUTE_MATCH rules.
     */
    public static AdjustedProductScore scored(Product product, double baseScore,
                                               Map<String, Double> ruleScores,
                                               List<String> tradeOffs) {
        AdjustedProductScore a = new AdjustedProductScore();
        a.product = product;
        a.baseScore = baseScore;
        a.ruleAdjustment = 0.0;
        a.finalScore = baseScore;
        a.excluded = false;
        a.strategyScores = new LinkedHashMap<>(ruleScores);
        a.tradeOffs = new ArrayList<>(tradeOffs);
        return a;
    }

    /**
     * Factory: create an excluded product.
     */
    public static AdjustedProductScore excluded(Product product, String ruleName) {
        AdjustedProductScore a = new AdjustedProductScore();
        a.product = product;
        a.baseScore = 0.0;
        a.ruleAdjustment = 0.0;
        a.finalScore = 0.0;
        a.excluded = true;
        a.excludedByRules.add(ruleName);
        return a;
    }

    // ── Score mutation by SCORE_ADJUST rules ─────────────────────────────────

    public void addScore(double amount, String ruleName) {
        this.ruleAdjustment += amount;
        this.finalScore = Math.min(10.0, Math.max(0.0, this.baseScore + this.ruleAdjustment));
        this.appliedRuleNames.add(ruleName + " [+" + amount + "]");
    }

    public void deductScore(double amount, String ruleName) {
        this.ruleAdjustment -= amount;
        this.finalScore = Math.min(10.0, Math.max(0.0, this.baseScore + this.ruleAdjustment));
        this.appliedRuleNames.add(ruleName + " [-" + amount + "]");
    }

    public void markExcluded(String ruleName) {
        this.excluded = true;
        this.excludedByRules.add(ruleName);
    }

    // ── Getters ──────────────────────────────────────────────────────────────

    public Product getProduct() { return product; }
    public double getStrategyScore() { return baseScore; }
    public double getRuleAdjustment() { return ruleAdjustment; }
    public double getFinalScore() { return finalScore; }
    public boolean isExcluded() { return excluded; }
    public Map<String, Double> getStrategyScores() { return strategyScores; }
    public List<String> getTradeOffs() { return tradeOffs; }
    public List<String> getAppliedRuleNames() { return appliedRuleNames; }
    public List<String> getExcludedByRules() { return excludedByRules; }
}
