package com.constructionplatform.app.service;

import com.constructionplatform.app.dto.ProductResponseDTO;
import com.constructionplatform.app.entity.Product;
import com.constructionplatform.app.entity.ProductReview;
import com.constructionplatform.app.entity.User;
import com.constructionplatform.app.exception.ResourceNotFoundException;
import com.constructionplatform.app.repository.ProductRepository;
import com.constructionplatform.app.repository.ProductReviewRepository;
import com.constructionplatform.app.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class ProductReviewService {

    private final ProductReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public ProductReviewService(ProductReviewRepository reviewRepository,
                                ProductRepository productRepository,
                                UserRepository userRepository) {
        this.reviewRepository = reviewRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    public Page<ProductReview> getReviewsForProduct(Long productId, Pageable pageable) {
        if (!productRepository.existsById(productId)) {
            throw new ResourceNotFoundException("Product", productId);
        }
        return reviewRepository.findByProductIdOrderByCreatedAtDesc(productId, pageable);
    }

    @Transactional
    public ProductReview addReview(Long productId, String email, Integer score, String comment) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new IllegalArgumentException("User not found with email: " + email));
            
        if (reviewRepository.existsByUserIdAndProductId(user.getId(), productId)) {
            throw new IllegalArgumentException("You have already reviewed this product.");
        }
        
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new ResourceNotFoundException("Product", productId));
            
        ProductReview review = new ProductReview();
        review.setProduct(product);
        review.setUser(user);
        review.setScore(score);
        review.setComment(comment);
        
        return reviewRepository.save(review);
    }

    public void enrichProductDTOWithRating(ProductResponseDTO dto) {
        Double avg = reviewRepository.getAverageScoreByProductId(dto.getId());
        dto.setAverageRating(avg != null ? Math.round(avg * 10.0) / 10.0 : 0.0);
        dto.setReviewCount(reviewRepository.countByProductId(dto.getId()));
    }
}
