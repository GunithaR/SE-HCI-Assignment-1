package com.constructionplatform.app.repository;

import com.constructionplatform.app.entity.SiteVisit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface SiteVisitRepository extends JpaRepository<SiteVisit, Long> {
    
    @Query("SELECT COUNT(v) FROM SiteVisit v WHERE v.visitedAt >= :since")
    long countVisitsSince(@Param("since") LocalDateTime since);

}
