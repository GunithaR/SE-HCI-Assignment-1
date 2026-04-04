package com.constructionplatform.app.service;

import com.constructionplatform.app.dto.recommendation.RecommendationInsightDTO;
import com.constructionplatform.app.dto.recommendation.RecommendationResponseDTO;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class RecommendationInsightValidator {

    public ValidationOutcome validateOrFallback(List<RecommendationInsightDTO> aiInsights,
                                                List<RecommendationResponseDTO> rankedResults) {
        Set<Long> allowedProductIds = rankedResults.stream()
                .map(RecommendationResponseDTO::getProductId)
                .collect(Collectors.toCollection(LinkedHashSet::new));

        List<RecommendationInsightDTO> valid = new ArrayList<>();
        if (aiInsights != null) {
            for (RecommendationInsightDTO insight : aiInsights) {
                if (insight == null) {
                    continue;
                }

                Long productId = insight.getProductId();
                if (productId != null && !allowedProductIds.contains(productId)) {
                    continue;
                }

                String title = sanitize(insight.getTitle(), 90);
                String detail = sanitize(insight.getDetail(), 320);
                String type = sanitize(insight.getInsightType(), 40);

                if (detail.isBlank()) {
                    continue;
                }

                RecommendationInsightDTO cleaned = new RecommendationInsightDTO();
                cleaned.setProductId(productId);
                cleaned.setTitle(title.isBlank() ? "Additional insight" : title);
                cleaned.setDetail(detail);
                cleaned.setInsightType(type.isBlank() ? "CONTEXT" : type.toUpperCase());
                valid.add(cleaned);
            }
        }

        if (!valid.isEmpty()) {
            return new ValidationOutcome(valid, false);
        }

        return new ValidationOutcome(buildFallbackInsights(rankedResults), true);
    }

    public List<RecommendationInsightDTO> buildFallbackInsights(List<RecommendationResponseDTO> rankedResults) {
        List<RecommendationInsightDTO> fallback = new ArrayList<>();
        if (rankedResults == null || rankedResults.isEmpty()) {
            fallback.add(new RecommendationInsightDTO(
                    "CONTEXT",
                    "Rule-based results",
                    "Recommendations are currently shown without AI enhancement. The deterministic rule-based ranking is still fully applied.",
                    null
            ));
            return fallback;
        }

        RecommendationResponseDTO top = rankedResults.get(0);
        fallback.add(new RecommendationInsightDTO(
                "CONTEXT",
                "Why the top option leads",
                top.getProductName() + " is ranked first by the rule engine based on the strongest weighted score alignment.",
                top.getProductId()
        ));

        RecommendationResponseDTO withTradeOff = rankedResults.stream()
                .filter(r -> r.getTradeOffs() != null && !r.getTradeOffs().isEmpty())
                .findFirst()
                .orElse(null);

        if (withTradeOff != null) {
            fallback.add(new RecommendationInsightDTO(
                    "TRADE_OFF",
                    "Trade-off to consider",
                    withTradeOff.getProductName() + " has notable trade-offs: " + String.join("; ", withTradeOff.getTradeOffs()),
                    withTradeOff.getProductId()
            ));
        }

        return fallback;
    }

    private String sanitize(String text, int maxLen) {
        if (text == null) {
            return "";
        }
        String compact = text.replaceAll("\\s+", " ").trim();
        if (compact.length() <= maxLen) {
            return compact;
        }
        return compact.substring(0, maxLen);
    }

    public static class ValidationOutcome {
        private final List<RecommendationInsightDTO> insights;
        private final boolean fallbackUsed;

        public ValidationOutcome(List<RecommendationInsightDTO> insights, boolean fallbackUsed) {
            this.insights = insights;
            this.fallbackUsed = fallbackUsed;
        }

        public List<RecommendationInsightDTO> getInsights() {
            return insights;
        }

        public boolean isFallbackUsed() {
            return fallbackUsed;
        }
    }
}
