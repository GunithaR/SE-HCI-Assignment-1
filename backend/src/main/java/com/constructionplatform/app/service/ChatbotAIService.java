package com.constructionplatform.app.service;

import com.constructionplatform.app.dto.chat.ChatMessageDTO;
import com.constructionplatform.app.dto.chat.ChatRequestDTO;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class ChatbotAIService {

    private static final Logger log = LoggerFactory.getLogger(ChatbotAIService.class);

    private final ProductService productService;

    public ChatbotAIService(ProductService productService) {
        this.productService = productService;
    }

    @Value("${ai.gemini.api-key:UNCONFIGURED}")
    private String apiKey;

    @Value("${ai.gemini.url:https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent}")
    private String apiUrl;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public String generateChatResponse(ChatRequestDTO request) {
        log.info("Sending chat request to Gemini API");

        if ("UNCONFIGURED".equals(apiKey)) {
            log.warn("Gemini API key is missing. Using static fallback.");
            return getFallbackResponse();
        }

        try {
            // Build contents array
            List<Map<String, Object>> contents = new ArrayList<>();
            
            // Add conversation history
            if (request.getMessages() != null) {
                for (ChatMessageDTO msg : request.getMessages()) {
                    String role = msg.getRole() != null ? msg.getRole() : "user";
                    if ("assistant".equals(role)) {
                        role = "model";
                    } else if ("system".equals(role)) {
                        continue;
                    }
                    contents.add(Map.of(
                        "role", role,
                        "parts", List.of(Map.of("text", msg.getContent() != null ? msg.getContent() : ""))
                    ));
                }
            }

            // Add System prompt
            String catalogContext = productService.getCompactProductCatalog();
            String systemInstructionsText = "You are the L+ SIVILIMA Assistant, a helpful AI chatbot for a construction materials and recommendation platform. " +
                "Keep answers concise, friendly, and focused on construction, budgeting, materials, or platform features. " +
                "If you don't know something, tell them to visit support@buildwise.com.\n\n" +
                "CRITICAL INSTRUCTION: You MUST use the following product catalog to answer questions about products, availability, and prices. " +
                "Do NOT make up products. ONLY recommend products from this list. \n" +
                "Do NOT list or mention product details, brands, or materials unless they are explicitly written in the catalog below. If a user asks about brands or materials not listed, clarify that our platform does not carry them currently.\n\n" + catalogContext;

            Map<String, Object> systemInstruction = Map.of(
                "parts", List.of(Map.of("text", systemInstructionsText))
            );

            Map<String, Object> body = Map.of(
                    "contents", contents,
                    "systemInstruction", systemInstruction,
                    "generationConfig", Map.of("maxOutputTokens", 1000)
            );

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("x-goog-api-key", apiKey);

            HttpEntity<String> entity = new HttpEntity<>(objectMapper.writeValueAsString(body), headers);
            ResponseEntity<String> response = restTemplate.postForEntity(apiUrl, entity, String.class);

            if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
                log.error("Gemini API returned error {}", response.getStatusCode());
                return getFallbackResponse();
            }

            JsonNode root = objectMapper.readTree(response.getBody());
            JsonNode candidates = root.path("candidates");
            if (!candidates.isArray() || candidates.isEmpty()) {
                log.error("Gemini response has no candidates.");
                return getFallbackResponse();
            }

            return candidates.get(0).path("content").path("parts").get(0).path("text").asText().trim();

        } catch (Exception e) {
            log.error("Failed to generate chat response from Gemini", e);
            return getFallbackResponse();
        }
    }

    private String getFallbackResponse() {
        return "I'm currently having trouble connecting to my knowledge base. Please try again later or contact support@buildwise.com!";
    }
}
