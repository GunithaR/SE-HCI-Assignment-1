package com.constructionplatform.app.service;

import com.constructionplatform.app.dto.rule.RuleConditionDTO;
import com.constructionplatform.app.dto.rule.RuleCreateRequestDTO;
import com.constructionplatform.app.enums.CombinationType;
import com.constructionplatform.app.enums.EffectType;
import com.constructionplatform.app.enums.OperandSource;
import com.constructionplatform.app.enums.RuleType;
import com.constructionplatform.app.enums.TargetScope;
import com.constructionplatform.app.exception.InvalidRuleException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
public class RuleValidationService {

    private static final Set<String> SUPPORTED_INPUT_ATTRIBUTES = Set.of(
            "budget", "climate", "style", "durabilityPreference", "maintenancePreference",
            "location", "concern", "maintenance", "flooring_usage", "traffic", "priority",
            "slip_resistance", "wall_usage", "environment", "goal", "room_type",
            "accessory_type", "usage_duration", "usage_environment"
    );

    private static final Set<String> SUPPORTED_PRODUCT_ATTRIBUTES = Set.of(
            "budgetLevel", "climateSuitability", "style", "durabilityRating",
            "maintenanceLevel", "categoryName", "material",
            "waterResistance", "corrosionResistance", "heatResistance",
            "slipResistance", "noiseReduction", "usageArea"
    );

    public void validate(RuleCreateRequestDTO dto) {
        if (dto == null) {
            throw new InvalidRuleException("Rule request cannot be null");
        }

        if (dto.getName() == null || dto.getName().trim().isEmpty()) {
            throw new InvalidRuleException("Rule name is mandatory");
        }
        if (dto.getRuleType() == null) {
            throw new InvalidRuleException("Rule type is mandatory");
        }
        if (dto.getRuleStatus() == null) {
            throw new InvalidRuleException("Rule status is mandatory");
        }
        if (dto.getTargetScope() == null) {
            throw new InvalidRuleException("Target scope is mandatory");
        }
        if (dto.getCombinationType() == null) {
            throw new InvalidRuleException("Combination type is mandatory");
        }
        if (dto.getPriority() == null) {
            throw new InvalidRuleException("Priority is mandatory");
        }

        // ── Weight validation ────────────────────────────────────────────────
        if (dto.getRuleType() == RuleType.SOFT_PREFERENCE) {
            if (dto.getWeight() == null || dto.getWeight() <= 0) {
                throw new InvalidRuleException("Soft preference rules must have a valid positive weight");
            }
        }

        // ── Effect validation ────────────────────────────────────────────────
        validateEffect(dto);

        // ── Scope validation ─────────────────────────────────────────────────
        if (dto.getTargetScope() == TargetScope.CATEGORY) {
            if (dto.getTargetCategoryName() == null || dto.getTargetCategoryName().trim().isEmpty()) {
                throw new InvalidRuleException("Target category name must be provided when target scope is CATEGORY");
            }
        } else if (dto.getTargetScope() == TargetScope.GLOBAL) {
            if (dto.getTargetCategoryName() != null && !dto.getTargetCategoryName().trim().isEmpty()) {
                throw new InvalidRuleException("Target category name should not be set for GLOBAL target scope");
            }
        }

        // ── Conditions / Dynamic attribute validation ────────────────────────
        if (dto.getCombinationType() == CombinationType.NONE) {
            if (dto.getDynamicAttribute() == null || dto.getDynamicAttribute().trim().isEmpty()) {
                throw new InvalidRuleException("Dynamic attribute must be provided when combination type is NONE");
            }
            if (!SUPPORTED_INPUT_ATTRIBUTES.contains(dto.getDynamicAttribute())) {
                throw new InvalidRuleException("Unsupported dynamic attribute: " + dto.getDynamicAttribute());
            }
        } else {
            List<RuleConditionDTO> conditions = dto.getConditions();
            if (conditions == null || conditions.isEmpty()) {
                throw new InvalidRuleException("Rule must have at least one condition when combination type is not NONE");
            }
            for (RuleConditionDTO condition : conditions) {
                validateCondition(condition);
            }
        }
    }

    private void validateEffect(RuleCreateRequestDTO dto) {
        EffectType effectType = dto.getEffectType();

        if (dto.getRuleType() == RuleType.HARD_CONSTRAINT) {
            // Hard constraints MUST use FILTER_OUT
            if (effectType != null && effectType != EffectType.FILTER_OUT) {
                throw new InvalidRuleException("HARD_CONSTRAINT rules must use FILTER_OUT effect type");
            }
            // Auto-set to FILTER_OUT if not provided
            if (effectType == null) {
                dto.setEffectType(EffectType.FILTER_OUT);
            }
            // Effect value is not applicable for FILTER_OUT
            dto.setEffectValue(null);
        } else if (dto.getRuleType() == RuleType.SOFT_PREFERENCE) {
            // Soft prefs must use ADD_SCORE or DEDUCT_SCORE
            if (effectType == null) {
                dto.setEffectType(EffectType.ADD_SCORE); // default
            } else if (effectType == EffectType.FILTER_OUT) {
                throw new InvalidRuleException("SOFT_PREFERENCE rules cannot use FILTER_OUT effect type");
            }
            // Effect value must be positive
            if (effectType != null && effectType != EffectType.FILTER_OUT) {
                if (dto.getEffectValue() == null || dto.getEffectValue() <= 0) {
                    throw new InvalidRuleException("Effect value must be a positive number for ADD_SCORE / DEDUCT_SCORE");
                }
            }
        }
    }

    private void validateCondition(RuleConditionDTO condition) {
        if (condition.getOperandSource() == null) {
            throw new InvalidRuleException("Condition operand source is mandatory");
        }
        if (condition.getAttributeName() == null || condition.getAttributeName().trim().isEmpty()) {
            throw new InvalidRuleException("Condition attribute name is mandatory");
        }
        if (condition.getOperator() == null) {
            throw new InvalidRuleException("Condition operator is mandatory");
        }
        if (condition.getExpectedValue() == null || condition.getExpectedValue().trim().isEmpty()) {
            throw new InvalidRuleException("Condition expected value is mandatory");
        }

        String attr = condition.getAttributeName().trim();
        if (condition.getOperandSource() == OperandSource.USER_INPUT) {
            if (!SUPPORTED_INPUT_ATTRIBUTES.contains(attr)) {
                throw new InvalidRuleException("Unsupported user input attribute: " + attr);
            }
        } else if (condition.getOperandSource() == OperandSource.PRODUCT) {
            if (!SUPPORTED_PRODUCT_ATTRIBUTES.contains(attr)) {
                throw new InvalidRuleException("Unsupported product attribute: " + attr);
            }
        }
    }
}
