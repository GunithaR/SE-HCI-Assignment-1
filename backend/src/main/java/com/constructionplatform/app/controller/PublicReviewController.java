package com.constructionplatform.app.controller;

import com.constructionplatform.app.dto.ReviewCreateRequestDTO;
import com.constructionplatform.app.dto.ReviewResponseDTO;
import com.constructionplatform.app.entity.ProductReview;
import com.constructionplatform.app.service.ProductReviewService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products/{productId}/reviews")
public class PublicReviewController {

    private final ProductReviewService reviewService;

    public PublicReviewController(ProductReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping
    public ResponseEntity<Page<ReviewResponseDTO>> getReviews(
            @PathVariable Long productId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, Math.min(size, 50));
        Page<ProductReview> reviews = reviewService.getReviewsForProduct(productId, pageable);
        return ResponseEntity.ok(reviews.map(ReviewResponseDTO::from));
    }

    @PostMapping
    public ResponseEntity<ReviewResponseDTO> addReview(
            @PathVariable Long productId,
            @Valid @RequestBody ReviewCreateRequestDTO request,
            Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String email = authentication.getName();
        ProductReview review = reviewService.addReview(productId, email, request.getScore(), request.getComment());
        return ResponseEntity.status(HttpStatus.CREATED).body(ReviewResponseDTO.from(review));
    }
}
