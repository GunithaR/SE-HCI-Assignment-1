package com.constructionplatform.app.repository;

import com.constructionplatform.app.entity.RecommendationHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface RecommendationHistoryRepository extends JpaRepository<RecommendationHistory, Long> {
    List<RecommendationHistory> findAllByOrderByStartedAtDesc();

    @Query("SELECT COUNT(h) FROM RecommendationHistory h WHERE h.startedAt >= :since")
    long countSessionsSince(@Param("since") LocalDateTime since);

    @Query("SELECT h FROM RecommendationHistory h WHERE h.startedAt >= :from AND h.startedAt < :to")
    List<RecommendationHistory> findSessionsInRange(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to);
}
