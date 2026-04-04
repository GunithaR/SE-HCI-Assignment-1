package com.constructionplatform.app.service;

import com.constructionplatform.app.dto.recommendation.RecommendationInsightDTO;
import com.constructionplatform.app.dto.recommendation.RecommendationResponseDTO;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

class RecommendationInsightValidatorTest {

    private final RecommendationInsightValidator validator = new RecommendationInsightValidator();

    @Test
    void validateOrFallback_filtersOutInsightsForUnknownProducts() {
        List<RecommendationResponseDTO> ranked = List.of(rec(101L, "Alpha", 9.1), rec(102L, "Beta", 8.4));

        RecommendationInsightDTO allowed = new RecommendationInsightDTO(
                "context",
                "Context",
                "Alpha fits the weighted criteria well.",
                101L
        );
        RecommendationInsightDTO disallowed = new RecommendationInsightDTO(
                "alternative",
                "Not allowed",
                "This references a product not in ranked results.",
                999L
        );

        RecommendationInsightValidator.ValidationOutcome outcome =
                validator.validateOrFallback(List.of(allowed, disallowed), ranked);

        assertFalse(outcome.isFallbackUsed());
        assertEquals(1, outcome.getInsights().size());
        assertEquals(101L, outcome.getInsights().get(0).getProductId());
    }

    @Test
    void validateOrFallback_usesFallbackWhenAiResponseIsInconsistent() {
        List<RecommendationResponseDTO> ranked = List.of(rec(201L, "Gamma", 8.8));

        RecommendationInsightDTO invalid = new RecommendationInsightDTO(
                "context",
                "",
                "",
                9999L
        );

        RecommendationInsightValidator.ValidationOutcome outcome =
                validator.validateOrFallback(List.of(invalid), ranked);

        assertTrue(outcome.isFallbackUsed());
        assertFalse(outcome.getInsights().isEmpty());
        assertNotNull(outcome.getInsights().get(0).getDetail());
    }

    @Test
    void validateOrFallback_sanitizesInsightFields() {
        List<RecommendationResponseDTO> ranked = List.of(rec(301L, "Delta", 7.6));

        RecommendationInsightDTO noisy = new RecommendationInsightDTO(
                "  context  ",
                "  Long   title   with   extra spaces  ",
                "  Useful   detail   text.  ",
                301L
        );

        RecommendationInsightValidator.ValidationOutcome outcome =
                validator.validateOrFallback(List.of(noisy), ranked);

        assertFalse(outcome.isFallbackUsed());
        assertEquals("CONTEXT", outcome.getInsights().get(0).getInsightType());
        assertEquals("Long title with extra spaces", outcome.getInsights().get(0).getTitle());
        assertEquals("Useful detail text.", outcome.getInsights().get(0).getDetail());
    }

    private RecommendationResponseDTO rec(Long id, String name, double totalScore) {
        RecommendationResponseDTO dto = new RecommendationResponseDTO();
        dto.setProductId(id);
        dto.setProductName(name);
        dto.setTotalScore(totalScore);
        return dto;
    }
}
