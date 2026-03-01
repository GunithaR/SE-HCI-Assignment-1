package com.constructionplatform.app.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "products", indexes = {
                @Index(name = "idx_products_category", columnList = "category_id"),
                @Index(name = "idx_products_brand", columnList = "brand_id"),
                @Index(name = "idx_products_active", columnList = "is_active")
})
public class Product {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "id")
        private Long id;

        @ManyToOne(fetch = FetchType.LAZY, optional = false)
        @JoinColumn(name = "category_id", nullable = false, foreignKey = @ForeignKey(name = "fk_product_category"))
        private Category category;

        @ManyToOne(fetch = FetchType.LAZY, optional = false)
        @JoinColumn(name = "brand_id", nullable = false, foreignKey = @ForeignKey(name = "fk_product_brand"))
        private Brand brand;

        @Column(name = "name", nullable = false, length = 255)
        private String name;

        @Column(name = "description", columnDefinition = "TEXT")
        private String description;

        @Column(name = "base_price", nullable = false, precision = 12, scale = 2)
        private BigDecimal basePrice;

        @Column(name = "is_active", nullable = false)
        private Boolean isActive = true;

        @OneToOne(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
        private ProductAttribute attribute;

        public Product() {
        }

        public Long getId() {
                return id;
        }

        public Category getCategory() {
                return category;
        }

        public Brand getBrand() {
                return brand;
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

        public ProductAttribute getAttribute() {
                return attribute;
        }

        public void setId(Long id) {
                this.id = id;
        }

        public void setCategory(Category c) {
                this.category = c;
        }

        public void setBrand(Brand b) {
                this.brand = b;
        }

        public void setName(String name) {
                this.name = name;
        }

        public void setDescription(String desc) {
                this.description = desc;
        }

        public void setBasePrice(BigDecimal price) {
                this.basePrice = price;
        }

        public void setIsActive(Boolean active) {
                this.isActive = active;
        }

        public void setAttribute(ProductAttribute attr) {
                this.attribute = attr;
        }

        public static Builder builder() {
                return new Builder();
        }

        public static final class Builder {
                private Long id;
                private Category category;
                private Brand brand;
                private String name;
                private String description;
                private BigDecimal basePrice;
                private Boolean isActive = true;
                private ProductAttribute attribute;

                public Builder id(Long id) {
                        this.id = id;
                        return this;
                }

                public Builder category(Category c) {
                        this.category = c;
                        return this;
                }

                public Builder brand(Brand b) {
                        this.brand = b;
                        return this;
                }

                public Builder name(String n) {
                        this.name = n;
                        return this;
                }

                public Builder description(String d) {
                        this.description = d;
                        return this;
                }

                public Builder basePrice(BigDecimal p) {
                        this.basePrice = p;
                        return this;
                }

                public Builder isActive(Boolean a) {
                        this.isActive = a;
                        return this;
                }

                public Builder attribute(ProductAttribute a) {
                        this.attribute = a;
                        return this;
                }

                public Product build() {
                        Product p = new Product();
                        p.id = id;
                        p.category = category;
                        p.brand = brand;
                        p.name = name;
                        p.description = description;
                        p.basePrice = basePrice;
                        p.isActive = isActive;
                        p.attribute = attribute;
                        return p;
                }
        }
}
