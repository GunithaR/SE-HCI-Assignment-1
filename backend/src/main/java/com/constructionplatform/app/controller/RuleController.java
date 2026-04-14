package com.constructionplatform.app.controller;

import com.constructionplatform.app.dto.recommendation.QuestionKeyDTO;
import com.constructionplatform.app.dto.rule.RuleCreateRequestDTO;
import com.constructionplatform.app.dto.rule.RuleResponseDTO;
import com.constructionplatform.app.service.QuestionnaireService;
import com.constructionplatform.app.service.RuleService;
import jakarta.validation.Valid;
import com.constructionplatform.app.enums.RuleStatus;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/rules")
public class RuleController {

    private final RuleService ruleService;
    private final QuestionnaireService questionnaireService;

    public RuleController(RuleService ruleService, QuestionnaireService questionnaireService) {
        this.ruleService = ruleService;
        this.questionnaireService = questionnaireService;
    }

    @PostMapping
    public ResponseEntity<RuleResponseDTO> createRule(@Valid @RequestBody RuleCreateRequestDTO request) {
        RuleResponseDTO createdRule = ruleService.createRule(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdRule);
    }

    @GetMapping
    public ResponseEntity<List<RuleResponseDTO>> getAllRules() {
        return ResponseEntity.ok(ruleService.getAllRules());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RuleResponseDTO> getRuleById(@PathVariable Long id) {
        return ResponseEntity.ok(ruleService.getRuleById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RuleResponseDTO> updateRule(
            @PathVariable Long id,
            @Valid @RequestBody RuleCreateRequestDTO request) {
        RuleResponseDTO updatedRule = ruleService.updateRule(id, request);
        return ResponseEntity.ok(updatedRule);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<RuleResponseDTO> toggleRuleStatus(@PathVariable Long id) {
        RuleResponseDTO updatedRule = ruleService.toggleRuleStatus(id);
        return ResponseEntity.ok(updatedRule);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRule(@PathVariable Long id) {
        ruleService.deleteRule(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/active")
    public ResponseEntity<List<RuleResponseDTO>> getActiveRules() {
        return ResponseEntity.ok(ruleService.getActiveRules());
    }

    /** Returns all available question keys with their options for the rule mapping editor. */
    @GetMapping("/question-keys")
    public ResponseEntity<List<QuestionKeyDTO>> getQuestionKeys() {
        return ResponseEntity.ok(questionnaireService.getAllQuestionKeys());
    }
}
