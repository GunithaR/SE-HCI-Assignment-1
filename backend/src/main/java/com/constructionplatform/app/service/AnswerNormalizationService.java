package com.constructionplatform.app.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

/**
 * Normalizes raw user wizard answers into system-level attribute values.
 * Uses Google Gemini (free tier) for intelligent normalization, with a
 * deterministic fallback when the AI is unavailable.
 *
 * <p>Example: "economy" → "LOW", "coastal area" → "COASTAL"
 */
@Service
public class AnswerNormalizationService {

    private static final Logger log = LoggerFactory.getLogger(AnswerNormalizationService.class);

    @Value("${ai.gemini.api-key:UNCONFIGURED}")
    private String apiKey;

    @Value("${ai.gemini.url:https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent}")
    private String apiUrl;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * Normalize user answers. Tries Gemini AI first, falls back to deterministic mappings.
     *
     * @param category   the product category (e.g., "Roofing Solution")
     * @param rawAnswers the raw answers from the frontend wizard
     * @return normalized answers with system-level values
     */
    public Map<String, String> normalize(String category, Map<String, String> rawAnswers) {
        if (rawAnswers == null || rawAnswers.isEmpty()) {
            return Map.of();
        }

        try {
            if (!"UNCONFIGURED".equals(apiKey)) {
                Map<String, String> aiResult = callGemini(category, rawAnswers);
                if (aiResult != null && !aiResult.isEmpty()) {
                    log.info("AI normalization succeeded for category '{}' with {} answers", category, aiResult.size());
                    return aiResult;
                }
            }
        } catch (Exception e) {
            log.warn("AI normalization failed, using fallback. reason={}", e.getMessage());
        }

        return fallbackNormalize(category, rawAnswers);
    }

    // ── Gemini AI call

    private Map<String, String> callGemini(String category, Map<String, String> rawAnswers) throws Exception {
        String prompt = buildNormalizationPrompt(category, rawAnswers);

        // Build Gemini request body
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("contents", List.of(
                Map.of("parts", List.of(Map.of("text", prompt)))
        ));
        body.put("generationConfig", Map.of(
                "temperature", 0.1,
                "responseMimeType", "application/json"
        ));

        String urlWithKey = apiUrl + "?key=" + apiKey;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<String> entity = new HttpEntity<>(objectMapper.writeValueAsString(body), headers);
        ResponseEntity<String> response = restTemplate.postForEntity(urlWithKey, entity, String.class);

        if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
            throw new IllegalStateException("Gemini returned non-success status: " + response.getStatusCode());
        }

        // Parse Gemini response
        JsonNode root = objectMapper.readTree(response.getBody());
        JsonNode candidates = root.path("candidates");
        if (!candidates.isArray() || candidates.isEmpty()) {
            throw new IllegalStateException("Gemini response has no candidates.");
        }

        String content = candidates.get(0)
                .path("content")
                .path("parts")
                .get(0)
                .path("text")
                .asText();

