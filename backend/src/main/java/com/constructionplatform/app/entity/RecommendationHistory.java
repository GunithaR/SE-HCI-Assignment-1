package com.constructionplatform.app.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "recommendation_history")
public class RecommendationHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private String userId; // Nullable if anonymous

    @Column(name = "user_email")
    private String userEmail; // Optional: To quickly display who performed the check

    @Column(nullable = false)
    private String category;

    @Column(name = "started_at", nullable = false)
    private LocalDateTime startedAt;

    @Column(name = "completed_at", nullable = false)
    private LocalDateTime completedAt;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String answersJson; // Details of the questions answered

    @Column(columnDefinition = "TEXT", nullable = false)
    private String resultSummaryJson; // Information of the end recommendation result

    @Column(name = "applied_rules_json", columnDefinition = "TEXT")
    private String appliedRulesJson; // Rules applied during this specific session

    public RecommendationHistory() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public LocalDateTime getStartedAt() {
        return startedAt;
    }

    public void setStartedAt(LocalDateTime startedAt) {
        this.startedAt = startedAt;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }

    public String getAnswersJson() {
        return answersJson;
    }

    public void setAnswersJson(String answersJson) {
        this.answersJson = answersJson;
    }

    public String getResultSummaryJson() {
        return resultSummaryJson;
    }

    public void setResultSummaryJson(String resultSummaryJson) {
        this.resultSummaryJson = resultSummaryJson;
    }

    public String getAppliedRulesJson() {
        return appliedRulesJson;
    }

    public void setAppliedRulesJson(String appliedRulesJson) {
        this.appliedRulesJson = appliedRulesJson;
    }
}
