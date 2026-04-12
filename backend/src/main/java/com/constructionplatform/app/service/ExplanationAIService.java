package com.constructionplatform.app.service;

import com.constructionplatform.app.dto.explanation.ExplanationRequestDTO;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

/**
 * Service to handle generation of natural-language explanations from structured rule outputs.
 * Uses Google Gemini (free tier) with a robust fallback mechanism.
 */
@Service
public class ExplanationAIService {

    private static final Logger log = LoggerFactory.getLogger(ExplanationAIService.class);

    @Value("${ai.gemini.api-key:UNCONFIGURED}")
    private String apiKey;

    @Value("${ai.gemini.url:https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent}")
    private String apiUrl;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * Tries to generate an AI explanation. Falls back to deterministic rule-based generator if failed.
     */
    public String generateExplanation(ExplanationRequestDTO request) {
        log.info("Attempting AI explanation generation for product: {}", request.getProductName());

        try {
            // 1. Build the AI prompt template
            String prompt = buildPromptTemplate(request);

            // 2. Call Gemini AI Service
            return callGemini(prompt);

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

        prompt.append("Respond with ONLY the explanation text, no markdown or formatting.");
        return prompt.toString();
    }

    private String callGemini(String prompt) throws Exception {
        if ("UNCONFIGURED".equals(apiKey)) {
            throw new IllegalStateException("Gemini API key is missing from configuration.");
        }

        Map<String, Object> body = Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(Map.of("text", prompt)))
                ),
                "generationConfig", Map.of(
                        "temperature", 0.7,
                        "maxOutputTokens", 150
                )
        );

        String urlWithKey = apiUrl + "?key=" + apiKey;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<String> entity = new HttpEntity<>(objectMapper.writeValueAsString(body), headers);
        ResponseEntity<String> response = restTemplate.postForEntity(urlWithKey, entity, String.class);

        if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
            throw new RuntimeException("Gemini API returned " + response.getStatusCode());
        }

        JsonNode root = objectMapper.readTree(response.getBody());
        JsonNode candidates = root.path("candidates");
        if (!candidates.isArray() || candidates.isEmpty()) {
            throw new RuntimeException("Gemini response has no candidates.");
        }

        return candidates.get(0)
                .path("content")
                .path("parts")
                .get(0)
                .path("text")
                .asText()
                .trim();
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