        return objectMapper.readValue(content, new TypeReference<Map<String, String>>() {});
    }

    private String buildNormalizationPrompt(String category, Map<String, String> rawAnswers) throws Exception {
        return """
                You are a data normalization engine for a construction materials recommendation system.
                
                Convert the user's raw wizard answers into standardized system values.
                
                STRICT RULES:
                - Return ONLY a flat JSON object with the same keys as the input.
                - Use ONLY the allowed values listed below for each attribute.
                - If an answer doesn't clearly map, pick the closest match.
                - Do NOT add extra keys or explanations.
                
                ALLOWED OUTPUT VALUES:
                - "budget" → one of: "LOW", "MEDIUM", "HIGH"
                - "location" or "climate" or "environment" → one of: "COASTAL", "TROPICAL", "HOT_DRY", "COLD", "ALL"
                - "maintenance" or "maintenancePreference" → one of: "LOW", "MEDIUM", "HIGH"
                - "style" → one of: "MODERN", "TRADITIONAL", "NATURAL", "INDUSTRIAL", "WOODEN", "MARBLE", "TEXTURED", "MINIMAL", "ANY"
                - "durabilityPreference" → one of: "5", "8", "10"
                - "concern" or "priority" or "goal" → keep original value (pass through)
                - "flooring_usage" or "wall_usage" or "room_type" → keep original value (pass through)
                - "traffic" → one of: "LOW", "MEDIUM", "HIGH"
                - "slip_resistance" → one of: "yes", "no"
                - "accessory_type" → keep original value (pass through)
                - "usage_duration" → keep original value (pass through)
                - "usage_environment" → one of: "indoor", "outdoor"
                
                Category: %s
                Raw answers: %s
                """.formatted(category, objectMapper.writeValueAsString(rawAnswers));
    }

    // ── Deterministic fallback ───────────────────────────────────────────────

    /**
     * Deterministic normalization using hardcoded mappings.
     * Consolidated from the former UserInputMapper and strategy normalize methods.
     */
    public Map<String, String> fallbackNormalize(String category, Map<String, String> rawAnswers) {
        Map<String, String> normalized = new LinkedHashMap<>();

        for (Map.Entry<String, String> entry : rawAnswers.entrySet()) {
            String key = entry.getKey();
            String value = entry.getValue();

            if (value == null || value.isBlank()) {
                normalized.put(key, value);
                continue;
            }

            String mapped = switch (key) {
                case "budget" -> normalizeBudget(value);
                case "location", "climate", "environment" -> normalizeClimate(value);
                case "maintenance", "maintenancePreference" -> normalizeMaintenance(value);
                case "style" -> normalizeStyle(value);
                case "durabilityPreference" -> normalizeDurability(value);
                case "traffic" -> normalizeTraffic(value);
                default -> value; // pass through
            };

            normalized.put(key, mapped);
        }

        log.info("Fallback normalization completed for category '{}' with {} answers", category, normalized.size());
        return normalized;
    }

    private String normalizeBudget(String answer) {
        return switch (answer.toLowerCase()) {
            case "economy", "low", "affordable", "cost", "budget" -> "LOW";
            case "mid-range", "mid", "medium", "moderate" -> "MEDIUM";
            case "premium", "high", "luxury" -> "HIGH";
            default -> "MEDIUM";
        };
    }

    private String normalizeClimate(String answer) {
        return switch (answer.toLowerCase()) {
            case "coastal", "coastal area" -> "COASTAL";
            case "heavy rain", "heavy rain area", "rainy & humid", "rainy", "tropical" -> "TROPICAL";
            case "hot/dry", "hot/dry area", "hot & dry", "hot", "dry", "arid" -> "HOT_DRY";
            case "cold", "cold climate" -> "COLD";
            case "humid" -> "TROPICAL";
            case "urban/normal", "urban", "normal", "general / mixed", "general", "mixed" -> "ALL";
            default -> "ALL";
        };
    }

    private String normalizeMaintenance(String answer) {
        return switch (answer.toLowerCase()) {
            case "very low", "very low maintenance", "low", "minimal" -> "LOW";
            case "medium", "moderate", "moderate maintenance", "occasional" -> "MEDIUM";
            case "high", "high maintenance ok", "regular" -> "HIGH";
            default -> "MEDIUM";
        };
    }

    private String normalizeStyle(String answer) {
        return switch (answer.toLowerCase()) {
            case "modern", "contemporary", "sleek" -> "MODERN";
            case "traditional", "classic", "timeless" -> "TRADITIONAL";
            case "natural", "rustic", "earthy" -> "NATURAL";
            case "industrial", "raw", "urban" -> "INDUSTRIAL";
            case "wooden look", "wooden", "wooden finish", "wood" -> "WOODEN";
            case "marble look", "marble" -> "MARBLE";
            case "textured" -> "TEXTURED";
            case "minimal", "minimalist" -> "MINIMAL";
            case "no preference" -> "ANY";
            default -> answer.toUpperCase();
        };
    }

    private String normalizeDurability(String answer) {
        return switch (answer.toLowerCase()) {
            case "standard (5-10 yrs)", "standard", "5-10" -> "5";
            case "long-lasting (15+ yrs)", "long-lasting", "15+" -> "8";
            case "maximum durability", "maximum", "max" -> "10";
            default -> "5";
        };
    }

    private String normalizeTraffic(String answer) {
        return switch (answer.toLowerCase()) {
            case "low", "light" -> "LOW";
            case "medium", "regular", "moderate" -> "MEDIUM";
            case "high", "heavy" -> "HIGH";
            default -> "MEDIUM";
        };
    }
}
