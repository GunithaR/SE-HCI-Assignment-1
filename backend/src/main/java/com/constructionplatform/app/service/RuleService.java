package com.constructionplatform.app.service;

import com.constructionplatform.app.dto.rule.*;
import com.constructionplatform.app.entity.*;
import com.constructionplatform.app.enums.RuleStatus;
import com.constructionplatform.app.enums.RuleType;
import com.constructionplatform.app.exception.ResourceNotFoundException;
import com.constructionplatform.app.repository.ProductRepository;
import com.constructionplatform.app.repository.RuleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for admin CRUD operations on rules.
 */
@Service
@Transactional
public class RuleService {

    private final RuleRepository ruleRepository;
    private final ProductRepository productRepository;
    private final RuleValidationService ruleValidationService;

    public RuleService(RuleRepository ruleRepository, ProductRepository productRepository,
                       RuleValidationService ruleValidationService) {
        this.ruleRepository = ruleRepository;
        this.productRepository = productRepository;
        this.ruleValidationService = ruleValidationService;
    }

    public RuleResponseDTO createRule(RuleCreateRequestDTO request) {
        ruleValidationService.validate(request);

        Rule rule = new Rule();
        rule.setName(request.getName());
        rule.setDescription(request.getDescription());
        rule.setRuleType(request.getRuleType());
        rule.setRuleStatus(RuleStatus.ACTIVE);
        rule.setRulePriority(request.getRulePriority());
        rule.setTargetCategoryName(request.getTargetCategoryName());
        rule.setDefaultScore(request.getDefaultScore() != null ? request.getDefaultScore() : 5.0);
        rule.setEffectType(request.getEffectType());
        rule.setEffectValue(request.getEffectValue());

        // Add mappings for CONDITIONAL_MATCH
        if (request.getRuleType() == RuleType.CONDITIONAL_MATCH && request.getMappings() != null) {
            for (AnswerAttributeMappingDTO dto : request.getMappings()) {
                rule.addMapping(toEntity(dto));
            }
        }

        // Add product targets for SCORE_ADJUST and PRODUCT_EXCLUSION
        if ((request.getRuleType() == RuleType.SCORE_ADJUST || request.getRuleType() == RuleType.PRODUCT_EXCLUSION)
                && request.getTargetProductIds() != null) {
            for (Long productId : request.getTargetProductIds()) {
                Product product = productRepository.findById(productId)
                        .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + productId));
                rule.addProductTarget(new RuleProductTarget(product));
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
    public List<RuleResponseDTO> getRulesByType(RuleType ruleType) {
        return ruleRepository.findByRuleType(ruleType).stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public RuleResponseDTO getRuleById(Long id) {
        Rule rule = ruleRepository.findByIdWithDetails(id);
        if (rule == null) {
            throw new ResourceNotFoundException("Rule not found with id: " + id);
        }
        return mapToResponseDTO(rule);
    }

    public RuleResponseDTO updateRule(Long id, RuleCreateRequestDTO request) {
        ruleValidationService.validateForUpdate(request, id);

        Rule rule = ruleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Rule not found with id: " + id));

        rule.setName(request.getName());
        rule.setDescription(request.getDescription());
        rule.setRuleType(request.getRuleType());
        rule.setRulePriority(request.getRulePriority());
        rule.setTargetCategoryName(request.getTargetCategoryName());
        rule.setDefaultScore(request.getDefaultScore() != null ? request.getDefaultScore() : 5.0);
        rule.setEffectType(request.getEffectType());
        rule.setEffectValue(request.getEffectValue());

        // Clear and rebuild mappings
        rule.getMappings().clear();
        if (request.getRuleType() == RuleType.CONDITIONAL_MATCH && request.getMappings() != null) {
            for (AnswerAttributeMappingDTO dto : request.getMappings()) {
                rule.addMapping(toEntity(dto));
            }
        }

        // Clear and rebuild product targets
        rule.getProductTargets().clear();
        if ((request.getRuleType() == RuleType.SCORE_ADJUST || request.getRuleType() == RuleType.PRODUCT_EXCLUSION)
                && request.getTargetProductIds() != null) {
            for (Long productId : request.getTargetProductIds()) {
                Product product = productRepository.findById(productId)
                        .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + productId));
                rule.addProductTarget(new RuleProductTarget(product));
            }
        }

        Rule updatedRule = ruleRepository.save(rule);
        return mapToResponseDTO(updatedRule);
    }

