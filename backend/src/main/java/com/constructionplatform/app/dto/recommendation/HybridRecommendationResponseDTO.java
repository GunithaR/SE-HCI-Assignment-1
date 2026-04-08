package com.constructionplatform.app.dto.recommendation;

import java.util.ArrayList;
import java.util.List;

/**
 * Hybrid response where rule-based ranking remains authoritative,
 * and AI contributes only contextual insights.
 */
public class HybridRecommendationResponseDTO {

    private List<RecommendationResponseDTO> recommendations = new ArrayList<>();
    private List<RecommendationInsightDTO> additionalInsights = new ArrayList<>();
    private Boolean fallbackUsed = false;

    public HybridRecommendationResponseDTO() {
    }

    public HybridRecommendationResponseDTO(List<RecommendationResponseDTO> recommendations,
                                           List<RecommendationInsightDTO> additionalInsights,
                                           Boolean fallbackUsed) {
        this.recommendations = recommendations != null ? recommendations : new ArrayList<>();
        this.additionalInsights = additionalInsights != null ? additionalInsights : new ArrayList<>();
        this.fallbackUsed = fallbackUsed != null ? fallbackUsed : false;
    }

    public List<RecommendationResponseDTO> getRecommendations() {
        return recommendations;
    }

    public void setRecommendations(List<RecommendationResponseDTO> recommendations) {
        this.recommendations = recommendations;
    }

    public List<RecommendationInsightDTO> getAdditionalInsights() {
        return additionalInsights;
    }

    public void setAdditionalInsights(List<RecommendationInsightDTO> additionalInsights) {
        this.additionalInsights = additionalInsights;
    }

    public Boolean getFallbackUsed() {
        return fallbackUsed;
    }

    public void setFallbackUsed(Boolean fallbackUsed) {
        this.fallbackUsed = fallbackUsed;
    }
}
