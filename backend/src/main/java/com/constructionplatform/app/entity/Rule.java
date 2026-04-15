package com.constructionplatform.app.entity;

import com.constructionplatform.app.enums.EffectType;
import com.constructionplatform.app.enums.RulePriority;
import com.constructionplatform.app.enums.RuleStatus;
import com.constructionplatform.app.enums.RuleType;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

/**
 * Represents a scoring rule in the dynamic recommendation engine.
 *
 * <p>Three rule types:
 * <ul>
 *   <li>CONDITIONAL_MATCH — Contains answer-to-attribute mappings with scoring modes
 *       (LEVELED, CATEGORICAL, FIXED). Each mapping links a user answer to a product
 *       attribute evaluation.</li>
 *   <li>SCORE_ADJUST — Boosts or deducts score for specific products.</li>
 *   <li>PRODUCT_EXCLUSION — Removes specific products from recommendations.</li>
 * </ul>
 */
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
    @Column(name = "rule_priority", nullable = true, length = 10)
    private RulePriority rulePriority;

    /** Effect type for SCORE_ADJUST rules (ADD_SCORE or DEDUCT_SCORE). */
    @Enumerated(EnumType.STRING)
    @Column(name = "effect_type", length = 20)
    private EffectType effectType;

    /** Effect value for SCORE_ADJUST rules (the amount to add/deduct). */
    @Column(name = "effect_value")
    private Double effectValue;

    /** Optional target category — limits rule to products in this category. */
    @Column(name = "target_category_name")
    private String targetCategoryName;

    /**
     * Default score (0-10) returned when no mapping matches the user's answers.
     * Used by CONDITIONAL_MATCH rules as the fallback. Defaults to 5.0 (neutral).
     */
    @Column(name = "default_score")
    private Double defaultScore = 5.0;

    // ── Relationships ───────────────────────────────────────────────────────

    /** Answer-to-attribute mappings for CONDITIONAL_MATCH rules. */
    @OneToMany(mappedBy = "rule", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<AnswerAttributeMapping> mappings = new ArrayList<>();

    /** Targeted products for SCORE_ADJUST and PRODUCT_EXCLUSION rules. */
    @OneToMany(mappedBy = "rule", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<RuleProductTarget> productTargets = new ArrayList<>();

    public Rule() {
    }

    // ── Convenience methods ─────────────────────────────────────────────────

    public void addMapping(AnswerAttributeMapping mapping) {
        mappings.add(mapping);
        mapping.setRule(this);
    }

    public void addProductTarget(RuleProductTarget target) {
        productTargets.add(target);
        target.setRule(this);
    }

    public int getWeight() {
        return rulePriority != null ? rulePriority.getDefaultWeight() : RulePriority.HIGH.getDefaultWeight();
    }

    // ── Getters & Setters ───────────────────────────────────────────────────

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

    public EffectType getEffectType() { return effectType; }
    public void setEffectType(EffectType effectType) { this.effectType = effectType; }

    public Double getEffectValue() { return effectValue; }
    public void setEffectValue(Double effectValue) { this.effectValue = effectValue; }

    public String getTargetCategoryName() { return targetCategoryName; }
    public void setTargetCategoryName(String targetCategoryName) { this.targetCategoryName = targetCategoryName; }

    public Double getDefaultScore() { return defaultScore; }
    public void setDefaultScore(Double defaultScore) { this.defaultScore = defaultScore; }

    public List<AnswerAttributeMapping> getMappings() { return mappings; }
    public void setMappings(List<AnswerAttributeMapping> mappings) { this.mappings = mappings; }

    public List<RuleProductTarget> getProductTargets() { return productTargets; }
    public void setProductTargets(List<RuleProductTarget> productTargets) { this.productTargets = productTargets; }
}
