package com.constructionplatform.app.engine;

import java.util.ArrayList;
import java.util.List;

public class EvaluationResult {

    private InputProfile inputProfile;
    private List<ProductEvaluationResult> productResults = new ArrayList<>();
    private List<RuleMatchResult> triggeredRulesSummary = new ArrayList<>();

    public EvaluationResult() {
    }

    public InputProfile getInputProfile() {
        return inputProfile;
    }

    public void setInputProfile(InputProfile inputProfile) {
        this.inputProfile = inputProfile;
    }

    public List<ProductEvaluationResult> getProductResults() {
        return productResults;
    }

    public void setProductResults(List<ProductEvaluationResult> productResults) {
        this.productResults = productResults;
    }

    public List<RuleMatchResult> getTriggeredRulesSummary() {
        return triggeredRulesSummary;
    }

    public void setTriggeredRulesSummary(List<RuleMatchResult> triggeredRulesSummary) {
        this.triggeredRulesSummary = triggeredRulesSummary;
    }
}
