package com.constructionplatform.app.entity;

import jakarta.persistence.*;

/**
 * Associates specific products with SCORE_ADJUST and PRODUCT_EXCLUSION rules.
 * Allows admin to select which products a rule targets.
 */
@Entity
@Table(name = "rule_product_targets")
public class RuleProductTarget {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rule_id", nullable = false)
    private Rule rule;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    public RuleProductTarget() {
    }

    public RuleProductTarget(Product product) {
        this.product = product;
    }

    // ── Getters & Setters ───────────────────────────────────────────────────

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Rule getRule() { return rule; }
    public void setRule(Rule rule) { this.rule = rule; }

    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }
}
