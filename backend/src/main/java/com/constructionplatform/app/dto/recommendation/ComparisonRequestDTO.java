package com.constructionplatform.app.dto.recommendation;

import java.util.ArrayList;
import java.util.List;

/**
 * Request DTO for comparing multiple recommended products.
 * The client sends the IDs of products to compare and the full product recommendation data.
 */
public class ComparisonRequestDTO {

    /** List of product IDs to compare (minimum 2 required). */
    private List<Long> selectedProductIds = new ArrayList<>();

    /** Full recommendation data for the selected products (includes scores, attributes, etc.). */
    private List<RecommendationResponseDTO> recommendations = new ArrayList<>();

    public ComparisonRequestDTO() {
    }

    public ComparisonRequestDTO(List<Long> selectedProductIds, List<RecommendationResponseDTO> recommendations) {
        this.selectedProductIds = selectedProductIds;
        this.recommendations = recommendations;
    }

    public List<Long> getSelectedProductIds() {
        return selectedProductIds;
    }

    public void setSelectedProductIds(List<Long> selectedProductIds) {
        this.selectedProductIds = selectedProductIds;
    }

    public List<RecommendationResponseDTO> getRecommendations() {
        return recommendations;
    }

    public void setRecommendations(List<RecommendationResponseDTO> recommendations) {
        this.recommendations = recommendations;
    }
}
