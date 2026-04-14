package com.constructionplatform.app.entity;

import com.constructionplatform.app.enums.ScoringMode;
import jakarta.persistence.*;

/**
 * Maps a user wizard answer (answerKey + answerValue) to a product attribute evaluation.
 * Belongs directly to a {@link Rule} — no intermediate nesting layer.
 *
 * <p>The {@link ScoringMode} determines how the product attribute value is scored:
 * <ul>
 *   <li>LEVELED — compare product tier vs idealLevel using deviation scoring</li>
 *   <li>CATEGORICAL — exact match vs no-match</li>
 *   <li>FIXED — return a static score regardless of product attribute</li>
 * </ul>
 *
 * <p>Example (Environment rule, coastal mapping):
 * <pre>
 *   answerKey       = "location"
 *   answerValue     = "coastal"
 *   productAttribute = "corrosionResistance"
 *   scoringMode     = LEVELED
 *   idealLevel      = "HIGH"
 *   exactMatchScore = 10.0
 *   deviation1Score = 6.0
 *   deviation2Score = 2.0
 * </pre>
 */
@Entity
@Table(name = "answer_attribute_mappings")
public class AnswerAttributeMapping {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rule_id", nullable = false)
    private Rule rule;

    // ── Trigger: which user answer activates this mapping ────────────────────

    /** The wizard answer key to listen for, e.g. "location", "budget", "style" */
    @Column(name = "answer_key", nullable = false, length = 100)
    private String answerKey;

    /** The specific answer value that triggers this mapping, e.g. "coastal", "economy" */
    @Column(name = "answer_value", nullable = false, length = 100)
    private String answerValue;

    // ── Target: which product attribute to evaluate ─────────────────────────

    /** The product attribute to evaluate, e.g. "corrosionResistance", "budgetLevel".
     *  Null for FIXED mode (no attribute needed). */
    @Column(name = "product_attribute", length = 100)
    private String productAttribute;

    // ── Scoring configuration ───────────────────────────────────────────────

    @Enumerated(EnumType.STRING)
    @Column(name = "scoring_mode", nullable = false, length = 20)
    private ScoringMode scoringMode;

    /** For LEVELED: the ideal tier the product should have (e.g. "HIGH", "LOW") */
    @Column(name = "ideal_level", length = 50)
    private String idealLevel;

    /** Score when product attribute exactly matches the ideal (default 10) */
    @Column(name = "exact_match_score")
    private Double exactMatchScore = 10.0;

    /** Score when product is 1 level away from ideal (default 5) */
    @Column(name = "deviation1_score")
    private Double deviation1Score = 5.0;

    /** Score when product is 2+ levels away from ideal (default 2) */
    @Column(name = "deviation2_score")
    private Double deviation2Score = 2.0;

    /** For CATEGORICAL: score when exact match (default 10) */
    @Column(name = "match_score")
    private Double matchScore = 10.0;

    /** For CATEGORICAL: score when no match (default 2) */
    @Column(name = "no_match_score")
    private Double noMatchScore = 2.0;

    /** For FIXED: the static score to return */
    @Column(name = "fixed_score")
    private Double fixedScore;

    /** Score when the product has no value for this attribute (default 3) */
    @Column(name = "no_data_score")
    private Double noDataScore = 3.0;

    public AnswerAttributeMapping() {
    }

    // ── Getters & Setters ───────────────────────────────────────────────────

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Rule getRule() { return rule; }
    public void setRule(Rule rule) { this.rule = rule; }

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
