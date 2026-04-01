package com.constructionplatform.app.dto.recommendation;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Response DTO for a single recommended product.
 * Includes the product details, total weighted score, per-strategy score breakdown,
 * and any trade-off warnings.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class RecommendationResponseDTO {

    private Long productId;
    private String productName;
    private String brandName;
    private String categoryName;
    private BigDecimal basePrice;
    private String imageUrl;

    /** The overall weighted score (0–10 scale). */
    private double totalScore;

    /** Per-strategy score breakdown (e.g., BUDGET → 10.0, ENVIRONMENT → 6.0). */
    private Map<String, Double> strategyScores = new LinkedHashMap<>();

    /** Trade-off warnings when conflicting preferences are detected. */
    private List<String> tradeOffs = new ArrayList<>();

    /** Human-readable explanation of why this product was recommended. */
    private String explanation;

    /** Matched rule names (carried over for backward compatibility). */
    private List<String> matchedRuleNames = new ArrayList<>();

    private boolean excluded;

    public RecommendationResponseDTO() {
    }

    // ── Getters & Setters ────────────────────────────────────────────────────

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getBrandName() {
        return brandName;
    }

    public void setBrandName(String brandName) {
        this.brandName = brandName;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public BigDecimal getBasePrice() {
        return basePrice;
    }

    public void setBasePrice(BigDecimal basePrice) {
        this.basePrice = basePrice;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public double getTotalScore() {
        return totalScore;
    }

    public void setTotalScore(double totalScore) {
        this.totalScore = totalScore;
    }

    public Map<String, Double> getStrategyScores() {
        return strategyScores;
    }

    public void setStrategyScores(Map<String, Double> strategyScores) {
        this.strategyScores = strategyScores;
    }

    public List<String> getTradeOffs() {
        return tradeOffs;
    }

    public void setTradeOffs(List<String> tradeOffs) {
        this.tradeOffs = tradeOffs;
    }

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }

    public List<String> getMatchedRuleNames() {
        return matchedRuleNames;
    }

    public void setMatchedRuleNames(List<String> matchedRuleNames) {
        this.matchedRuleNames = matchedRuleNames;
    }

    public boolean isExcluded() {
        return excluded;
    }

    public void setExcluded(boolean excluded) {
        this.excluded = excluded;
    }

    // Keep backward-compatible integer score getter
    public Integer getScore() {
        return (int) Math.round(totalScore);
    }

    // No-op setter for score field (for deserialization compatibility)
    public void setScore(Integer score) {
        // Ignore incoming score field; totalScore is the single source of truth
    }
}
