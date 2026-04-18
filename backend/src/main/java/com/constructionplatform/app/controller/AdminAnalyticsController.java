package com.constructionplatform.app.controller;

import com.constructionplatform.app.repository.SiteVisitRepository;
import com.constructionplatform.app.repository.UserRepository;
import com.constructionplatform.app.repository.RecommendationHistoryRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/analytics")
@PreAuthorize("hasRole('ADMIN') or hasRole('SUB_ADMIN')")
public class AdminAnalyticsController {

    private final SiteVisitRepository siteVisitRepository;
    private final UserRepository userRepository;
    private final RecommendationHistoryRepository recommendationHistoryRepository;

    public AdminAnalyticsController(SiteVisitRepository siteVisitRepository, 
                                    UserRepository userRepository,
                                    RecommendationHistoryRepository recommendationHistoryRepository) {
        this.siteVisitRepository = siteVisitRepository;
        this.userRepository = userRepository;
        this.recommendationHistoryRepository = recommendationHistoryRepository;
    }

    @GetMapping("/visits")
    public ResponseEntity<Map<String, Long>> getVisitsMetrics() {
        LocalDateTime now = LocalDateTime.now();
        
        long lastDay = siteVisitRepository.countVisitsSince(now.minusDays(1));
        long lastWeek = siteVisitRepository.countVisitsSince(now.minusDays(7));
        long lastMonth = siteVisitRepository.countVisitsSince(now.minusDays(30));
        long totalVisits = siteVisitRepository.count();

        Map<String, Long> metrics = new HashMap<>();
        metrics.put("lastDay", lastDay);
        metrics.put("lastWeek", lastWeek);
        metrics.put("lastMonth", lastMonth);
        metrics.put("total", totalVisits);

        return ResponseEntity.ok(metrics);
    }

    @GetMapping("/users")
    public ResponseEntity<Map<String, Long>> getUsersMetrics() {
        long totalUsers = userRepository.count();
        
        Map<String, Long> metrics = new HashMap<>();
        metrics.put("total", totalUsers);

        return ResponseEntity.ok(metrics);
    }

    @GetMapping("/sessions")
    public ResponseEntity<Map<String, Long>> getSessionsMetrics() {
        LocalDateTime now = LocalDateTime.now();
        
        long lastDay = recommendationHistoryRepository.countSessionsSince(now.minusDays(1));
        long lastWeek = recommendationHistoryRepository.countSessionsSince(now.minusDays(7));
        long lastMonth = recommendationHistoryRepository.countSessionsSince(now.minusDays(30));
        long totalSessions = recommendationHistoryRepository.count();

        Map<String, Long> metrics = new HashMap<>();
        metrics.put("lastDay", lastDay);
        metrics.put("lastWeek", lastWeek);
        metrics.put("lastMonth", lastMonth);
        metrics.put("total", totalSessions);

        return ResponseEntity.ok(metrics);
    }
}
