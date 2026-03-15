package com.constructionplatform.app.dto.recommendation;

import java.math.BigDecimal;
import java.util.List;

public class RecommendationResponseDTO {

    private Long productId;
    private String productName;
    private String brandName;
    private String categoryName;
    private BigDecimal basePrice;
    private String imageUrl;
    private Integer score;
    private String explanation;
    private List<String> matchedRuleNames;
    private boolean excluded;

    public RecommendationResponseDTO() {
    }

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

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
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
}
