package com.constructionplatform.app.service;

import com.constructionplatform.app.dto.recommendation.RecommendationInsightDTO;
import com.constructionplatform.app.dto.recommendation.RecommendationResponseDTO;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Sends structured ranked-output payload to the AI service and returns
 * validated insights while preserving deterministic ranking.
 */
@Service
public class RecommendationAugmentationService {

    private static final Logger log = LoggerFactory.getLogger(RecommendationAugmentationService.class);

    @Value("${ai.hybrid.api-key:${ai.service.api-key:UNCONFIGURED}}")
    private String apiKey;

    @Value("${ai.hybrid.url:${ai.service.url:https://api.openai.com/v1/chat/completions}}")
    private String apiUrl;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final RecommendationInsightValidator validator;

    public RecommendationAugmentationService(RecommendationInsightValidator validator) {
        this.validator = validator;
    }

    public AugmentationResult generateInsights(String category,
                                               Map<String, String> answers,
                                               List<RecommendationResponseDTO> rankedResults) {
        if (rankedResults == null || rankedResults.isEmpty()) {
            return new AugmentationResult(List.of(), true);
        }

        try {
            Map<String, Object> structuredPayload = buildStructuredPayload(category, answers, rankedResults);
            String prompt = buildPrompt(structuredPayload);
            List<RecommendationInsightDTO> rawInsights = callExternalAI(prompt);

            RecommendationInsightValidator.ValidationOutcome outcome =
                    validator.validateOrFallback(rawInsights, rankedResults);

            return new AugmentationResult(outcome.insights(), outcome.fallbackUsed());
        } catch (Exception ex) {
            log.warn("Hybrid augmentation failed, using fallback insights. reason={}", ex.getMessage());
            RecommendationInsightValidator.ValidationOutcome fallback =
                    validator.validateOrFallback(List.of(), rankedResults);
            return new AugmentationResult(fallback.insights(), true);
        }
    }

    private Map<String, Object> buildStructuredPayload(String category,
                                                       Map<String, String> answers,
                                                       List<RecommendationResponseDTO> rankedResults) {
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("category", category);
        payload.put("userProfile", answers == null ? Map.of() : answers);

        List<Map<String, Object>> ranked = new ArrayList<>();
        for (RecommendationResponseDTO item : rankedResults) {
            Map<String, Object> one = new LinkedHashMap<>();
            one.put("productId", item.getProductId());
            one.put("productName", item.getProductName());
            one.put("totalScore", item.getTotalScore());
            one.put("scoreBreakdown", item.getStrategyScores());
            one.put("tradeOffs", item.getTradeOffs());
            one.put("matchedRuleNames", item.getMatchedRuleNames());
            ranked.add(one);
        }
        payload.put("rankedProducts", ranked);

        return payload;
    }

    private String buildPrompt(Map<String, Object> structuredPayload) throws Exception {
        String payloadJson = objectMapper.writeValueAsString(structuredPayload);
        return "You are a recommendation augmentation assistant. Use ONLY the payload below. " +
                "Generate concise contextual insights as strict JSON object: {\"insights\":[{\"insightType\":\"CONTEXT|TRADE_OFF|TIP\",\"title\":\"...\",\"detail\":\"...\",\"productId\":123}]} . " +
                "Do not reorder products, do not remove products, and do not add new products. " +
                "Never reference product IDs not present in rankedProducts. " +
                "Payload: " + payloadJson;
    }

    private List<RecommendationInsightDTO> callExternalAI(String prompt) throws Exception {
        if ("UNCONFIGURED".equals(apiKey)) {
            throw new IllegalStateException("AI API key not configured.");
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("model", "gpt-4o-mini");
        body.put("temperature", 0.2);
        body.put("messages", List.of(Map.of("role", "user", "content", prompt)));

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
        ResponseEntity<String> response = restTemplate.postForEntity(apiUrl, entity, String.class);

        if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
            throw new IllegalStateException("AI service returned non-success status.");
        }

        log.info("Hybrid AI raw response captured for monitoring. status={}", response.getStatusCode());

        String content = extractAssistantContent(response.getBody());
        JsonNode contentJson = objectMapper.readTree(content);
        JsonNode insightsNode = contentJson.path("insights");

        if (!insightsNode.isArray()) {
            return List.of();
        }

        return objectMapper.convertValue(insightsNode, new TypeReference<List<RecommendationInsightDTO>>() {
        });
    }

    private String extractAssistantContent(String rawApiResponse) throws Exception {
        JsonNode root = objectMapper.readTree(rawApiResponse);
        JsonNode choices = root.path("choices");
        if (!choices.isArray() || choices.isEmpty()) {
            throw new IllegalStateException("AI response does not include choices.");
        }

        JsonNode message = choices.get(0).path("message");
        String content = message.path("content").asText();
        if (content == null || content.isBlank()) {
            throw new IllegalStateException("AI response content is empty.");
        }

        return content;
    }

    public record AugmentationResult(List<RecommendationInsightDTO> insights, boolean fallbackUsed) {
    }
}
