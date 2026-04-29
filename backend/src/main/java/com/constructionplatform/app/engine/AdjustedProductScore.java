package com.constructionplatform.app.engine;

import com.constructionplatform.app.entity.Product;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Extends a strategy-based {@link RecommendationEngine.ProductScore} with
 * rule-engine adjustments (bonus/penalty/exclusion).
 */
public class AdjustedProductScore {

    private Product product;
    private double strategyScore;
    private double ruleAdjustment;
    private double finalScore;
    private boolean excluded;
    private Map<String, Double> strategyScores;
    private List<String> tradeOffs;
    private List<String> appliedRuleNames;
    private List<String> excludedByRules;

    public AdjustedProductScore() {
        this.appliedRuleNames = new ArrayList<>();
        this.excludedByRules = new ArrayList<>();
        this.tradeOffs = new ArrayList<>();
    }

    /**
     * Factory: wrap a strategy ProductScore into an AdjustedProductScore.
     */
    public static AdjustedProductScore from(RecommendationEngine.ProductScore ps) {
        AdjustedProductScore a = new AdjustedProductScore();
        a.product = ps.getProduct();
        a.strategyScore = ps.getTotalScore();
        a.ruleAdjustment = 0.0;
        a.finalScore = ps.getTotalScore();
        a.excluded = false;
        a.strategyScores = ps.getStrategyScores();
        a.tradeOffs = new ArrayList<>(ps.getTradeOffs());
        return a;
    }

    // Score mutation by rules

    public void addScore(double amount, String ruleName) {
        this.ruleAdjustment += amount;
        this.finalScore = this.strategyScore + this.ruleAdjustment;
        this.appliedRuleNames.add(ruleName + " [+" + amount + "]");
    }

    public void deductScore(double amount, String ruleName) {
        this.ruleAdjustment -= amount;
        this.finalScore = this.strategyScore + this.ruleAdjustment;
        this.appliedRuleNames.add(ruleName + " [-" + amount + "]");
    }

    public void markExcluded(String ruleName) {
        this.excluded = true;
        this.excludedByRules.add(ruleName);
    }

    // Getters

    public Product getProduct() {
        return product;
    }

    public double getStrategyScore() {
        return strategyScore;
    }

    public double getRuleAdjustment() {
        return ruleAdjustment;
    }

    public double getFinalScore() {
        return finalScore;
    }

    public boolean isExcluded() {
        return excluded;
    }

    public Map<String, Double> getStrategyScores() {
        return strategyScores;
    }

    public List<String> getTradeOffs() {
        return tradeOffs;
    }

    public List<String> getAppliedRuleNames() {
        return appliedRuleNames;
    }

    public List<String> getExcludedByRules() {
        return excludedByRules;
    }
}
