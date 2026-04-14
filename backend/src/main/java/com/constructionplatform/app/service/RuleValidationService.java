package com.constructionplatform.app.service;

import com.constructionplatform.app.dto.rule.AnswerAttributeMappingDTO;
import com.constructionplatform.app.dto.rule.RuleCreateRequestDTO;
import com.constructionplatform.app.enums.EffectType;
import com.constructionplatform.app.enums.ScoringMode;
import com.constructionplatform.app.exception.InvalidRuleException;
import com.constructionplatform.app.repository.RuleRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
public class RuleValidationService {

    private static final Set<String> SUPPORTED_PRODUCT_ATTRIBUTES = Set.of(
            "budgetLevel", "climateSuitability", "style", "durabilityRating",
            "maintenanceLevel", "material", "size",
            "waterResistance", "corrosionResistance", "heatResistance",
            "slipResistance", "noiseReduction", "usageArea"
    );

    private final RuleRepository ruleRepository;

    public RuleValidationService(RuleRepository ruleRepository) {
        this.ruleRepository = ruleRepository;
    }

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
        if (dto.getRulePriority() == null) {
            throw new InvalidRuleException("Rule priority is mandatory");
        }

        switch (dto.getRuleType()) {
            case CONDITIONAL_MATCH -> validateConditionalMatch(dto);
            case SCORE_ADJUST -> validateScoreAdjust(dto);
            case PRODUCT_EXCLUSION -> validateProductExclusion(dto);
        }
    }

    public void validateForUpdate(RuleCreateRequestDTO dto, Long existingRuleId) {
        validate(dto);
    }

    private void validateConditionalMatch(RuleCreateRequestDTO dto) {
        List<AnswerAttributeMappingDTO> mappings = dto.getMappings();
        if (mappings == null || mappings.isEmpty()) {
            throw new InvalidRuleException("CONDITIONAL_MATCH rules must have at least one mapping");
        }

        for (AnswerAttributeMappingDTO m : mappings) {
            if (m.getAnswerKey() == null || m.getAnswerKey().trim().isEmpty()) {
                throw new InvalidRuleException("Mapping answerKey is mandatory");
            }
            if (m.getAnswerValue() == null || m.getAnswerValue().trim().isEmpty()) {
                throw new InvalidRuleException("Mapping answerValue is mandatory");
            }
            if (m.getScoringMode() == null) {
                throw new InvalidRuleException("Mapping scoringMode is mandatory");
            }

            if (m.getScoringMode() == ScoringMode.LEVELED || m.getScoringMode() == ScoringMode.CATEGORICAL) {
                if (m.getProductAttribute() == null || m.getProductAttribute().trim().isEmpty()) {
                    throw new InvalidRuleException("productAttribute is required for LEVELED and CATEGORICAL modes");
                }
                if (!SUPPORTED_PRODUCT_ATTRIBUTES.contains(m.getProductAttribute())) {
                    throw new InvalidRuleException("Unsupported product attribute: " + m.getProductAttribute());
                }
                if (m.getIdealLevel() == null || m.getIdealLevel().trim().isEmpty()) {
                    throw new InvalidRuleException("idealLevel is required for LEVELED and CATEGORICAL modes");
                }
            }

            if (m.getScoringMode() == ScoringMode.FIXED) {
                if (m.getFixedScore() == null) {
                    throw new InvalidRuleException("fixedScore is required for FIXED mode");
                }
                if (m.getFixedScore() < 0 || m.getFixedScore() > 10) {
                    throw new InvalidRuleException("fixedScore must be between 0 and 10");
                }
            }
        }
    }

    private void validateScoreAdjust(RuleCreateRequestDTO dto) {
        if (dto.getEffectType() == null) {
            throw new InvalidRuleException("SCORE_ADJUST rules must specify an effect type (ADD_SCORE or DEDUCT_SCORE)");
        }
        if (dto.getEffectType() == EffectType.FILTER_OUT) {
            throw new InvalidRuleException("SCORE_ADJUST rules cannot use FILTER_OUT. Use PRODUCT_EXCLUSION instead.");
        }
        if (dto.getEffectValue() == null || dto.getEffectValue() <= 0) {
            throw new InvalidRuleException("Effect value must be a positive number");
        }
        if (dto.getTargetProductIds() == null || dto.getTargetProductIds().isEmpty()) {
            throw new InvalidRuleException("SCORE_ADJUST rules must target at least one product");
        }
    }

    private void validateProductExclusion(RuleCreateRequestDTO dto) {
        if (dto.getTargetProductIds() == null || dto.getTargetProductIds().isEmpty()) {
            throw new InvalidRuleException("PRODUCT_EXCLUSION rules must target at least one product");
        }
    }
}
