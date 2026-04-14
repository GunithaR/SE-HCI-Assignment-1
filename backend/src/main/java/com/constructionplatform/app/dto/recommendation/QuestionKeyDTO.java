package com.constructionplatform.app.dto.recommendation;

import java.util.List;

/**
 * DTO for exposing a question key and its possible answer values to the admin rule editor.
 */
public class QuestionKeyDTO {

    private String key;
    private String label;
    private List<String> categories;
    private List<OptionInfo> options;

    public QuestionKeyDTO() {}

    public QuestionKeyDTO(String key, String label, List<String> categories, List<OptionInfo> options) {
        this.key = key;
        this.label = label;
        this.categories = categories;
        this.options = options;
    }

    public String getKey() { return key; }
    public void setKey(String key) { this.key = key; }

    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }

    public List<String> getCategories() { return categories; }
    public void setCategories(List<String> categories) { this.categories = categories; }

    public List<OptionInfo> getOptions() { return options; }
    public void setOptions(List<OptionInfo> options) { this.options = options; }

    public static class OptionInfo {
        private String value;
        private String label;

        public OptionInfo() {}

        public OptionInfo(String value, String label) {
            this.value = value;
            this.label = label;
        }

        public String getValue() { return value; }
        public void setValue(String value) { this.value = value; }

        public String getLabel() { return label; }
        public void setLabel(String label) { this.label = label; }
    }
}
