package com.constructionplatform.app.dto;

import com.constructionplatform.app.entity.ProductReview;
import java.time.LocalDateTime;

public class ReviewResponseDTO {
    private Long id;
    private Integer score;
    private String comment;
    private String userEmail;
    private LocalDateTime createdAt;
    
    public static ReviewResponseDTO from(ProductReview review) {
        ReviewResponseDTO dto = new ReviewResponseDTO();
        dto.id = review.getId();
        dto.score = review.getScore();
        dto.comment = review.getComment();
        if (review.getUser() != null) {
            String fullEmail = review.getUser().getEmail();
            dto.userEmail = fullEmail.replaceAll("(^[^@]{3})[^@]*(@.*)", "$1***$2"); 
        }
        dto.createdAt = review.getCreatedAt();
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }
    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }
    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
