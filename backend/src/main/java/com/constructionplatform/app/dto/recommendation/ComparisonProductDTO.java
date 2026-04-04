package com.constructionplatform.app.dto.recommendation;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/**
 * A single product within a comparison context.
 * Includes basic product info and a list of attributes for side-by-side comparison.
 */
public class ComparisonProductDTO {

    private Long productId;
    private String productName;
    private String brandName;
    private String categoryName;
    private BigDecimal basePrice;
    private String imageUrl;
    private double totalScore;

    /** List of attributes for comparison (e.g., Durability, Maintenance Level, etc.). */
    private List<ComparisonAttributeDTO> attributes = new ArrayList<>();

    public ComparisonProductDTO() {
    }

    public ComparisonProductDTO(Long productId, String productName, String brandName,
                                String categoryName, BigDecimal basePrice, String imageUrl,
                                double totalScore) {
        this.productId = productId;
        this.productName = productName;
        this.brandName = brandName;
        this.categoryName = categoryName;
        this.basePrice = basePrice;
        this.imageUrl = imageUrl;
        this.totalScore = totalScore;
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

    public List<ComparisonAttributeDTO> getAttributes() {
        return attributes;
    }

    public void setAttributes(List<ComparisonAttributeDTO> attributes) {
        this.attributes = attributes;
    }
}
