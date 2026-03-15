package com.constructionplatform.app.engine;

import java.util.ArrayList;
import java.util.List;

public class RuleMatchResult {

    private Long ruleId;
    private String ruleName;
    private boolean matched;
    private boolean hardConstraint;
    private List<String> matchedConditions = new ArrayList<>();
    private List<String> failedConditions = new ArrayList<>();
    private Integer weight;
    private Integer priority;

    public RuleMatchResult() {
    }

    public Long getRuleId() {
        return ruleId;
    }

    public void setRuleId(Long ruleId) {
        this.ruleId = ruleId;
    }

    public String getRuleName() {
        return ruleName;
    }

    public void setRuleName(String ruleName) {
        this.ruleName = ruleName;
    }

    public boolean isMatched() {
        return matched;
    }

    public void setMatched(boolean matched) {
        this.matched = matched;
    }

    public boolean isHardConstraint() {
        return hardConstraint;
    }

    public void setHardConstraint(boolean hardConstraint) {
        this.hardConstraint = hardConstraint;
    }

    public List<String> getMatchedConditions() {
        return matchedConditions;
    }

    public void setMatchedConditions(List<String> matchedConditions) {
        this.matchedConditions = matchedConditions;
    }

    public List<String> getFailedConditions() {
        return failedConditions;
    }

    public void setFailedConditions(List<String> failedConditions) {
        this.failedConditions = failedConditions;
    }

    public Integer getWeight() {
        return weight;
    }

    public void setWeight(Integer weight) {
        this.weight = weight;
    }

    public Integer getPriority() {
        return priority;
    }

    public void setPriority(Integer priority) {
        this.priority = priority;
    }
}
