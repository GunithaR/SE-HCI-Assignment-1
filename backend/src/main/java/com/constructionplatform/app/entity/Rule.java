package com.constructionplatform.app.entity;

import com.constructionplatform.app.enums.CombinationType;
import com.constructionplatform.app.enums.EffectType;
import com.constructionplatform.app.enums.RuleStatus;
import com.constructionplatform.app.enums.RuleType;
import com.constructionplatform.app.enums.TargetScope;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "rules")
public class Rule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "rule_type", nullable = false, length = 20)
    private RuleType ruleType;

    @Enumerated(EnumType.STRING)
    @Column(name = "rule_status", nullable = false, length = 20)
    private RuleStatus ruleStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "target_scope", nullable = false, length = 20)
    private TargetScope targetScope;

    @Enumerated(EnumType.STRING)
    @Column(name = "combination_type", nullable = false, length = 20)
    private CombinationType combinationType;

    @Column(nullable = false)
    private Integer priority;

    @Column
    private Integer weight;

    @Column(name = "target_category_name")
    private String targetCategoryName;

    @Column(name = "dynamic_attribute")
    private String dynamicAttribute;

    @Enumerated(EnumType.STRING)
    @Column(name = "effect_type", length = 20)
    private EffectType effectType;

    @Column(name = "effect_value")
    private Integer effectValue;

    @OneToMany(mappedBy = "rule", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<RuleCondition> conditions = new ArrayList<>();

    public Rule() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public List<RuleCondition> getConditions() {
        return conditions;
    }

    public void setConditions(List<RuleCondition> conditions) {
        this.conditions = conditions;
    }

    public void addCondition(RuleCondition condition) {
        conditions.add(condition);
        condition.setRule(this);
    }

    public void removeCondition(RuleCondition condition) {
        conditions.remove(condition);
        condition.setRule(null);
    }
}
