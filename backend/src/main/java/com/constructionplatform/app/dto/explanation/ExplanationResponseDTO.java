package com.constructionplatform.app.dto.explanation;

public class ExplanationResponseDTO {

    private String explanation;
    private boolean fallbackUsed;

    public ExplanationResponseDTO() {
    }

    public ExplanationResponseDTO(String explanation, boolean fallbackUsed) {
        this.explanation = explanation;
        this.fallbackUsed = fallbackUsed;
    }

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }

    public boolean isFallbackUsed() {
        return fallbackUsed;
    }

    public void setFallbackUsed(boolean fallbackUsed) {
        this.fallbackUsed = fallbackUsed;
    }
}
