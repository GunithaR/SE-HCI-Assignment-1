package com.constructionplatform.app.controller;

import com.constructionplatform.app.dto.rule.RuleCreateRequestDTO;
import com.constructionplatform.app.dto.rule.RuleResponseDTO;
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

    public RuleController(RuleService ruleService) {
        this.ruleService = ruleService;
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
    public ResponseEntity<RuleResponseDTO> toggleRuleStatus(
            @PathVariable Long id,
            @RequestParam RuleStatus status) {
        RuleResponseDTO updatedRule = ruleService.toggleRuleStatus(id, status);
        return ResponseEntity.ok(updatedRule);
    }

    @GetMapping("/active")
    public ResponseEntity<List<RuleResponseDTO>> getActiveRules() {
        return ResponseEntity.ok(ruleService.getActiveRules());
    }
}
