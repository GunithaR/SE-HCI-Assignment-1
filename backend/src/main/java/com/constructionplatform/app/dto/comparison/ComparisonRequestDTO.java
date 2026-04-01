package com.constructionplatform.app.dto.comparison;

import java.util.List;

public class ComparisonRequestDTO {
    private List<Long> selectedProductIds;
    private List<?> recommendations;

    public ComparisonRequestDTO() {}

    public ComparisonRequestDTO(List<Long> selectedProductIds, List<?> recommendations) {
        this.selectedProductIds = selectedProductIds;
        this.recommendations = recommendations;
    }

    public List<Long> getSelectedProductIds() {
        return selectedProductIds;
    }

    public void setSelectedProductIds(List<Long> selectedProductIds) {
        this.selectedProductIds = selectedProductIds;
    }

    public List<?> getRecommendations() {
        return recommendations;
    }

    public void setRecommendations(List<?> recommendations) {
        this.recommendations = recommendations;
    }
}
