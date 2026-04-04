package com.constructionplatform.app.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class RecommendationControllerHybridIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void hybridEndpointReturnsStructuredResponse() throws Exception {
        String payload = """
                {
                  \"category\": \"Roofing Solution\",
                  \"answers\": {
                    \"budget\": \"LOW\",
                    \"climate\": \"TROPICAL\",
                    \"maintenancePreference\": \"LOW\"
                  }
                }
                """;

        mockMvc.perform(post("/api/public/recommendations/hybrid")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.recommendations").isArray())
                .andExpect(jsonPath("$.additionalInsights").isArray())
                .andExpect(jsonPath("$.fallbackUsed").exists());
    }

    @Test
    void hybridEndpointKeepsRankingIdenticalToDeterministicEndpoint() throws Exception {
        String payload = """
                {
                  \"category\": \"Roofing Solution\",
                  \"answers\": {
                    \"budget\": \"LOW\",
                    \"climate\": \"TROPICAL\",
                    \"maintenancePreference\": \"LOW\"
                  }
                }
                """;

        String deterministicBody = mockMvc.perform(post("/api/public/recommendations")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        String hybridBody = mockMvc.perform(post("/api/public/recommendations/hybrid")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        JsonNode deterministic = objectMapper.readTree(deterministicBody);
        JsonNode hybrid = objectMapper.readTree(hybridBody).path("recommendations");

        assertEquals(deterministic.size(), hybrid.size());

        for (int i = 0; i < deterministic.size(); i++) {
            long detId = deterministic.get(i).path("productId").asLong();
            long hybId = hybrid.get(i).path("productId").asLong();
            assertEquals(detId, hybId, "Ranking changed at index " + i);
        }

        JsonNode insights = objectMapper.readTree(hybridBody).path("additionalInsights");
        for (JsonNode insight : insights) {
            JsonNode insightProductId = insight.path("productId");
            if (!insightProductId.isMissingNode() && !insightProductId.isNull()) {
                long pid = insightProductId.asLong();
                boolean found = false;
                for (JsonNode rec : hybrid) {
                    if (rec.path("productId").asLong() == pid) {
                        found = true;
                        break;
                    }
                }
                assertTrue(found, "Insight references product outside ranked list: " + pid);
            }
        }
    }
}
