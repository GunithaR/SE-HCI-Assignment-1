package com.constructionplatform.app.dto;

import com.constructionplatform.app.entity.ProductAttribute.BudgetLevel;
import com.constructionplatform.app.entity.ProductAttribute.ClimateSuitability;
import com.constructionplatform.app.entity.ProductAttribute.MaintenanceLevel;
import com.constructionplatform.app.entity.ProductAttribute.Material;
import com.constructionplatform.app.entity.ProductAttribute.ProductSize;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;

/**
 * Request body for {@code POST /api/admin/products}.
 * Jakarta Validation annotations enforce data integrity before the service
 * layer
 * is reached, keeping business logic clean.
 */
public class ProductCreateRequestDTO {

    // ── Core product fields ───────────────────────────────────────────────────

    @NotNull(message = "Category ID is required")
    private Long categoryId;

    @NotNull(message = "Brand ID is required")
    private Long brandId;

    @NotBlank(message = "Product name is required")
    @Size(max = 255, message = "Product name must not exceed 255 characters")
    private String name;

    @Size(max = 2000, message = "Description must not exceed 2000 characters")
    private String description;

    @NotNull(message = "Base price is required")
    @DecimalMin(value = "0.01", message = "Base price must be greater than 0")
    @Digits(integer = 10, fraction = 2, message = "Base price must have at most 10 integer digits and 2 decimal places")
    private BigDecimal basePrice;

    // ── Attribute fields ──────────────────────────────────────────────────────

    @NotNull(message = "Budget level is required (LOW, MEDIUM, HIGH)")
    private BudgetLevel budgetLevel;

    @NotNull(message = "Durability rating is required")
    @Min(value = 1, message = "Durability rating must be at least 1")
    @Max(value = 10, message = "Durability rating must be at most 10")
    private Integer durabilityRating;

    @NotNull(message = "Climate suitability is required (TROPICAL, ARID, TEMPERATE, COLD, ALL)")
    private ClimateSuitability climateSuitability;

    @NotNull(message = "Maintenance level is required (LOW, MEDIUM, HIGH)")
    private MaintenanceLevel maintenanceLevel;

    @Size(max = 100, message = "Style must not exceed 100 characters")
    private String style;

    private ProductSize size;

    private Material material;
    private Integer mainImageIndex;

    // ── Getters ───────────────────────────────────────────────────────────────

    public Long getCategoryId() {
        return categoryId;
    }

    public Long getBrandId() {
        return brandId;
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

    public BudgetLevel getBudgetLevel() {
        return budgetLevel;
    }

    public Integer getDurabilityRating() {
        return durabilityRating;
    }

    public ClimateSuitability getClimateSuitability() {
        return climateSuitability;
    }

    public MaintenanceLevel getMaintenanceLevel() {
        return maintenanceLevel;
    }

    public String getStyle() {
        return style;
    }

    public ProductSize getSize() {
        return size;
    }

    public Material getMaterial() {
        return material;
    }

    public Integer getMainImageIndex() {
        return mainImageIndex;
    }

    // ── Setters ───────────────────────────────────────────────────────────────

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public void setBrandId(Long brandId) {
        this.brandId = brandId;
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

    public void setBudgetLevel(BudgetLevel budgetLevel) {
        this.budgetLevel = budgetLevel;
    }

    public void setDurabilityRating(Integer durabilityRating) {
        this.durabilityRating = durabilityRating;
    }

    public void setClimateSuitability(ClimateSuitability climateSuitability) {
        this.climateSuitability = climateSuitability;
    }

    public void setMaintenanceLevel(MaintenanceLevel maintenanceLevel) {
        this.maintenanceLevel = maintenanceLevel;
    }

    public void setStyle(String style) {
        this.style = style;
    }

    public void setSize(ProductSize size) {
        this.size = size;
    }

    public void setMaterial(Material material) {
        this.material = material;
    }

    public void setMainImageIndex(Integer mainImageIndex) {
        this.mainImageIndex = mainImageIndex;
    }
}
