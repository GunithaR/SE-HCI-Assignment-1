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
 * Sends structured ranked-output payload to Google Gemini and returns
 * validated insights while preserving deterministic ranking.
 */
@Service
public class RecommendationAugmentationService {

    private static final Logger log = LoggerFactory.getLogger(RecommendationAugmentationService.class);

    @Value("${ai.gemini.api-key:UNCONFIGURED}")
    private String apiKey;

    @Value("${ai.gemini.url:https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent}")
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
            List<RecommendationInsightDTO> rawInsights = callGemini(prompt);

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
        return "You are a construction materials recommendation expert. Analyze the ranked products below and generate EXACTLY 3 unique insights. " +
                "Each insight MUST have a DIFFERENT title and cover a DIFFERENT aspect. " +
                "Insight 1: CONTEXT — Explain why the top-ranked product leads (reference its name and strongest scores). " +
                "Insight 2: TRADE_OFF — Compare the top 2 products, highlighting what the runner-up does better. " +
                "Insight 3: TIP — Give a practical buying tip relevant to the user's preferences (budget, usage area, style). " +
                "Return strict JSON: {\"insights\":[{\"insightType\":\"CONTEXT|TRADE_OFF|TIP\",\"title\":\"unique short title\",\"detail\":\"2-3 sentence explanation\",\"productId\":null}]} " +
                "IMPORTANT: Return EXACTLY 3 insights, each with a unique title. No duplicates. " +
                "Payload: " + payloadJson;
    }

    private List<RecommendationInsightDTO> callGemini(String prompt) throws Exception {
        if ("UNCONFIGURED".equals(apiKey)) {
            throw new IllegalStateException("Gemini API key not configured.");
        }

        // Build Gemini request body
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("contents", List.of(
                Map.of("parts", List.of(Map.of("text", prompt)))
        ));
        body.put("generationConfig", Map.of(
                "temperature", 0.2,
                "responseMimeType", "application/json"
        ));

        String urlWithKey = apiUrl + "?key=" + apiKey;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<String> entity = new HttpEntity<>(objectMapper.writeValueAsString(body), headers);

        // Retry with exponential backoff for 429 rate limiting
        ResponseEntity<String> response = null;
        int maxRetries = 2;
        for (int attempt = 0; attempt <= maxRetries; attempt++) {
            try {
                response = restTemplate.postForEntity(urlWithKey, entity, String.class);
                break; // success
            } catch (org.springframework.web.client.HttpClientErrorException.TooManyRequests e) {
                if (attempt < maxRetries) {
                    long delay = (attempt + 1) * 3000L; // 3s, 6s
                    log.warn("Gemini 429 rate limited, retrying in {}ms (attempt {}/{})", delay, attempt + 1, maxRetries);
                    try { Thread.sleep(delay); } catch (InterruptedException ignored) { Thread.currentThread().interrupt(); }
                } else {
                    throw new IllegalStateException("Gemini rate limit exceeded after " + maxRetries + " retries", e);
                }
            }
        }

        if (response == null || !response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
            throw new IllegalStateException("Gemini returned non-success status: " + (response != null ? response.getStatusCode() : "null"));
        }

        log.info("Gemini augmentation response captured. status={}", response.getStatusCode());

        // Parse Gemini response structure
        String content = extractGeminiContent(response.getBody());
        JsonNode contentJson = objectMapper.readTree(content);
        JsonNode insightsNode = contentJson.path("insights");

        if (!insightsNode.isArray()) {
            return List.of();
        }

        return objectMapper.convertValue(insightsNode, new TypeReference<List<RecommendationInsightDTO>>() {
        });
    }

    /**
     * Extract text content from Gemini API response structure.
     * Gemini format: { candidates: [{ content: { parts: [{ text: "..." }] } }] }
     */
    private String extractGeminiContent(String rawApiResponse) throws Exception {
        JsonNode root = objectMapper.readTree(rawApiResponse);
        JsonNode candidates = root.path("candidates");
        if (!candidates.isArray() || candidates.isEmpty()) {
            throw new IllegalStateException("Gemini response does not include candidates.");
        }

        String content = candidates.get(0)
                .path("content")
                .path("parts")
                .get(0)
                .path("text")
                .asText();

        if (content == null || content.isBlank()) {
            throw new IllegalStateException("Gemini response content is empty.");
        }

        return content;
    }

    public record AugmentationResult(List<RecommendationInsightDTO> insights, boolean fallbackUsed) {
    }
}
