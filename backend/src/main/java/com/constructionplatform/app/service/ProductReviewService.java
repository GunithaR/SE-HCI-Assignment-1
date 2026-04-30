package com.constructionplatform.app.service;

import com.constructionplatform.app.dto.ProductResponseDTO;
import com.constructionplatform.app.entity.ProductReview;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ProductReviewService {
    Page<ProductReview> getReviewsForProduct(Long productId, Pageable pageable);
    ProductReview addReview(Long productId, String email, Integer score, String comment);
    void enrichProductDTOWithRating(ProductResponseDTO dto);
}
