package com.constructionplatform.app.dto.comparison;

public class ComparisonAttributeDTO {
    private String attributeName;
    private String value;

    public ComparisonAttributeDTO() {}

    public ComparisonAttributeDTO(String attributeName, String value) {
        this.attributeName = attributeName;
        this.value = value;
    }

    public String getAttributeName() {
        return attributeName;
    }

    public void setAttributeName(String attributeName) {
        this.attributeName = attributeName;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }
}
