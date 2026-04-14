package com.constructionplatform.app.dto.rule;

import com.constructionplatform.app.enums.EffectType;
import com.constructionplatform.app.enums.RulePriority;
import com.constructionplatform.app.enums.RuleStatus;
import com.constructionplatform.app.enums.RuleType;

import java.util.List;

/**
 * Response DTO for rule details returned by the admin API.
 */
public class RuleResponseDTO {

    private Long id;
    private String name;
    private String description;
    private RuleType ruleType;
    private RuleStatus ruleStatus;
    private RulePriority rulePriority;
    private int weight;
    private String targetCategoryName;
    private Double defaultScore;

    // For CONDITIONAL_MATCH — flat answer-attribute mappings
    private List<AnswerAttributeMappingDTO> mappings;

    // For SCORE_ADJUST
    private EffectType effectType;
    private Double effectValue;

    // For SCORE_ADJUST & PRODUCT_EXCLUSION
    private List<ProductTargetDTO> productTargets;

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public RuleType getRuleType() { return ruleType; }
    public void setRuleType(RuleType ruleType) { this.ruleType = ruleType; }

    public RuleStatus getRuleStatus() { return ruleStatus; }
    public void setRuleStatus(RuleStatus ruleStatus) { this.ruleStatus = ruleStatus; }

    public RulePriority getRulePriority() { return rulePriority; }
    public void setRulePriority(RulePriority rulePriority) { this.rulePriority = rulePriority; }

    public int getWeight() { return weight; }
    public void setWeight(int weight) { this.weight = weight; }

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

    public List<ProductTargetDTO> getProductTargets() { return productTargets; }
    public void setProductTargets(List<ProductTargetDTO> productTargets) { this.productTargets = productTargets; }
}
