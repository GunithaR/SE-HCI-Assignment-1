package com.constructionplatform.app.dto.comparison;

import java.util.List;
import java.util.Map;

public class ComparisonProductDTO {
    private Long productId;
    private String productName;
    private String brandName;
    private Double basePrice;
    private Double totalScore;
    private Map<String, Double> strategyScores;
    private List<String> matchedRuleNames;
    private List<String> tradeOffs;
    private List<ComparisonAttributeDTO> attributes;

    public ComparisonProductDTO() {}

    public ComparisonProductDTO(
            Long productId,
            String productName,
            String brandName,
            Double basePrice,
            Double totalScore,
            Map<String, Double> strategyScores,
            List<String> matchedRuleNames,
            List<String> tradeOffs,
            List<ComparisonAttributeDTO> attributes
    ) {
        this.productId = productId;
        this.productName = productName;
        this.brandName = brandName;
        this.basePrice = basePrice;
        this.totalScore = totalScore;
        this.strategyScores = strategyScores;
        this.matchedRuleNames = matchedRuleNames;
        this.tradeOffs = tradeOffs;
        this.attributes = attributes;
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

    public Double getBasePrice() {
        return basePrice;
    }

    public void setBasePrice(Double basePrice) {
        this.basePrice = basePrice;
    }

    public Double getTotalScore() {
        return totalScore;
    }

    public void setTotalScore(Double totalScore) {
        this.totalScore = totalScore;
    }

    public Map<String, Double> getStrategyScores() {
        return strategyScores;
    }

    public void setStrategyScores(Map<String, Double> strategyScores) {
        this.strategyScores = strategyScores;
    }

    public List<String> getMatchedRuleNames() {
        return matchedRuleNames;
    }

    public void setMatchedRuleNames(List<String> matchedRuleNames) {
        this.matchedRuleNames = matchedRuleNames;
    }

    public List<String> getTradeOffs() {
        return tradeOffs;
    }

    public void setTradeOffs(List<String> tradeOffs) {
        this.tradeOffs = tradeOffs;
    }

    public List<ComparisonAttributeDTO> getAttributes() {
        return attributes;
    }

    public void setAttributes(List<ComparisonAttributeDTO> attributes) {
        this.attributes = attributes;
    }
}