    public RuleResponseDTO toggleRuleStatus(Long id) {
        Rule rule = ruleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Rule not found with id: " + id));
        rule.setRuleStatus(rule.getRuleStatus() == RuleStatus.ACTIVE ? RuleStatus.INACTIVE : RuleStatus.ACTIVE);
        return mapToResponseDTO(ruleRepository.save(rule));
    }

    public void deleteRule(Long id) {
        Rule rule = ruleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Rule not found with id: " + id));
        ruleRepository.delete(rule);
    }

    @Transactional(readOnly = true)
    public List<RuleResponseDTO> getActiveRules() {
        return ruleRepository.findByRuleStatus(RuleStatus.ACTIVE).stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    // ── Entity ↔ DTO conversion ─────────────────────────────────────────────

    private AnswerAttributeMapping toEntity(AnswerAttributeMappingDTO dto) {
        AnswerAttributeMapping m = new AnswerAttributeMapping();
        m.setAnswerKey(dto.getAnswerKey());
        m.setAnswerValue(dto.getAnswerValue());
        m.setProductAttribute(dto.getProductAttribute());
        m.setScoringMode(dto.getScoringMode());
        m.setIdealLevel(dto.getIdealLevel());
        m.setExactMatchScore(dto.getExactMatchScore() != null ? dto.getExactMatchScore() : 10.0);
        m.setDeviation1Score(dto.getDeviation1Score() != null ? dto.getDeviation1Score() : 5.0);
        m.setDeviation2Score(dto.getDeviation2Score() != null ? dto.getDeviation2Score() : 2.0);
        m.setMatchScore(dto.getMatchScore() != null ? dto.getMatchScore() : 10.0);
        m.setNoMatchScore(dto.getNoMatchScore() != null ? dto.getNoMatchScore() : 2.0);
        m.setFixedScore(dto.getFixedScore());
        m.setNoDataScore(dto.getNoDataScore() != null ? dto.getNoDataScore() : 3.0);
        return m;
    }

    private AnswerAttributeMappingDTO toDTO(AnswerAttributeMapping m) {
        AnswerAttributeMappingDTO dto = new AnswerAttributeMappingDTO();
        dto.setId(m.getId());
        dto.setAnswerKey(m.getAnswerKey());
        dto.setAnswerValue(m.getAnswerValue());
        dto.setProductAttribute(m.getProductAttribute());
        dto.setScoringMode(m.getScoringMode());
        dto.setIdealLevel(m.getIdealLevel());
        dto.setExactMatchScore(m.getExactMatchScore());
        dto.setDeviation1Score(m.getDeviation1Score());
        dto.setDeviation2Score(m.getDeviation2Score());
        dto.setMatchScore(m.getMatchScore());
        dto.setNoMatchScore(m.getNoMatchScore());
        dto.setFixedScore(m.getFixedScore());
        dto.setNoDataScore(m.getNoDataScore());
        return dto;
    }

    private RuleResponseDTO mapToResponseDTO(Rule rule) {
        RuleResponseDTO response = new RuleResponseDTO();
        response.setId(rule.getId());
        response.setName(rule.getName());
        response.setDescription(rule.getDescription());
        response.setRuleType(rule.getRuleType());
        response.setRuleStatus(rule.getRuleStatus());
        response.setRulePriority(rule.getRulePriority());
        response.setWeight(rule.getWeight());
        response.setTargetCategoryName(rule.getTargetCategoryName());
        response.setDefaultScore(rule.getDefaultScore());
        response.setEffectType(rule.getEffectType());
        response.setEffectValue(rule.getEffectValue());

        // Map mappings
        if (rule.getMappings() != null) {
            response.setMappings(rule.getMappings().stream()
                    .map(this::toDTO)
                    .collect(Collectors.toList()));
        }

        // Map product targets
        if (rule.getProductTargets() != null) {
            List<ProductTargetDTO> targetDTOs = rule.getProductTargets().stream()
                    .map(t -> new ProductTargetDTO(t.getProduct().getId(), t.getProduct().getName()))
                    .collect(Collectors.toList());
            response.setProductTargets(targetDTOs);
        }

        return response;
    }
}
