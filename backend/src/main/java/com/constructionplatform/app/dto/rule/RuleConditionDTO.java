package com.constructionplatform.app.dto.rule;

import com.constructionplatform.app.enums.ConditionOperator;
import com.constructionplatform.app.enums.OperandSource;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class RuleConditionDTO {

    @NotNull(message = "OperandSource is required")
    private OperandSource operandSource;

    @NotBlank(message = "AttributeName is required")
    private String attributeName;

    @NotNull(message = "Operator is required")
    private ConditionOperator operator;

    @NotBlank(message = "ExpectedValue is required")
    private String expectedValue;

    public RuleConditionDTO() {
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
