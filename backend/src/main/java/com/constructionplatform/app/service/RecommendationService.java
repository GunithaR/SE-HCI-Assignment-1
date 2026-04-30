package com.constructionplatform.app.service;

import com.constructionplatform.app.dto.recommendation.ComparisonRequestDTO;
import com.constructionplatform.app.dto.recommendation.ComparisonResponseDTO;
import com.constructionplatform.app.dto.recommendation.HybridRecommendationResponseDTO;
import com.constructionplatform.app.dto.recommendation.RecommendationRequestDTO;
import com.constructionplatform.app.dto.recommendation.RecommendationResponseDTO;
import java.util.List;

public interface RecommendationService {
    List<RecommendationResponseDTO> generateRecommendations(RecommendationRequestDTO requestDTO);
    HybridRecommendationResponseDTO generateHybridRecommendations(RecommendationRequestDTO requestDTO);
    ComparisonResponseDTO compareRecommendations(ComparisonRequestDTO requestDTO);
}
