package com.constructionplatform.app.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "product_attributes")
public class ProductAttribute {

    @Id
    @Column(name = "product_id")
    private Long productId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "product_id", foreignKey = @ForeignKey(name = "fk_attr_product"))
    private Product product;

    @Enumerated(EnumType.STRING)
    @Column(name = "budget_level", nullable = false, length = 10)
    private BudgetLevel budgetLevel;

    @Column(name = "durability_rating", nullable = false)
    private Integer durabilityRating;

    @Enumerated(EnumType.STRING)
    @Column(name = "climate_suitability", nullable = false, length = 15)
    private ClimateSuitability climateSuitability;

    @Enumerated(EnumType.STRING)
    @Column(name = "maintenance_level", nullable = false, length = 10)
    private MaintenanceLevel maintenanceLevel;

    @Column(name = "style", length = 100)
    private String style;

    public ProductAttribute() {
    }

    public Long getProductId() {
        return productId;
    }

    public Product getProduct() {
        return product;
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

    public void setProductId(Long id) {
        this.productId = id;
    }

    public void setProduct(Product p) {
        this.product = p;
    }

    public void setBudgetLevel(BudgetLevel b) {
        this.budgetLevel = b;
    }

    public void setDurabilityRating(Integer r) {
        this.durabilityRating = r;
    }

    public void setClimateSuitability(ClimateSuitability c) {
        this.climateSuitability = c;
    }

    public void setMaintenanceLevel(MaintenanceLevel m) {
        this.maintenanceLevel = m;
    }

    public void setStyle(String s) {
        this.style = s;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static final class Builder {
        private Long productId;
        private Product product;
        private BudgetLevel budgetLevel;
        private Integer durabilityRating;
        private ClimateSuitability climateSuitability;
        private MaintenanceLevel maintenanceLevel;
        private String style;

        public Builder productId(Long id) {
            this.productId = id;
            return this;
        }

        public Builder product(Product p) {
            this.product = p;
            return this;
        }

        public Builder budgetLevel(BudgetLevel b) {
            this.budgetLevel = b;
            return this;
        }

        public Builder durabilityRating(Integer r) {
            this.durabilityRating = r;
            return this;
        }

        public Builder climateSuitability(ClimateSuitability c) {
            this.climateSuitability = c;
            return this;
        }

        public Builder maintenanceLevel(MaintenanceLevel m) {
            this.maintenanceLevel = m;
            return this;
        }

        public Builder style(String s) {
            this.style = s;
            return this;
        }

        public ProductAttribute build() {
            ProductAttribute a = new ProductAttribute();
            a.productId = productId;
            a.product = product;
            a.budgetLevel = budgetLevel;
            a.durabilityRating = durabilityRating;
            a.climateSuitability = climateSuitability;
            a.maintenanceLevel = maintenanceLevel;
            a.style = style;
            return a;
        }
    }

    public enum BudgetLevel {
        LOW, MEDIUM, HIGH
    }

    public enum ClimateSuitability {
        TROPICAL, ARID, TEMPERATE, COLD, ALL
    }

    public enum MaintenanceLevel {
        LOW, MEDIUM, HIGH
    }
}
