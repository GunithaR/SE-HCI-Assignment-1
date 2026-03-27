package com.constructionplatform.app.entity;

import com.constructionplatform.app.enums.ConditionOperator;
import com.constructionplatform.app.enums.OperandSource;
import jakarta.persistence.*;

@Entity
@Table(name = "rule_conditions")
public class RuleCondition {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rule_id", nullable = false)
    private Rule rule;

    @Enumerated(EnumType.STRING)
    @Column(name = "operand_source", nullable = false)
    private OperandSource operandSource;

    @Column(name = "attribute_name", nullable = false)
    private String attributeName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ConditionOperator operator;

    @Column(name = "expected_value", nullable = false)
    private String expectedValue;

    public RuleCondition() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Rule getRule() {
        return rule;
    }

    public void setRule(Rule rule) {
        this.rule = rule;
    }

    public OperandSource getOperandSource() {
        return operandSource;
    }

    public void setOperandSource(OperandSource operandSource) {
        this.operandSource = operandSource;
    }

    public String getAttributeName() {
        return attributeName;
    }

    public void setAttributeName(String attributeName) {
        this.attributeName = attributeName;
    }

    public ConditionOperator getOperator() {
        return operator;
    }

    public void setOperator(ConditionOperator operator) {
        this.operator = operator;
    }

    public String getExpectedValue() {
        return expectedValue;
    }

    public void setExpectedValue(String expectedValue) {
        this.expectedValue = expectedValue;
    }
}
