package com.constructionplatform.app.dto.recommendation;

public class RecommendationInsightDTO {

    private String insightType;
    private String title;
    private String detail;
    private Long productId;

    public RecommendationInsightDTO() {
    }

    public RecommendationInsightDTO(String insightType, String title, String detail, Long productId) {
        this.insightType = insightType;
        this.title = title;
        this.detail = detail;
        this.productId = productId;
    }

    public String getInsightType() {
        return insightType;
    }

    public void setInsightType(String insightType) {
        this.insightType = insightType;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDetail() {
        return detail;
    }

    public void setDetail(String detail) {
        this.detail = detail;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }
}
