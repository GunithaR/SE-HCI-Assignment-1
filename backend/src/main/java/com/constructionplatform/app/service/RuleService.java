package com.constructionplatform.app.service;

import com.constructionplatform.app.dto.rule.RuleConditionDTO;
import com.constructionplatform.app.dto.rule.RuleCreateRequestDTO;
import com.constructionplatform.app.dto.rule.RuleResponseDTO;
import com.constructionplatform.app.entity.Rule;
import com.constructionplatform.app.entity.RuleCondition;
import com.constructionplatform.app.enums.RuleStatus;
import com.constructionplatform.app.repository.RuleRepository;
import com.constructionplatform.app.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RuleService {

    private final RuleRepository ruleRepository;
    private final RuleValidationService ruleValidationService;

    public RuleService(RuleRepository ruleRepository, RuleValidationService ruleValidationService) {
        this.ruleRepository = ruleRepository;
        this.ruleValidationService = ruleValidationService;
    }

    @Transactional
    public RuleResponseDTO createRule(RuleCreateRequestDTO request) {
        ruleValidationService.validate(request);

        Rule rule = new Rule();
        rule.setName(request.getName());
        rule.setDescription(request.getDescription());
        rule.setRuleType(request.getRuleType());
        rule.setRuleStatus(request.getRuleStatus());
        rule.setTargetScope(request.getTargetScope());
        rule.setCombinationType(request.getCombinationType());
        rule.setPriority(request.getPriority());
        rule.setWeight(request.getWeight());
        rule.setTargetCategoryName(request.getTargetCategoryName());
        rule.setDynamicAttribute(request.getDynamicAttribute());
        rule.setEffectType(request.getEffectType());
        rule.setEffectValue(request.getEffectValue());

        if (request.getConditions() != null) {
            for (RuleConditionDTO conditionDTO : request.getConditions()) {
                RuleCondition condition = new RuleCondition();
                condition.setOperandSource(conditionDTO.getOperandSource());
                condition.setAttributeName(conditionDTO.getAttributeName());
                condition.setOperator(conditionDTO.getOperator());
                condition.setExpectedValue(conditionDTO.getExpectedValue());
                rule.addCondition(condition);
            }
        }

        Rule savedRule = ruleRepository.save(rule);
        return mapToResponseDTO(savedRule);
    }

    @Transactional(readOnly = true)
    public List<RuleResponseDTO> getAllRules() {
        return ruleRepository.findAll().stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public RuleResponseDTO getRuleById(Long id) {
        Rule rule = ruleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Rule not found with id: " + id));
        return mapToResponseDTO(rule);
    }

    @Transactional
    public RuleResponseDTO updateRule(Long id, RuleCreateRequestDTO request) {
        ruleValidationService.validate(request);
        Rule rule = ruleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Rule not found with id: " + id));

        rule.setName(request.getName());
        rule.setDescription(request.getDescription());
        rule.setRuleType(request.getRuleType());
        rule.setRuleStatus(request.getRuleStatus());
        rule.setTargetScope(request.getTargetScope());
        rule.setCombinationType(request.getCombinationType());
        rule.setPriority(request.getPriority());
        rule.setWeight(request.getWeight());
        rule.setTargetCategoryName(request.getTargetCategoryName());
        rule.setDynamicAttribute(request.getDynamicAttribute());
        rule.setEffectType(request.getEffectType());
        rule.setEffectValue(request.getEffectValue());

        // Clear existing conditions and add new ones
        rule.getConditions().clear();
        if (request.getConditions() != null) {
            for (RuleConditionDTO conditionDTO : request.getConditions()) {
                RuleCondition condition = new RuleCondition();
                condition.setOperandSource(conditionDTO.getOperandSource());
                condition.setAttributeName(conditionDTO.getAttributeName());
                condition.setOperator(conditionDTO.getOperator());
                condition.setExpectedValue(conditionDTO.getExpectedValue());
                rule.addCondition(condition);
            }
        }

        Rule updatedRule = ruleRepository.save(rule);
        return mapToResponseDTO(updatedRule);
    }

    @Transactional
    public RuleResponseDTO toggleRuleStatus(Long id, RuleStatus status) {
        Rule rule = ruleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Rule not found with id: " + id));
        rule.setRuleStatus(status);
        Rule updatedRule = ruleRepository.save(rule);
        return mapToResponseDTO(updatedRule);
    }

    @Transactional
    public void deleteRule(Long id) {
        Rule rule = ruleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Rule not found with id: " + id));
        ruleRepository.delete(rule);
    }

    @Transactional(readOnly = true)
    public List<RuleResponseDTO> getActiveRules() {
        return ruleRepository.findByRuleStatusOrderByPriorityDesc(RuleStatus.ACTIVE).stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    private RuleResponseDTO mapToResponseDTO(Rule rule) {
        RuleResponseDTO response = new RuleResponseDTO();
        response.setId(rule.getId());
        response.setName(rule.getName());
        response.setDescription(rule.getDescription());
        response.setRuleType(rule.getRuleType());
        response.setRuleStatus(rule.getRuleStatus());
        response.setTargetScope(rule.getTargetScope());
        response.setCombinationType(rule.getCombinationType());
        response.setPriority(rule.getPriority());
        response.setWeight(rule.getWeight());
        response.setTargetCategoryName(rule.getTargetCategoryName());
        response.setDynamicAttribute(rule.getDynamicAttribute());
        response.setEffectType(rule.getEffectType());
        response.setEffectValue(rule.getEffectValue());

        if (rule.getConditions() != null) {
            List<RuleConditionDTO> conditionDTOs = rule.getConditions().stream().map(c -> {
                RuleConditionDTO dto = new RuleConditionDTO();
                dto.setOperandSource(c.getOperandSource());
                dto.setAttributeName(c.getAttributeName());
                dto.setOperator(c.getOperator());
                dto.setExpectedValue(c.getExpectedValue());
                return dto;
            }).collect(Collectors.toList());
            response.setConditions(conditionDTOs);
        }

        return response;
    }
}
