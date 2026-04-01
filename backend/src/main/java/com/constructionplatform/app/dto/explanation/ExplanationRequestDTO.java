package com.constructionplatform.app.dto.explanation;

import java.util.List;
import java.util.Map;

public class ExplanationRequestDTO {

    private Long productId;
    private Double score;
    private List<String> matchedRules;
    private List<String> constraintsSatisfied;
    private Map<String, Double> preferenceContributions;
    private String productName;

    public ExplanationRequestDTO() {
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public Double getScore() {
        return score;
    }

    public void setScore(Double score) {
        this.score = score;
    }

    public List<String> getMatchedRules() {
        return matchedRules;
    }

    public void setMatchedRules(List<String> matchedRules) {
        this.matchedRules = matchedRules;
    }

    public List<String> getConstraintsSatisfied() {
        return constraintsSatisfied;
    }

    public void setConstraintsSatisfied(List<String> constraintsSatisfied) {
        this.constraintsSatisfied = constraintsSatisfied;
    }

    public Map<String, Double> getPreferenceContributions() {
        return preferenceContributions;
    }

    public void setPreferenceContributions(Map<String, Double> preferenceContributions) {
        this.preferenceContributions = preferenceContributions;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }
}
