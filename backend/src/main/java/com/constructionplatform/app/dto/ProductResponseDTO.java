package com.constructionplatform.app.dto;

import com.constructionplatform.app.entity.Product;
import com.constructionplatform.app.entity.ProductAttribute;

import java.math.BigDecimal;

/**
 * Comprehensive response DTO for a single product.
 *
 * <p>
 * Aggregates fields from the {@link Product} entity, the related
 * {@link ProductAttribute}, the Category, and the Brand so that the
 * frontend never needs to make additional round-trips.
 */
public class ProductResponseDTO {

    // ── Core ─────────────────────────────────────────────────────────────────
    private Long id;
    private String name;
    private String description;
    private BigDecimal basePrice;
    private Boolean isActive;

    // ── Category ─────────────────────────────────────────────────────────────
    private Long categoryId;
    private String categoryName;

    // ── Brand ─────────────────────────────────────────────────────────────────
    private Long brandId;
    private String brandName;

    // ── Attributes ────────────────────────────────────────────────────────────
    private String budgetLevel;
    private String durabilityRating;
    private String climateSuitability;
    private String maintenanceLevel;
    private String style;
    private String size;
    private String material;

    // ── Image ─────────────────────────────────────────────────────────────────
    private String imageUrl;

    public ProductResponseDTO() {
    }

    /**
     * Convenience factory — maps a fully-loaded {@link Product} (with attribute,
     * category, and brand fetched) to this DTO.
     */
    public static ProductResponseDTO from(Product product) {
        ProductResponseDTO dto = new ProductResponseDTO();

        dto.id = product.getId();
        dto.name = product.getName();
        dto.description = product.getDescription();
        dto.basePrice = product.getBasePrice();
        dto.isActive = product.getIsActive();

        if (product.getCategory() != null) {
            dto.categoryId = product.getCategory().getId();
            dto.categoryName = product.getCategory().getName();
        }

        if (product.getBrand() != null) {
            dto.brandId = product.getBrand().getId();
            dto.brandName = product.getBrand().getName();
        }

        ProductAttribute attr = product.getAttribute();
        if (attr != null) {
            dto.budgetLevel = attr.getBudgetLevel() != null ? attr.getBudgetLevel().name() : null;
            dto.durabilityRating = attr.getDurabilityRating() != null ? attr.getDurabilityRating().name() : null;
            dto.climateSuitability = attr.getClimateSuitability() != null ? attr.getClimateSuitability().name() : null;
            dto.maintenanceLevel = attr.getMaintenanceLevel() != null ? attr.getMaintenanceLevel().name() : null;
            dto.style = attr.getStyle();
            dto.size = attr.getSize() != null ? attr.getSize().name() : null;
            dto.material = attr.getMaterial() != null ? attr.getMaterial().name() : null;
        }

        dto.imageUrl = product.getImageUrl();

        return dto;
    }

    // ── Getters ───────────────────────────────────────────────────────────────

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public BigDecimal getBasePrice() {
        return basePrice;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public Long getBrandId() {
        return brandId;
    }

    public String getBrandName() {
        return brandName;
    }

    public String getBudgetLevel() {
        return budgetLevel;
    }

    public String getDurabilityRating() {
        return durabilityRating;
    }

    public String getClimateSuitability() {
        return climateSuitability;
    }

    public String getMaintenanceLevel() {
        return maintenanceLevel;
    }

    public String getStyle() {
        return style;
    }

    public String getSize() {
        return size;
    }

    public String getMaterial() {
        return material;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    // ── Setters ───────────────────────────────────────────────────────────────

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setBasePrice(BigDecimal basePrice) {
        this.basePrice = basePrice;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public void setBrandId(Long brandId) {
        this.brandId = brandId;
    }

    public void setBrandName(String brandName) {
        this.brandName = brandName;
    }

    public void setBudgetLevel(String budgetLevel) {
        this.budgetLevel = budgetLevel;
    }

    public void setDurabilityRating(String durabilityRating) {
        this.durabilityRating = durabilityRating;
    }

    public void setClimateSuitability(String climateSuitability) {
        this.climateSuitability = climateSuitability;
    }

    public void setMaintenanceLevel(String maintenanceLevel) {
        this.maintenanceLevel = maintenanceLevel;
    }

    public void setStyle(String style) {
        this.style = style;
    }

    public void setSize(String size) {
        this.size = size;
    }

    public void setMaterial(String material) {
        this.material = material;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}
