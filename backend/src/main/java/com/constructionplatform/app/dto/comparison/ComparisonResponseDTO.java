package com.constructionplatform.app.dto.comparison;

import java.util.List;

public class ComparisonResponseDTO {
    private List<ComparisonProductDTO> products;
    private String comparativeNarrative;
    private Boolean fallbackUsed;
    private List<Long> rankingOrder;

    public ComparisonResponseDTO() {}

    public ComparisonResponseDTO(
            List<ComparisonProductDTO> products,
            String comparativeNarrative,
            Boolean fallbackUsed,
            List<Long> rankingOrder
    ) {
        this.products = products;
        this.comparativeNarrative = comparativeNarrative;
        this.fallbackUsed = fallbackUsed;
        this.rankingOrder = rankingOrder;
    }

    public List<ComparisonProductDTO> getProducts() {
        return products;
    }

    public void setProducts(List<ComparisonProductDTO> products) {
        this.products = products;
    }

    public String getComparativeNarrative() {
        return comparativeNarrative;
    }

    public void setComparativeNarrative(String comparativeNarrative) {
        this.comparativeNarrative = comparativeNarrative;
    }

    public Boolean getFallbackUsed() {
        return fallbackUsed;
    }

    public void setFallbackUsed(Boolean fallbackUsed) {
        this.fallbackUsed = fallbackUsed;
    }

    public List<Long> getRankingOrder() {
        return rankingOrder;
    }

    public void setRankingOrder(List<Long> rankingOrder) {
        this.rankingOrder = rankingOrder;
    }
}
