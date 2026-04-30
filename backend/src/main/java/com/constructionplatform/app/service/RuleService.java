package com.constructionplatform.app.service;

import com.constructionplatform.app.dto.rule.RuleCreateRequestDTO;
import com.constructionplatform.app.dto.rule.RuleResponseDTO;
import com.constructionplatform.app.enums.RuleStatus;

import java.util.List;

public interface RuleService {
    RuleResponseDTO createRule(RuleCreateRequestDTO request);
    List<RuleResponseDTO> getAllRules();
    RuleResponseDTO getRuleById(Long id);
    RuleResponseDTO updateRule(Long id, RuleCreateRequestDTO request);
    RuleResponseDTO toggleRuleStatus(Long id, RuleStatus status);
    void deleteRule(Long id);
    List<RuleResponseDTO> getActiveRules();
}
