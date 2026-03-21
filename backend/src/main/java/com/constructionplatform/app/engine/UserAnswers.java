package com.constructionplatform.app.engine;

import java.util.HashMap;
import java.util.Map;

/**
 * Holds the user's category selection and their answers to the
 * category-specific questionnaire. The answers map uses question IDs
 * as keys and the selected option values as values.
 */
public class UserAnswers {

    private String category;
    private Map<String, String> answers = new HashMap<>();

    public UserAnswers() {
    }

    public UserAnswers(String category, Map<String, String> answers) {
        this.category = category;
        this.answers = answers != null ? answers : new HashMap<>();
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Map<String, String> getAnswers() {
        return answers;
    }

    public void setAnswers(Map<String, String> answers) {
        this.answers = answers != null ? answers : new HashMap<>();
    }

    /**
     * Convenience method to get a specific answer by question ID.
     * Returns null if the question was not answered.
     */
    public String getAnswer(String questionId) {
        return answers.get(questionId);
    }
}
