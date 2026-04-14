package com.constructionplatform.app.dto.rule;

import com.constructionplatform.app.enums.EffectType;
import com.constructionplatform.app.enums.RulePriority;
import com.constructionplatform.app.enums.RuleType;

import java.util.List;

/**
 * Input DTO for creating/updating rules via admin API.
 */
public class RuleCreateRequestDTO {

    private String name;
    private String description;
    private RuleType ruleType;
    private RulePriority rulePriority;
    private String targetCategoryName;
    private Double defaultScore;

    // For CONDITIONAL_MATCH — flat answer-attribute mappings
    private List<AnswerAttributeMappingDTO> mappings;

    // For SCORE_ADJUST
    private EffectType effectType;
    private Double effectValue;
    private List<Long> targetProductIds;

    // Getters & Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public RuleType getRuleType() { return ruleType; }
    public void setRuleType(RuleType ruleType) { this.ruleType = ruleType; }

    public RulePriority getRulePriority() { return rulePriority; }
    public void setRulePriority(RulePriority rulePriority) { this.rulePriority = rulePriority; }

    public String getTargetCategoryName() { return targetCategoryName; }
    public void setTargetCategoryName(String targetCategoryName) { this.targetCategoryName = targetCategoryName; }

    public Double getDefaultScore() { return defaultScore; }
    public void setDefaultScore(Double defaultScore) { this.defaultScore = defaultScore; }

    public List<AnswerAttributeMappingDTO> getMappings() { return mappings; }
    public void setMappings(List<AnswerAttributeMappingDTO> mappings) { this.mappings = mappings; }

    public EffectType getEffectType() { return effectType; }
    public void setEffectType(EffectType effectType) { this.effectType = effectType; }

    public Double getEffectValue() { return effectValue; }
    public void setEffectValue(Double effectValue) { this.effectValue = effectValue; }

    public List<Long> getTargetProductIds() { return targetProductIds; }
    public void setTargetProductIds(List<Long> targetProductIds) { this.targetProductIds = targetProductIds; }
}
