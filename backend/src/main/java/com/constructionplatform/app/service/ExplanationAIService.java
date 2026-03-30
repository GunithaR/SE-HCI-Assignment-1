package com.constructionplatform.app.service;

import com.constructionplatform.app.dto.explanation.ExplanationRequestDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

/**
 * Service to handle generation of natural-language explanations from structured rule outputs.
 * Incorporates a modular AI integration layer with a robust fallback mechanism.
 */
@Service
public class ExplanationAIService {

    private static final Logger log = LoggerFactory.getLogger(ExplanationAIService.class);

    // In a real scenario, this would be an OpenAI key or similar injected via env vars
    @Value("${ai.service.api-key:UNCONFIGURED}")
    private String apiKey;

    @Value("${ai.service.url:https://api.openai.com/v1/chat/completions}")
    private String apiUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * Tries to generate an AI explanation. Falls back to deterministic rule-based generator if failed.
     */
    public String generateExplanation(ExplanationRequestDTO request) {
        log.info("Attempting AI explanation generation for product: {}", request.getProductName());

        try {
            // 1. Build the AI prompt template
            String prompt = buildPromptTemplate(request);

            // 2. Call AI Service natively
            return callExternalAIService(prompt);

        } catch (Exception e) {
            log.warn("AI Service unavailable or failed. Executing fallback. Reason: {}", e.getMessage());
            // 3. Fallback Mechanism execution
            return generateFallbackExplanation(request);
        }
    }

    private String buildPromptTemplate(ExplanationRequestDTO request) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("You are an expert sales assistant. Explain in 1-2 friendly sentences why we recommend this product to the user.\n");
        prompt.append("Product Name: ").append(request.getProductName()).append("\n");
        prompt.append("Total Score: ").append(request.getScore()).append("/10\n");

        if (request.getMatchedRules() != null && !request.getMatchedRules().isEmpty()) {
            prompt.append("Matched User Preferences: ").append(String.join(", ", request.getMatchedRules())).append("\n");
        }

        if (request.getConstraintsSatisfied() != null && !request.getConstraintsSatisfied().isEmpty()) {
            prompt.append("Constraints Satisfied: ").append(String.join(", ", request.getConstraintsSatisfied())).append("\n");
        }

        return prompt.toString();
    }

    private String callExternalAIService(String prompt) {
        if ("UNCONFIGURED".equals(apiKey)) {
            // Fail fast organically to trigger the required fallback gracefully
            throw new IllegalStateException("AI API key is missing from configuration.");
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        // Hypothetical generic payload structure for an LLM
        String requestBody = String.format("{ \"model\": \"gpt-3.5-turbo\", \"messages\": [{\"role\": \"user\", \"content\": \"%s\"}] }", 
                prompt.replace("\"", "\\\"").replace("\n", "\\n"));

        HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);
        ResponseEntity<String> response = restTemplate.postForEntity(apiUrl, entity, String.class);
        
        if (response.getStatusCode().is2xxSuccessful()) {
             // Mock JSON parsing
             return "Our AI confirms that this product represents the ideal synergy of your requirements.";
        } else {
             throw new RuntimeException("External API returned " + response.getStatusCode());
        }
    }

    /**
     * Generates a declarative rule-based explanation utilizing structured string templates natively.
     */
    private String generateFallbackExplanation(ExplanationRequestDTO request) {
        List<String> matches = request.getMatchedRules();
        List<String> constraints = request.getConstraintsSatisfied();

        StringBuilder fallback = new StringBuilder("This product is recommended because it ");

        if (matches != null && !matches.isEmpty()) {
            fallback.append("strongly matches your ").append(String.join(" and ", matches).toLowerCase()).append(" requirements");
        } else {
            fallback.append("serves as a well-rounded option based on your generalized inputs");
        }

        if (constraints != null && !constraints.isEmpty()) {
             fallback.append(". It specifically satisfies constraints for ").append(String.join(", ", constraints).toLowerCase());
        }

        fallback.append(".");

        return fallback.toString();
    }
}
