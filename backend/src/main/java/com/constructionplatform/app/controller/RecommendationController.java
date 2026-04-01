package com.constructionplatform.app.controller;

import com.constructionplatform.app.dto.comparison.ComparisonRequestDTO;
import com.constructionplatform.app.dto.comparison.ComparisonResponseDTO;
import com.constructionplatform.app.dto.recommendation.RecommendationRequestDTO;
import com.constructionplatform.app.dto.recommendation.RecommendationResponseDTO;
import com.constructionplatform.app.service.RecommendationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/public/recommendations")
public class RecommendationController {

    private final RecommendationService recommendationService;

    public RecommendationController(RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    @PostMapping
    public ResponseEntity<List<RecommendationResponseDTO>> generateRecommendations(
            @Valid @RequestBody RecommendationRequestDTO request) {
        List<RecommendationResponseDTO> recommendations = recommendationService.generateRecommendations(request);
        return ResponseEntity.ok(recommendations);
    }

    @PostMapping("/compare")
    public ResponseEntity<ComparisonResponseDTO> compareRecommendations(
            @Valid @RequestBody ComparisonRequestDTO request) {
        ComparisonResponseDTO comparison = recommendationService.compareRecommendations(request);
        return ResponseEntity.ok(comparison);
    }
}
