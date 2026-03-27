package com.constructionplatform.app.dto.recommendation;

import java.util.List;

/**
 * Wraps a category name and its associated questions.
 */
public class QuestionSetDTO {

    private String category;
    private List<QuestionDTO> questions;

    public QuestionSetDTO() {
    }

    public QuestionSetDTO(String category, List<QuestionDTO> questions) {
        this.category = category;
        this.questions = questions;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public List<QuestionDTO> getQuestions() {
        return questions;
    }

    public void setQuestions(List<QuestionDTO> questions) {
        this.questions = questions;
    }
}
