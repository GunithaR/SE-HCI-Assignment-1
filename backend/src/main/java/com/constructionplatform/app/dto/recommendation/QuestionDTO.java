package com.constructionplatform.app.dto.recommendation;

import java.util.List;

/**
 * Represents a single question in a category-specific questionnaire.
 */
public class QuestionDTO {

    private String id;
    private String question;
    private String subtext;
    private List<OptionDTO> options;

    public QuestionDTO() {
    }

    public QuestionDTO(String id, String question, String subtext, List<OptionDTO> options) {
        this.id = id;
        this.question = question;
        this.subtext = subtext;
        this.options = options;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public String getSubtext() {
        return subtext;
    }

    public void setSubtext(String subtext) {
        this.subtext = subtext;
    }

    public List<OptionDTO> getOptions() {
        return options;
    }

    public void setOptions(List<OptionDTO> options) {
        this.options = options;
    }

    /**
     * A single option for a question.
     */
    public static class OptionDTO {
        private String value;
        private String label;
        private String desc;

        public OptionDTO() {
        }

        public OptionDTO(String value, String label, String desc) {
            this.value = value;
            this.label = label;
            this.desc = desc;
        }

        public String getValue() {
            return value;
        }

        public void setValue(String value) {
            this.value = value;
        }

        public String getLabel() {
            return label;
        }

        public void setLabel(String label) {
            this.label = label;
        }

        public String getDesc() {
            return desc;
        }

        public void setDesc(String desc) {
            this.desc = desc;
        }
    }
}
