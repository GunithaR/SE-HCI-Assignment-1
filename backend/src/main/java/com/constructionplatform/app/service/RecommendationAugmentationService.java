package com.constructionplatform.app.service;

import com.constructionplatform.app.dto.recommendation.RecommendationInsightDTO;
import com.constructionplatform.app.dto.recommendation.RecommendationResponseDTO;
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

@Service
public class RecommendationAugmentationService {

    private static final Logger log = LoggerFactory.getLogger(RecommendationAugmentationService.class);

    @Value("${ai.hybrid.api-key:${ai.service.api-key:UNCONFIGURED}}")
    private String apiKey = "UNCONFIGURED";

    @Value("${ai.hybrid.url:${ai.service.url:https://api.openai.com/v1/chat/completions}}")
    private String apiUrl = "https://api.openai.com/v1/chat/completions";

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final RecommendationInsightValidator insightValidator;

    public RecommendationAugmentationService(RecommendationInsightValidator insightValidator) {
        this.insightValidator = insightValidator;
    }

    public AugmentationResult generateInsights(String category,
                                               Map<String, String> answers,
                                               List<RecommendationResponseDTO> rankedResults) {
        try {
            String prompt = buildPrompt(category, answers, rankedResults);
            List<RecommendationInsightDTO> aiInsights = callExternalAI(prompt);
            RecommendationInsightValidator.ValidationOutcome outcome =
                    insightValidator.validateOrFallback(aiInsights, rankedResults);
            return new AugmentationResult(outcome.getInsights(), outcome.isFallbackUsed());
        } catch (Exception ex) {
            log.warn("Hybrid AI augmentation failed. Using rule-only fallback insights. Cause: {}", ex.getMessage());
            return new AugmentationResult(insightValidator.buildFallbackInsights(rankedResults), true);
        }
    }

    private String buildPrompt(String category,
                               Map<String, String> answers,
                               List<RecommendationResponseDTO> rankedResults) {
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("category", category);
        payload.put("userProfile", answers == null ? Map.of() : answers);

        List<Map<String, Object>> ranked = new ArrayList<>();
        for (RecommendationResponseDTO rec : rankedResults) {
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("productId", rec.getProductId());
            item.put("productName", rec.getProductName());
            item.put("totalScore", rec.getTotalScore());
            item.put("matchedRules", rec.getMatchedRuleNames());
            item.put("scoreBreakdown", rec.getStrategyScores());
            item.put("tradeOffs", rec.getTradeOffs());
            ranked.add(item);
        }
        payload.put("rankedProducts", ranked);

        String json;
        try {
            json = objectMapper.writeValueAsString(payload);
        } catch (Exception e) {
            throw new IllegalStateException("Failed to serialize augmentation payload", e);
        }

        return "You are an augmentation assistant for a deterministic recommendation engine.\n"
                + "Use ONLY the structured payload below.\n"
                + "Do not reorder products, do not remove products, and do not add products.\n"
                + "Return strict JSON with this schema: {\"insights\":[{\"insightType\":\"CONTEXT|TRADE_OFF|ALTERNATIVE\",\"title\":\"...\",\"detail\":\"...\",\"productId\":123|null}]}\n"
                + "Payload: " + json;
    }

    private List<RecommendationInsightDTO> callExternalAI(String prompt) throws Exception {
        if ("UNCONFIGURED".equalsIgnoreCase(apiKey)) {
            throw new IllegalStateException("Hybrid AI API key is not configured.");
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        String escapedPrompt = prompt
                .replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n");

        String requestBody = "{"
                + "\"model\":\"gpt-4o-mini\"," 
                + "\"messages\":[{\"role\":\"user\",\"content\":\"" + escapedPrompt + "\"}]"
                + "}";

        HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);
        ResponseEntity<String> response = restTemplate.postForEntity(apiUrl, entity, String.class);

        if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
            throw new IllegalStateException("Hybrid AI service returned status " + response.getStatusCode());
        }

        log.info("Hybrid AI raw response received ({} chars)", response.getBody().length());

        JsonNode root = objectMapper.readTree(response.getBody());
        JsonNode contentNode = root.path("choices").path(0).path("message").path("content");
        if (contentNode.isMissingNode() || contentNode.asText().isBlank()) {
            throw new IllegalStateException("Hybrid AI response content is empty");
        }

        JsonNode aiJson = objectMapper.readTree(contentNode.asText());
        JsonNode insightsNode = aiJson.path("insights");
        if (!insightsNode.isArray()) {
            throw new IllegalStateException("Hybrid AI response is missing insights array");
        }

        List<RecommendationInsightDTO> insights = new ArrayList<>();
        for (JsonNode insightNode : insightsNode) {
            RecommendationInsightDTO dto = new RecommendationInsightDTO();
            dto.setInsightType(insightNode.path("insightType").asText("CONTEXT"));
            dto.setTitle(insightNode.path("title").asText("Additional insight"));
            dto.setDetail(insightNode.path("detail").asText(""));
            if (!insightNode.path("productId").isMissingNode() && !insightNode.path("productId").isNull()) {
                dto.setProductId(insightNode.path("productId").asLong());
            }
            insights.add(dto);
        }

        return insights;
    }

    public static class AugmentationResult {
        private final List<RecommendationInsightDTO> additionalInsights;
        private final boolean fallbackUsed;

        public AugmentationResult(List<RecommendationInsightDTO> additionalInsights, boolean fallbackUsed) {
            this.additionalInsights = additionalInsights;
            this.fallbackUsed = fallbackUsed;
        }

        public List<RecommendationInsightDTO> getAdditionalInsights() {
            return additionalInsights;
        }

        public boolean isFallbackUsed() {
            return fallbackUsed;
        }
    }
}
