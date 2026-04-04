package com.constructionplatform.app.service;

import com.constructionplatform.app.dto.recommendation.RecommendationInsightDTO;
import com.constructionplatform.app.dto.recommendation.RecommendationResponseDTO;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class RecommendationInsightValidatorTest {

    private final RecommendationInsightValidator validator = new RecommendationInsightValidator();

    @Test
    void filtersOutUnknownProductIds() {
        RecommendationResponseDTO ranked = new RecommendationResponseDTO();
        ranked.setProductId(10L);
        ranked.setProductName("Product A");

        RecommendationInsightDTO invalid = new RecommendationInsightDTO("CONTEXT", "Invalid", "Should be removed", 999L);

        RecommendationInsightValidator.ValidationOutcome outcome =
                validator.validateOrFallback(List.of(invalid), List.of(ranked));

        assertTrue(outcome.fallbackUsed());
        assertFalse(outcome.insights().isEmpty());
        assertEquals(10L, outcome.insights().get(0).getProductId());
    }

    @Test
    void usesFallbackWhenAiPayloadInconsistent() {
        RecommendationResponseDTO ranked = new RecommendationResponseDTO();
        ranked.setProductId(1L);
        ranked.setProductName("Top Product");

        RecommendationInsightDTO incomplete = new RecommendationInsightDTO("", " ", " ", 1L);

        RecommendationInsightValidator.ValidationOutcome outcome =
                validator.validateOrFallback(List.of(incomplete), List.of(ranked));

        assertTrue(outcome.fallbackUsed());
        assertFalse(outcome.insights().isEmpty());
        assertEquals("Why the top option leads", outcome.insights().get(0).getTitle());
    }

    @Test
    void sanitizesInsightFields() {
        RecommendationResponseDTO ranked = new RecommendationResponseDTO();
        ranked.setProductId(5L);
        ranked.setProductName("Product B");

        RecommendationInsightDTO valid = new RecommendationInsightDTO(
                "   CONTEXT   ",
                "   Title with    extra   spaces   ",
                "   Detail with   spacing   ",
                5L
        );

        RecommendationInsightValidator.ValidationOutcome outcome =
                validator.validateOrFallback(List.of(valid), List.of(ranked));

        assertFalse(outcome.fallbackUsed());
        assertEquals(1, outcome.insights().size());
        assertEquals("CONTEXT", outcome.insights().get(0).getInsightType());
        assertEquals("Title with extra spaces", outcome.insights().get(0).getTitle());
        assertEquals("Detail with spacing", outcome.insights().get(0).getDetail());
    }
}
