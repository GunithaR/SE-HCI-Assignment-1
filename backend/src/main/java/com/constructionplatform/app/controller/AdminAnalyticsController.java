package com.constructionplatform.app.controller;

import com.constructionplatform.app.repository.SiteVisitRepository;
import com.constructionplatform.app.repository.UserRepository;
import com.constructionplatform.app.repository.RecommendationHistoryRepository;
import com.constructionplatform.app.repository.RuleRepository;
import com.constructionplatform.app.entity.Rule;
import com.constructionplatform.app.enums.RuleStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/analytics")
@PreAuthorize("hasRole('ADMIN') or hasRole('SUB_ADMIN')")
public class AdminAnalyticsController {

    private final SiteVisitRepository siteVisitRepository;
    private final UserRepository userRepository;
    private final RecommendationHistoryRepository recommendationHistoryRepository;
    private final RuleRepository ruleRepository;

    public AdminAnalyticsController(SiteVisitRepository siteVisitRepository, 
                                    UserRepository userRepository,
                                    RecommendationHistoryRepository recommendationHistoryRepository,
                                    RuleRepository ruleRepository) {
        this.siteVisitRepository = siteVisitRepository;
        this.userRepository = userRepository;
        this.recommendationHistoryRepository = recommendationHistoryRepository;
        this.ruleRepository = ruleRepository;
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

    @GetMapping("/rules/active")
    public ResponseEntity<List<Map<String, Object>>> getActiveRules() {
        List<Rule> activeRules = ruleRepository.findByRuleStatus(RuleStatus.ACTIVE);
        
        // Map to safe flat DTOs to avoid Jackson infinite recursion from Rule <-> RuleCondition bidirectional relationship
        List<Map<String, Object>> ruleDTOs = activeRules.stream().map(rule -> {
            Map<String, Object> dto = new HashMap<>();
            dto.put("id", rule.getId());
            dto.put("name", rule.getName());
            dto.put("description", rule.getDescription());
            dto.put("priority", rule.getPriority());
            dto.put("effectType", rule.getEffectType() != null ? rule.getEffectType().name() : null);
            dto.put("effectValue", rule.getEffectValue());
            dto.put("targetScope", rule.getTargetScope() != null ? rule.getTargetScope().name() : null);
            dto.put("targetCategoryName", rule.getTargetCategoryName());
            dto.put("ruleStatus", rule.getRuleStatus() != null ? rule.getRuleStatus().name() : null);
            return dto;
        }).collect(java.util.stream.Collectors.toList());

        return ResponseEntity.ok(ruleDTOs);
    }

    @GetMapping("/rules/usage")
    public ResponseEntity<Map<String, List<Map<String, Object>>>> getRuleUsage() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime thisWeekStart = now.minusDays(7);
        LocalDateTime lastWeekStart = now.minusDays(14);

        List<com.constructionplatform.app.entity.RecommendationHistory> thisWeekSessions =
                recommendationHistoryRepository.findSessionsInRange(thisWeekStart, now);
        List<com.constructionplatform.app.entity.RecommendationHistory> lastWeekSessions =
                recommendationHistoryRepository.findSessionsInRange(lastWeekStart, thisWeekStart);

        Map<String, List<Map<String, Object>>> result = new HashMap<>();
        result.put("thisWeek", aggregateRuleUsage(thisWeekSessions));
        result.put("lastWeek", aggregateRuleUsage(lastWeekSessions));
        return ResponseEntity.ok(result);
    }

