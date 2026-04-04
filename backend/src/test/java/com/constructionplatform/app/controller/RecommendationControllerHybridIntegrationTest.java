package com.constructionplatform.app.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.LinkedHashMap;
import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("test")
class RecommendationControllerHybridIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void whenHybridRecommendationsRequested_thenReturnsStructuredHybridResponse() throws Exception {
        Map<String, Object> request = new LinkedHashMap<>();
        request.put("category", "Flooring Solution");
        request.put("answers", Map.of("budget", "MEDIUM", "climate", "TROPICAL"));

        mockMvc.perform(post("/api/public/recommendations/hybrid")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.recommendations").isArray())
                .andExpect(jsonPath("$.additionalInsights").isArray())
                .andExpect(jsonPath("$.fallbackUsed").isBoolean());
    }

    @Test
    void whenHybridRecommendationsRequested_thenRankingMatchesDeterministicEndpoint() throws Exception {
        Map<String, Object> request = new LinkedHashMap<>();
        request.put("category", "Roofing Solution");
        request.put("answers", Map.of("budget", "LOW", "climate", "TROPICAL"));

        MvcResult deterministic = mockMvc.perform(post("/api/public/recommendations")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andReturn();

        MvcResult hybrid = mockMvc.perform(post("/api/public/recommendations/hybrid")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.recommendations").isArray())
                .andReturn();

        JsonNode deterministicJson = objectMapper.readTree(deterministic.getResponse().getContentAsString());
        JsonNode hybridJson = objectMapper.readTree(hybrid.getResponse().getContentAsString()).path("recommendations");

        Assertions.assertEquals(deterministicJson.size(), hybridJson.size(),
                "Hybrid response must keep the same ranked list size as deterministic endpoint");

        for (int i = 0; i < deterministicJson.size(); i++) {
            long deterministicId = deterministicJson.get(i).path("productId").asLong();
            long hybridId = hybridJson.get(i).path("productId").asLong();
            Assertions.assertEquals(deterministicId, hybridId,
                    "Hybrid response must not reorder or change ranked products");
        }
    }
}
