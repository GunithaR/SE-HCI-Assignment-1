package com.constructionplatform.app.service;

import com.constructionplatform.app.dto.recommendation.RecommendationInsightDTO;
import com.constructionplatform.app.dto.recommendation.RecommendationResponseDTO;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Validates and sanitizes AI insights to guarantee consistency with
 * engine-ranked recommendation results.
 */
@Component
public class RecommendationInsightValidator {

    public ValidationOutcome validateOrFallback(List<RecommendationInsightDTO> aiInsights,
                                                List<RecommendationResponseDTO> rankedResults) {
        if (rankedResults == null || rankedResults.isEmpty()) {
            return new ValidationOutcome(List.of(), true);
        }

        Set<Long> allowedProductIds = new HashSet<>();
        for (RecommendationResponseDTO result : rankedResults) {
            allowedProductIds.add(result.getProductId());
        }

        if (aiInsights == null || aiInsights.isEmpty()) {
            return new ValidationOutcome(buildFallbackInsights(rankedResults), true);
        }

        List<RecommendationInsightDTO> sanitized = new ArrayList<>();
        for (RecommendationInsightDTO insight : aiInsights) {
            if (insight == null) {
                continue;
            }

            Long productId = insight.getProductId();
            if (productId != null && !allowedProductIds.contains(productId)) {
                continue;
            }

            String title = sanitize(insight.getTitle(), 120);
            String detail = sanitize(insight.getDetail(), 420);
            if (title.isEmpty() || detail.isEmpty()) {
                continue;
            }

            String insightType = sanitize(insight.getInsightType(), 30);
            if (insightType.isEmpty()) {
                insightType = "CONTEXT";
            }

            sanitized.add(new RecommendationInsightDTO(insightType, title, detail, productId));
        }

        if (sanitized.isEmpty()) {
            return new ValidationOutcome(buildFallbackInsights(rankedResults), true);
        }

        return new ValidationOutcome(sanitized, false);
    }

    private List<RecommendationInsightDTO> buildFallbackInsights(List<RecommendationResponseDTO> rankedResults) {
        List<RecommendationInsightDTO> fallback = new ArrayList<>();

        RecommendationResponseDTO top = rankedResults.get(0);
        fallback.add(new RecommendationInsightDTO(
                "CONTEXT",
                "Why the top option leads",
                top.getProductName() + " is ranked first by the rule engine based on your selected preferences and strategy scores.",
                top.getProductId()
        ));

        if (rankedResults.size() > 1) {
            RecommendationResponseDTO second = rankedResults.get(1);
            fallback.add(new RecommendationInsightDTO(
                    "TRADE_OFF",
                    "Alternative worth considering",
                    second.getProductName() + " remains a strong alternative with competitive scoring in selected criteria.",
                    second.getProductId()
            ));
        }

        return fallback;
    }

    private String sanitize(String value, int maxLen) {
        if (value == null) {
            return "";
        }
        String trimmed = value.trim().replaceAll("\\s+", " ");
        if (trimmed.length() > maxLen) {
            return trimmed.substring(0, maxLen);
        }
        return trimmed;
    }

    public record ValidationOutcome(List<RecommendationInsightDTO> insights, boolean fallbackUsed) {
    }
}
