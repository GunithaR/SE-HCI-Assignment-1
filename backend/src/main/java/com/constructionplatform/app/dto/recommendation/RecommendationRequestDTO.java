package com.constructionplatform.app.dto.recommendation;

import jakarta.validation.constraints.NotBlank;

import java.util.HashMap;
import java.util.Map;

/**
 * Request DTO for the recommendation engine.
 * Contains the selected category and a dynamic map of questionnaire answers.
 */
public class RecommendationRequestDTO {

    @NotBlank(message = "Category is required")
    private String category;

    private Long startedAt;

    private Map<String, String> answers = new HashMap<>();

    public RecommendationRequestDTO() {
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Long getStartedAt() {
        return startedAt;
    }

    public void setStartedAt(Long startedAt) {
        this.startedAt = startedAt;
    }

    public Map<String, String> getAnswers() {
        return answers;
    }

    public void setAnswers(Map<String, String> answers) {
        this.answers = answers != null ? answers : new HashMap<>();
    }
}
