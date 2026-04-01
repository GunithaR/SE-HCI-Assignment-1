package com.constructionplatform.app.controller;

import com.constructionplatform.app.dto.explanation.ExplanationRequestDTO;
import com.constructionplatform.app.dto.explanation.ExplanationResponseDTO;
import com.constructionplatform.app.service.ExplanationAIService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/public/explanations")
public class ExplanationController {

    private final ExplanationAIService explanationAIService;

    public ExplanationController(ExplanationAIService explanationAIService) {
        this.explanationAIService = explanationAIService;
    }

    @PostMapping
    public ResponseEntity<ExplanationResponseDTO> getExplanation(@RequestBody ExplanationRequestDTO request) {
        String generatedExplanation = explanationAIService.generateExplanation(request);
        
        // Simple proxy detection: if the text lacks an AI signature (from mock), it's a fallback mechanism trigger
        boolean isFallback = !generatedExplanation.contains("AI confirms"); 
        
        ExplanationResponseDTO response = new ExplanationResponseDTO(generatedExplanation, isFallback);
        return ResponseEntity.ok(response);
    }
}
