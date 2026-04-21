package com.constructionplatform.app.repository;

import com.constructionplatform.app.entity.ProductReview;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductReviewRepository extends JpaRepository<ProductReview, Long> {
    Page<ProductReview> findByProductIdOrderByCreatedAtDesc(Long productId, Pageable pageable);

    boolean existsByUserIdAndProductId(String userId, Long productId);

    @Query("SELECT AVG(pr.score) FROM ProductReview pr WHERE pr.product.id = :productId")
    Double getAverageScoreByProductId(@Param("productId") Long productId);

    int countByProductId(Long productId);
}
