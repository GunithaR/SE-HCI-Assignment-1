package com.constructionplatform.app.engine;

import com.constructionplatform.app.entity.Product;

import java.util.ArrayList;
import java.util.List;

public class ProductEvaluationResult {

    private Product product;
    private boolean excluded;
    private List<RuleMatchResult> matchedRules = new ArrayList<>();
    private List<RuleMatchResult> failedHardConstraints = new ArrayList<>();
    private Integer provisionalScore = 0;

    public ProductEvaluationResult() {
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public boolean isExcluded() {
        return excluded;
    }

    public void setExcluded(boolean excluded) {
        this.excluded = excluded;
    }

    public List<RuleMatchResult> getMatchedRules() {
        return matchedRules;
    }

    public void setMatchedRules(List<RuleMatchResult> matchedRules) {
        this.matchedRules = matchedRules;
    }

    public List<RuleMatchResult> getFailedHardConstraints() {
        return failedHardConstraints;
    }

    public void setFailedHardConstraints(List<RuleMatchResult> failedHardConstraints) {
        this.failedHardConstraints = failedHardConstraints;
    }

    public Integer getProvisionalScore() {
        return provisionalScore;
    }

    public void setProvisionalScore(Integer provisionalScore) {
        this.provisionalScore = provisionalScore;
    }
}
