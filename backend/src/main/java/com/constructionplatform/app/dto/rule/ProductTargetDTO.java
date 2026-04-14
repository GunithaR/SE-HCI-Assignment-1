package com.constructionplatform.app.dto.rule;

/**
 * DTO representing a targeted product in SCORE_ADJUST and PRODUCT_EXCLUSION rules.
 */
public class ProductTargetDTO {

    private Long productId;
    private String productName;

    public ProductTargetDTO() {}

    public ProductTargetDTO(Long productId, String productName) {
        this.productId = productId;
        this.productName = productName;
    }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }
}
