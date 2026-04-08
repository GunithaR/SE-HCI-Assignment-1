package com.constructionplatform.app.dto.recommendation;

import java.util.ArrayList;
import java.util.List;

/**
 * Response DTO for the comparison endpoint.
 * Contains a list of compared products, an AI-generated comparative narrative,
 * and metadata about fallback usage.
 */
public class ComparisonResponseDTO {

    /** List of products being compared, each with attributes. */
    private List<ComparisonProductDTO> products = new ArrayList<>();

    /** AI-generated explanation of the comparison, highlighting strengths and trade-offs. */
    private String comparativeNarrative;

    /** Flag indicating if the fallback narrative was used (AI service unavailable). */
    private Boolean fallbackUsed = false;

    /** Original ranking order of the compared products (preserved from recommendation). */
    private List<Long> rankingOrder = new ArrayList<>();

    public ComparisonResponseDTO() {
    }

    public ComparisonResponseDTO(List<ComparisonProductDTO> products, String comparativeNarrative,
                                 Boolean fallbackUsed, List<Long> rankingOrder) {
        this.products = products;
        this.comparativeNarrative = comparativeNarrative;
        this.fallbackUsed = fallbackUsed;
        this.rankingOrder = rankingOrder;
    }

    // ── Getters & Setters ────────────────────────────────────────────────────

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
