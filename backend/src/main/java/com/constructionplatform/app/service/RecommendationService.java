package com.constructionplatform.app.service;

import com.constructionplatform.app.dto.recommendation.RecommendationRequestDTO;
import com.constructionplatform.app.dto.recommendation.RecommendationResponseDTO;
import com.constructionplatform.app.engine.EvaluationResult;
import com.constructionplatform.app.engine.InputProfile;
import com.constructionplatform.app.engine.ProductEvaluationResult;
import com.constructionplatform.app.engine.RuleEvaluator;
import com.constructionplatform.app.engine.RuleMatchResult;
import com.constructionplatform.app.entity.Product;
import com.constructionplatform.app.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RecommendationService {

    private final ProductRepository productRepository;
    private final RuleEvaluator ruleEvaluator;
    private final ScoringService scoringService;
    private final RankingService rankingService;

    public RecommendationService(
            ProductRepository productRepository,
            RuleEvaluator ruleEvaluator,
            ScoringService scoringService,
            RankingService rankingService) {
        this.productRepository = productRepository;
        this.ruleEvaluator = ruleEvaluator;
        this.scoringService = scoringService;
        this.rankingService = rankingService;
    }

    public List<RecommendationResponseDTO> generateRecommendations(RecommendationRequestDTO requestDTO) {
        // 1. Map request DTO to InputProfile
        InputProfile inputProfile = mapToInputProfile(requestDTO);

        // 2. Load candidate active products
        List<Product> products = productRepository.findByIsActiveTrue();

        // 3. Call RuleEvaluator
        EvaluationResult evaluationResult = ruleEvaluator.evaluateRules(inputProfile, products);

        // 4. Call ScoringService
        scoringService.score(evaluationResult);

        // 5. Call RankingService
        List<ProductEvaluationResult> rankedResults = rankingService.rank(evaluationResult.getProductResults());

        // 6. Map to DTOs
        return rankedResults.stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    private InputProfile mapToInputProfile(RecommendationRequestDTO requestDTO) {
        InputProfile profile = new InputProfile();
        profile.setBudget(requestDTO.getBudget());
        profile.setClimate(requestDTO.getClimate());
        profile.setStyle(requestDTO.getStyle());
        profile.setDurabilityPreference(requestDTO.getDurabilityPreference());
        profile.setMaintenancePreference(requestDTO.getMaintenancePreference());
        profile.setHouseType(requestDTO.getHouseType());
        return profile;
    }

    private RecommendationResponseDTO mapToResponseDTO(ProductEvaluationResult result) {
        RecommendationResponseDTO dto = new RecommendationResponseDTO();
        Product product = result.getProduct();
        
        dto.setProductId(product.getId());
        dto.setProductName(product.getName());
        dto.setBrandName(product.getBrand() != null ? product.getBrand().getName() : null);
        dto.setCategoryName(product.getCategory() != null ? product.getCategory().getName() : null);
        dto.setBasePrice(product.getBasePrice());
        dto.setImageUrl(product.getImageUrl());
        
        dto.setScore(result.getProvisionalScore());
        dto.setExcluded(result.isExcluded());
        
        List<String> matchedRuleNames = result.getMatchedRules().stream()
                .map(RuleMatchResult::getRuleName)
                .collect(Collectors.toList());
        dto.setMatchedRuleNames(matchedRuleNames);
        
        if (result.isExcluded()) {
            dto.setExplanation("Excluded due to hard constraints.");
        } else if (matchedRuleNames.isEmpty()) {
            dto.setExplanation("Basic match. No soft preferences triggered.");
        } else {
            dto.setExplanation("Matched " + matchedRuleNames.size() + " preferences.");
        }

        return dto;
    }
}
