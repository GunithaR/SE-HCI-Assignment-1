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

    @Enumerated(EnumType.STRING)
    @Column(name = "durability_rating", nullable = false, length = 10)
    private ResistanceLevel durabilityRating;

    @Enumerated(EnumType.STRING)
    @Column(name = "climate_suitability", nullable = false, length = 15)
    private ClimateSuitability climateSuitability;

    @Enumerated(EnumType.STRING)
    @Column(name = "maintenance_level", nullable = false, length = 10)
    private MaintenanceLevel maintenanceLevel;

    @Column(name = "style", length = 100)
    private String style;

    @Enumerated(EnumType.STRING)
    @Column(name = "size", length = 20)
    private ProductSize size;

    @Enumerated(EnumType.STRING)
    @Column(name = "material", length = 30)
    private Material material;

    // ── New resistance / performance attributes ──────────────────────────────

    @Enumerated(EnumType.STRING)
    @Column(name = "water_resistance", length = 10)
    private ResistanceLevel waterResistance;

    @Enumerated(EnumType.STRING)
    @Column(name = "corrosion_resistance", length = 10)
    private ResistanceLevel corrosionResistance;

    @Enumerated(EnumType.STRING)
    @Column(name = "heat_resistance", length = 10)
    private ResistanceLevel heatResistance;

    @Enumerated(EnumType.STRING)
    @Column(name = "slip_resistance", length = 10)
    private ResistanceLevel slipResistance;

    @Enumerated(EnumType.STRING)
    @Column(name = "noise_reduction", length = 10)
    private ResistanceLevel noiseReduction;

    @Column(name = "usage_area", length = 100)
    private String usageArea;

    public ProductAttribute() {
    }

    // ── Getters ──────────────────────────────────────────────────────────────

    public Long getProductId() {
        return productId;
    }

    public Product getProduct() {
        return product;
    }

    public BudgetLevel getBudgetLevel() {
        return budgetLevel;
    }

    public ResistanceLevel getDurabilityRating() {
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

    public ResistanceLevel getWaterResistance() {
        return waterResistance;
    }

    public ResistanceLevel getCorrosionResistance() {
        return corrosionResistance;
    }

    public ResistanceLevel getHeatResistance() {
        return heatResistance;
    }

    public ResistanceLevel getSlipResistance() {
        return slipResistance;
    }

    public ResistanceLevel getNoiseReduction() {
        return noiseReduction;
    }

    public String getUsageArea() {
        return usageArea;
    }

    // ── Setters ──────────────────────────────────────────────────────────────

    public void setProductId(Long id) {
        this.productId = id;
    }

    public void setProduct(Product p) {
        this.product = p;
    }

    public void setBudgetLevel(BudgetLevel b) {
        this.budgetLevel = b;
    }

    public void setDurabilityRating(ResistanceLevel r) {
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

    public void setSize(ProductSize size) {
        this.size = size;
    }

    public void setMaterial(Material material) {
        this.material = material;
    }

    public void setWaterResistance(ResistanceLevel waterResistance) {
        this.waterResistance = waterResistance;
    }

    public void setCorrosionResistance(ResistanceLevel corrosionResistance) {
        this.corrosionResistance = corrosionResistance;
    }

    public void setHeatResistance(ResistanceLevel heatResistance) {
        this.heatResistance = heatResistance;
    }

    public void setSlipResistance(ResistanceLevel slipResistance) {
        this.slipResistance = slipResistance;
    }

    public void setNoiseReduction(ResistanceLevel noiseReduction) {
        this.noiseReduction = noiseReduction;
    }

    public void setUsageArea(String usageArea) {
        this.usageArea = usageArea;
    }

    // ── Builder ──────────────────────────────────────────────────────────────

    public static Builder builder() {
        return new Builder();
    }

    public static final class Builder {
        private Long productId;
        private Product product;
        private BudgetLevel budgetLevel;
        private ResistanceLevel durabilityRating;
        private ClimateSuitability climateSuitability;
        private MaintenanceLevel maintenanceLevel;
        private String style;
        private ProductSize size;
        private Material material;
        private ResistanceLevel waterResistance;
        private ResistanceLevel corrosionResistance;
        private ResistanceLevel heatResistance;
        private ResistanceLevel slipResistance;
        private ResistanceLevel noiseReduction;
        private String usageArea;

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

        public Builder durabilityRating(ResistanceLevel r) {
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

        public Builder size(ProductSize size) {
            this.size = size;
            return this;
        }

        public Builder material(Material material) {
            this.material = material;
            return this;
        }

        public Builder waterResistance(ResistanceLevel r) {
            this.waterResistance = r;
            return this;
        }

        public Builder corrosionResistance(ResistanceLevel r) {
            this.corrosionResistance = r;
            return this;
        }

        public Builder heatResistance(ResistanceLevel r) {
            this.heatResistance = r;
            return this;
        }

        public Builder slipResistance(ResistanceLevel r) {
            this.slipResistance = r;
            return this;
        }

        public Builder noiseReduction(ResistanceLevel r) {
            this.noiseReduction = r;
            return this;
        }

        public Builder usageArea(String u) {
            this.usageArea = u;
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
            a.size = size;
            a.material = material;
            a.waterResistance = waterResistance;
            a.corrosionResistance = corrosionResistance;
            a.heatResistance = heatResistance;
            a.slipResistance = slipResistance;
            a.noiseReduction = noiseReduction;
            a.usageArea = usageArea;
            return a;
        }
    }

    // ── Enums ────────────────────────────────────────────────────────────────

    public enum BudgetLevel {
        LOW, MEDIUM, HIGH
    }

    public enum ClimateSuitability {
        TROPICAL, ARID, TEMPERATE, COLD, ALL
    }

    public enum MaintenanceLevel {
        LOW, MEDIUM, HIGH
    }

    public enum ProductSize {
        XS, S, M, L, XL
    }

    public enum Material {
        STEEL, WOOD, CONCRETE, BRICK, GLASS, ALUMINUM, PVC, CERAMIC, OTHER
    }

    /** Resistance / performance level used for water, corrosion, heat, slip, and noise attributes. */
    public enum ResistanceLevel {
        LOW, MEDIUM, HIGH
    }
}
