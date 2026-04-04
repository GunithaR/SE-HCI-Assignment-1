package com.constructionplatform.app.dto.recommendation;

import java.util.ArrayList;
import java.util.List;

public class HybridRecommendationResponseDTO {

    private List<RecommendationResponseDTO> recommendations = new ArrayList<>();
    private List<RecommendationInsightDTO> additionalInsights = new ArrayList<>();
    private boolean fallbackUsed;

    public HybridRecommendationResponseDTO() {
    }

    public HybridRecommendationResponseDTO(List<RecommendationResponseDTO> recommendations,
                                           List<RecommendationInsightDTO> additionalInsights,
                                           boolean fallbackUsed) {
        this.recommendations = recommendations;
        this.additionalInsights = additionalInsights;
        this.fallbackUsed = fallbackUsed;
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

    public boolean isFallbackUsed() {
        return fallbackUsed;
    }

    public void setFallbackUsed(boolean fallbackUsed) {
        this.fallbackUsed = fallbackUsed;
    }
}
