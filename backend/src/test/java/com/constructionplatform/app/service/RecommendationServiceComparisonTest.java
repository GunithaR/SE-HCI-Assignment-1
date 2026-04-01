package com.constructionplatform.app.service;

import com.constructionplatform.app.dto.comparison.ComparisonProductDTO;
import com.constructionplatform.app.dto.comparison.ComparisonRequestDTO;
import com.constructionplatform.app.dto.comparison.ComparisonResponseDTO;
import com.constructionplatform.app.entity.Brand;
import com.constructionplatform.app.entity.Category;
import com.constructionplatform.app.entity.Product;
import com.constructionplatform.app.entity.ProductAttribute;
import com.constructionplatform.app.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class RecommendationServiceComparisonTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private RecommendationEngine recommendationEngine;

    @Mock
    private ExplanationAIService explanationAIService;

    @InjectMocks
    private RecommendationService recommendationService;

    private Product product1;
    private Product product2;
    private Brand brand;
    private Category category;
    private ProductAttribute attribute;

    @BeforeEach
    public void setUp() {
        // Setup brand and category
        brand = new Brand();
        brand.setId(1L);
        brand.setName("TestBrand");

        category = new Category();
        category.setId(1L);
        category.setName("TestCategory");

        // Setup attribute
        attribute = new ProductAttribute();
        attribute.setId(1L);
        attribute.setDurabilityRating(8);

        // Setup product 1
        product1 = new Product();
        product1.setId(1L);
        product1.setName("Product1");
        product1.setBasePrice(new BigDecimal("100.00"));
        product1.setBrand(brand);
        product1.setCategory(category);
        product1.setAttribute(attribute);
        product1.setActive(true);

        // Setup product 2
        product2 = new Product();
        product2.setId(2L);
        product2.setName("Product2");
        product2.setBasePrice(new BigDecimal("200.00"));
        product2.setBrand(brand);
        product2.setCategory(category);
        product2.setAttribute(attribute);
        product2.setActive(true);
    }

    @Test
    public void testCompareRecommendations_Success() {
        // Given a valid comparison request with 2 products
        ComparisonRequestDTO request = new ComparisonRequestDTO();
        request.setSelectedProductIds(List.of(1L, 2L));

        when(productRepository.findByIdInAndIsActiveTrue(List.of(1L, 2L)))
                .thenReturn(List.of(product1, product2));

        when(explanationAIService.generateComparisonExplanation(anyList()))
                .thenReturn(new ExplanationAIService.AITextResult("Top product is Product1. Product2 is competitive.", false));

        // When comparing
        ComparisonResponseDTO response = recommendationService.compareRecommendations(request);

        // Then response should contain both products and narrative
        assertNotNull(response);
        assertEquals(2, response.getProducts().size());
        assertNotNull(response.getComparativeNarrative());
        assertEquals(false, response.getFallbackUsed());
        assertEquals(List.of(1L, 2L), response.getRankingOrder());
    }

    @Test
    public void testCompareRecommendations_FallbackUsed() {
        // Given a comparison request
        ComparisonRequestDTO request = new ComparisonRequestDTO();
        request.setSelectedProductIds(List.of(1L, 2L));

        when(productRepository.findByIdInAndIsActiveTrue(List.of(1L, 2L)))
                .thenReturn(List.of(product1, product2));

        // AI service returns fallback result
        when(explanationAIService.generateComparisonExplanation(anyList()))
                .thenReturn(new ExplanationAIService.AITextResult("Fallback narrative.", true));

        // When comparing
        ComparisonResponseDTO response = recommendationService.compareRecommendations(request);

        // Then fallbackUsed flag should be true
        assertEquals(true, response.getFallbackUsed());
    }

    @Test
    public void testCompareRecommendations_InvalidCount() {
        // Given a comparison request with only 1 product
        ComparisonRequestDTO request = new ComparisonRequestDTO();
        request.setSelectedProductIds(List.of(1L));

        // When comparing
        // Then should throw exception
        assertThrows(IllegalArgumentException.class, () -> {
            recommendationService.compareRecommendations(request);
        });
    }

    @Test
    public void testCompareRecommendations_ProductNotFound() {
        // Given a comparison request with 2 IDs but only 1 product found
        ComparisonRequestDTO request = new ComparisonRequestDTO();
        request.setSelectedProductIds(List.of(1L, 2L));

        when(productRepository.findByIdInAndIsActiveTrue(List.of(1L, 2L)))
                .thenReturn(List.of(product1)); // Only 1 product returned

        // When comparing
        // Then should throw exception for mismatch
        assertThrows(IllegalArgumentException.class, () -> {
            recommendationService.compareRecommendations(request);
        });
    }

    @Test
    public void testCompareRecommendations_PreservesRankingOrder() {
        // Given products in a specific order
        ComparisonRequestDTO request = new ComparisonRequestDTO();
        request.setSelectedProductIds(List.of(2L, 1L)); // Reverse order

        when(productRepository.findByIdInAndIsActiveTrue(List.of(2L, 1L)))
                .thenReturn(List.of(product2, product1));

        when(explanationAIService.generateComparisonExplanation(anyList()))
                .thenReturn(new ExplanationAIService.AITextResult("Narrative", false));

        // When comparing
        ComparisonResponseDTO response = recommendationService.compareRecommendations(request);

        // Then ranking order should be preserved
        assertEquals(List.of(2L, 1L), response.getRankingOrder());
    }
}