    private List<Map<String, Object>> aggregateRuleUsage(
            List<com.constructionplatform.app.entity.RecommendationHistory> sessions) {
        ObjectMapper mapper = new ObjectMapper();
        Map<String, Integer> counts = new LinkedHashMap<>();

        for (com.constructionplatform.app.entity.RecommendationHistory session : sessions) {
            String json = session.getAppliedRulesJson();
            if (json == null || json.isBlank()) continue;
            try {
                List<String> ruleEntries = mapper.readValue(json, new TypeReference<List<String>>() {});
                for (String entry : ruleEntries) {
                    // Strip the suffix like " [+10.0]", " [-5.0]", " [FILTER_OUT]" to get the base rule name
                    String baseName = entry.replaceAll("\\s*\\[.*\\]\\s*$", "").trim();
                    counts.merge(baseName, 1, Integer::sum);
                }
            } catch (Exception ignored) {
                // Malformed JSON — skip this session
            }
        }

        // Sort by count descending and map to list of {name, count}
        return counts.entrySet().stream()
                .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
                .map(e -> {
                    Map<String, Object> entry = new LinkedHashMap<>();
                    entry.put("name", e.getKey());
                    entry.put("count", e.getValue());
                    return entry;
                })
                .collect(Collectors.toList());
    }

    @GetMapping("/products/top")
    public ResponseEntity<Map<String, Map<String, List<Map<String, Object>>>>> getTopProducts() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime thisWeekStart = now.minusDays(7);
        LocalDateTime lastWeekStart = now.minusDays(14);

        List<com.constructionplatform.app.entity.RecommendationHistory> thisWeekSessions =
                recommendationHistoryRepository.findSessionsInRange(thisWeekStart, now);
        List<com.constructionplatform.app.entity.RecommendationHistory> lastWeekSessions =
                recommendationHistoryRepository.findSessionsInRange(lastWeekStart, thisWeekStart);

        Map<String, Map<String, List<Map<String, Object>>>> result = new HashMap<>();
        result.put("thisWeek", aggregateTopProducts(thisWeekSessions));
        result.put("lastWeek", aggregateTopProducts(lastWeekSessions));
        return ResponseEntity.ok(result);
    }

    /**
     * Parses each session's resultSummaryJson to extract product recommendations,
     * aggregates counts per product grouped by category.
     * Returns: { "CategoryName": [ {name, count}, ... ] }
     */
    private Map<String, List<Map<String, Object>>> aggregateTopProducts(
            List<com.constructionplatform.app.entity.RecommendationHistory> sessions) {
        ObjectMapper mapper = new ObjectMapper();
        // category -> (productName -> count)
        Map<String, Map<String, Integer>> categoryProductCounts = new LinkedHashMap<>();

        for (com.constructionplatform.app.entity.RecommendationHistory session : sessions) {
            String json = session.getResultSummaryJson();
            if (json == null || json.isBlank()) continue;
            try {
                com.fasterxml.jackson.databind.JsonNode root = mapper.readTree(json);
                com.fasterxml.jackson.databind.JsonNode recommendations = root.path("recommendations");
                if (!recommendations.isArray()) continue;

                for (com.fasterxml.jackson.databind.JsonNode rec : recommendations) {
                    String productName = rec.path("productName").asText(null);
                    String categoryName = rec.path("categoryName").asText(null);
                    if (productName == null || categoryName == null) continue;

                    // Only count non-excluded products
                    boolean excluded = rec.path("excluded").asBoolean(false);
                    if (excluded) continue;

                    categoryProductCounts
                        .computeIfAbsent(categoryName, k -> new LinkedHashMap<>())
                        .merge(productName, 1, Integer::sum);
                }
            } catch (Exception ignored) {
                // Malformed JSON — skip this session
            }
        }

        // For each category, sort products by count descending and convert to list of DTOs
        Map<String, List<Map<String, Object>>> result = new LinkedHashMap<>();
        categoryProductCounts.forEach((category, productCounts) -> {
            List<Map<String, Object>> ranked = productCounts.entrySet().stream()
                    .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
                    .limit(5)  // Top 5 per category
                    .map(e -> {
                        Map<String, Object> entry = new LinkedHashMap<>();
                        entry.put("name", e.getKey());
                        entry.put("count", e.getValue());
                        return entry;
                    })
                    .collect(Collectors.toList());
            result.put(category, ranked);
        });
        return result;
    }
}
