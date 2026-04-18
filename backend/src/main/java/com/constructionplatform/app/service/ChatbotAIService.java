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

    @Value("${ai.openrouter.api-key:UNCONFIGURED}")
    private String apiKey;

    @Value("${ai.openrouter.url:https://openrouter.ai/api/v1/chat/completions}")
    private String apiUrl;

    @Value("${ai.openrouter.model:google/gemini-2.5-flash}")
    private String modelName;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public String generateChatResponse(ChatRequestDTO request) {
        log.info("Sending chat request to OpenRouter using model: {}", modelName);

        if ("UNCONFIGURED".equals(apiKey)) {
            log.warn("OpenRouter API key is missing. Using static fallback.");
            return getFallbackResponse();
        }

        try {
            // Build messages array
            List<Map<String, String>> messagesList = new ArrayList<>();
            
            // Add System prompt
            String catalogContext = productService.getCompactProductCatalog();
            String systemInstructions = "You are the L+ SIVILIMA Assistant, a helpful AI chatbot for a construction materials and recommendation platform. " +
                "Keep answers concise, friendly, and focused on construction, budgeting, materials, or platform features. " +
                "If you don't know something, tell them to visit support@buildwise.com.\n\n" +
                "CRITICAL INSTRUCTION: You MUST use the following product catalog to answer questions about products, availability, and prices. " +
                "Do NOT make up products. ONLY recommend products from this list. \n" +
                "Do NOT list or mention product details, brands, or materials unless they are explicitly written in the catalog below. If a user asks about brands or materials not listed, clarify that our platform does not carry them currently.\n\n" + catalogContext;

            messagesList.add(Map.of(
                "role", "system",
                "content", systemInstructions
            ));

            // Add conversation history
            if (request.getMessages() != null) {
                for (ChatMessageDTO msg : request.getMessages()) {
                    messagesList.add(Map.of(
                        "role", msg.getRole() != null ? msg.getRole() : "user",
                        "content", msg.getContent() != null ? msg.getContent() : ""
                    ));
                }
            }

            Map<String, Object> body = Map.of(
                    "model", modelName,
                    "max_tokens", 1000,
                    "messages", messagesList
            );

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);
            headers.set("HTTP-Referer", "http://localhost:3000"); // OpenRouter requires HTTP-Referer
            headers.set("X-Title", "BuildWise Sivilima App");

            HttpEntity<String> entity = new HttpEntity<>(objectMapper.writeValueAsString(body), headers);
            ResponseEntity<String> response = restTemplate.postForEntity(apiUrl, entity, String.class);

            if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
                log.error("OpenRouter API returned error {}", response.getStatusCode());
                return getFallbackResponse();
            }

            JsonNode root = objectMapper.readTree(response.getBody());
            JsonNode choices = root.path("choices");
            if (!choices.isArray() || choices.isEmpty()) {
                log.error("OpenRouter response has no choices.");
                return getFallbackResponse();
            }

            return choices.get(0).path("message").path("content").asText().trim();

        } catch (Exception e) {
            log.error("Failed to generate chat response from OpenRouter", e);
            return getFallbackResponse();
        }
    }

    private String getFallbackResponse() {
        return "I'm currently having trouble connecting to my knowledge base. Please try again later or contact support@buildwise.com!";
    }
}
