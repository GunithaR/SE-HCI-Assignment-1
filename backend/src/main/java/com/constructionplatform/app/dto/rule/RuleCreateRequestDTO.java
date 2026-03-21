package com.constructionplatform.app.dto.rule;

import com.constructionplatform.app.enums.CombinationType;
import com.constructionplatform.app.enums.EffectType;
import com.constructionplatform.app.enums.RuleStatus;
import com.constructionplatform.app.enums.RuleType;
import com.constructionplatform.app.enums.TargetScope;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public class RuleCreateRequestDTO {

    @NotBlank(message = "Name is required")
    private String name;

    private String description;

    @NotNull(message = "RuleType is required")
    private RuleType ruleType;

    @NotNull(message = "RuleStatus is required")
    private RuleStatus ruleStatus;

    @NotNull(message = "TargetScope is required")
    private TargetScope targetScope;

    @NotNull(message = "CombinationType is required")
    private CombinationType combinationType;

    @NotNull(message = "Priority is required")
    private Integer priority;

    private Integer weight;

    private String targetCategoryName;

    private String dynamicAttribute;

    private EffectType effectType;

    private Integer effectValue;

    @Valid
    private List<RuleConditionDTO> conditions;

    public RuleCreateRequestDTO() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public RuleType getRuleType() {
        return ruleType;
    }

    public void setRuleType(RuleType ruleType) {
        this.ruleType = ruleType;
    }

    public RuleStatus getRuleStatus() {
        return ruleStatus;
    }

    public void setRuleStatus(RuleStatus ruleStatus) {
        this.ruleStatus = ruleStatus;
    }

    public TargetScope getTargetScope() {
        return targetScope;
    }

    public void setTargetScope(TargetScope targetScope) {
        this.targetScope = targetScope;
    }

    public CombinationType getCombinationType() {
        return combinationType;
    }

    public void setCombinationType(CombinationType combinationType) {
        this.combinationType = combinationType;
    }

    public Integer getPriority() {
        return priority;
    }

    public void setPriority(Integer priority) {
        this.priority = priority;
    }

    public Integer getWeight() {
        return weight;
    }

    public void setWeight(Integer weight) {
        this.weight = weight;
    }

    public String getTargetCategoryName() {
        return targetCategoryName;
    }

    public void setTargetCategoryName(String targetCategoryName) {
        this.targetCategoryName = targetCategoryName;
    }

    public String getDynamicAttribute() {
        return dynamicAttribute;
    }

    public void setDynamicAttribute(String dynamicAttribute) {
        this.dynamicAttribute = dynamicAttribute;
    }

    public List<RuleConditionDTO> getConditions() {
        return conditions;
    }

    public void setConditions(List<RuleConditionDTO> conditions) {
        this.conditions = conditions;
    }

    public EffectType getEffectType() {
        return effectType;
    }

    public void setEffectType(EffectType effectType) {
        this.effectType = effectType;
    }

    public Integer getEffectValue() {
        return effectValue;
    }

    public void setEffectValue(Integer effectValue) {
        this.effectValue = effectValue;
    }
}
