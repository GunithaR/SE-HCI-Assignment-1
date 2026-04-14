package com.constructionplatform.app.dto.rule;

import com.constructionplatform.app.enums.ScoringMode;

/**
 * DTO for an answer-to-attribute mapping within a CONDITIONAL_MATCH rule.
 */
public class AnswerAttributeMappingDTO {

    private Long id;
    private String answerKey;
    private String answerValue;
    private String productAttribute;
    private ScoringMode scoringMode;

    // LEVELED
    private String idealLevel;
    private Double exactMatchScore = 10.0;
    private Double deviation1Score = 5.0;
    private Double deviation2Score = 2.0;

    // CATEGORICAL
    private Double matchScore = 10.0;
    private Double noMatchScore = 2.0;

    // FIXED
    private Double fixedScore;

    // Common
    private Double noDataScore = 3.0;

    public AnswerAttributeMappingDTO() {}

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getAnswerKey() { return answerKey; }
    public void setAnswerKey(String answerKey) { this.answerKey = answerKey; }

    public String getAnswerValue() { return answerValue; }
    public void setAnswerValue(String answerValue) { this.answerValue = answerValue; }

    public String getProductAttribute() { return productAttribute; }
    public void setProductAttribute(String productAttribute) { this.productAttribute = productAttribute; }

    public ScoringMode getScoringMode() { return scoringMode; }
    public void setScoringMode(ScoringMode scoringMode) { this.scoringMode = scoringMode; }

    public String getIdealLevel() { return idealLevel; }
    public void setIdealLevel(String idealLevel) { this.idealLevel = idealLevel; }

    public Double getExactMatchScore() { return exactMatchScore; }
    public void setExactMatchScore(Double exactMatchScore) { this.exactMatchScore = exactMatchScore; }

    public Double getDeviation1Score() { return deviation1Score; }
    public void setDeviation1Score(Double deviation1Score) { this.deviation1Score = deviation1Score; }

    public Double getDeviation2Score() { return deviation2Score; }
    public void setDeviation2Score(Double deviation2Score) { this.deviation2Score = deviation2Score; }

    public Double getMatchScore() { return matchScore; }
    public void setMatchScore(Double matchScore) { this.matchScore = matchScore; }

    public Double getNoMatchScore() { return noMatchScore; }
    public void setNoMatchScore(Double noMatchScore) { this.noMatchScore = noMatchScore; }

    public Double getFixedScore() { return fixedScore; }
    public void setFixedScore(Double fixedScore) { this.fixedScore = fixedScore; }

    public Double getNoDataScore() { return noDataScore; }
    public void setNoDataScore(Double noDataScore) { this.noDataScore = noDataScore; }
}
