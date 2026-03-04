package com.constructionplatform.app.controller;

import com.constructionplatform.app.entity.Brand;
import com.constructionplatform.app.entity.Category;
import com.constructionplatform.app.entity.Product;
import com.constructionplatform.app.repository.BrandRepository;
import com.constructionplatform.app.repository.CategoryRepository;
import com.constructionplatform.app.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional // Rolls back database changes after each test automatically
@ActiveProfiles("test") 
class PublicCatalogControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private BrandRepository brandRepository;

    @Autowired
    private ProductRepository productRepository;

    private Category testCategory;
    private Brand testBrand;
    private List<Product> testProducts = new ArrayList<>();

    @BeforeEach
    void setUpData() {
        // Clear existing data (optional, @Transactional usually handles this, but good for clean state if needed)
        productRepository.deleteAll();
        categoryRepository.deleteAll();
        brandRepository.deleteAll();

        // 1. Create a Test Category
        testCategory = new Category();
        testCategory.setName("Test Roofing");
        testCategory.setDescription("Roofing materials for testing");
        testCategory = categoryRepository.save(testCategory);

        // 2. Create a Test Brand
        testBrand = new Brand();
        testBrand.setName("TestCo");
        testBrand.setDescription("Testing Brand");
        testBrand = brandRepository.save(testBrand);

        // 3. Create 15 Test Products in this category
        // 12 active ones, 3 inactive ones (to test filtering)
        for (int i = 1; i <= 15; i++) {
            Product p = Product.builder()
                .name("Product " + String.format("%02d", i))
                .description("Desc " + i)
                .basePrice(BigDecimal.valueOf(10.0 * i))
                .category(testCategory)
                .brand(testBrand)
                .isActive(i <= 12) // First 12 are active, last 3 are inactive
                .build();
            testProducts.add(productRepository.save(p));
        }

        // 4. Create an empty category to test
        Category emptyCategory = new Category();
        emptyCategory.setName("Empty Category");
        categoryRepository.save(emptyCategory);
    }

    @Test
    void whenGetProductsByCategoryWithoutAuth_thenReturns200OK() throws Exception {
        mockMvc.perform(get("/api/public/categories/{id}/products", testCategory.getId()))
               .andExpect(status().isOk())
               .andExpect(content().contentType("application/json"));
    }

    @Test
    void whenGetProducts_usesDefaultPagination_andFiltersInactive() throws Exception {
        // We have 12 active products. Default size is 10.
        // So page 0 should have 10 elements.
        
        mockMvc.perform(get("/api/public/categories/{id}/products", testCategory.getId()))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$.content", hasSize(10)))
               .andExpect(jsonPath("$.totalElements", is(12)))  // Only counting active products
               .andExpect(jsonPath("$.totalPages", is(2)))      // 10 on p0, 2 on p1
               .andExpect(jsonPath("$.number", is(0)))          // Current page is 0
               // Spot check first item (Assuming ascending alphabetical sort by name as per Service layer)
               .andExpect(jsonPath("$.content[0].name", is("Product 01")));
    }

    @Test
    void whenGetProducts_withCustomPagination_thenReturnsCorrectSlice() throws Exception {
        // Request Page 1 (the second page), size 5
        mockMvc.perform(get("/api/public/categories/{id}/products", testCategory.getId())
                   .param("page", "1")
                   .param("size", "5"))
               .andExpect(status().isOk())
               // The second page of size 5 should have 5 items (items 6-10)
               .andExpect(jsonPath("$.content", hasSize(5)))
               .andExpect(jsonPath("$.number", is(1)))
               .andExpect(jsonPath("$.size", is(5)))
               // Spot check first item on this page (Product 06)
               .andExpect(jsonPath("$.content[0].name", is("Product 06")));
    }


    @Test
    void whenRequestingExcessiveSize_thenSizeIsCappedAt50() throws Exception {
        // To test this effectively, we ideally need more than 50 active products.
        // If we only have 12, we can't fully prove the '50' cap in the JSON response size directly,
        // BUT we can inspect the Pageable object via the returned JSON metadata.
        
        mockMvc.perform(get("/api/public/categories/{id}/products", testCategory.getId())
                   .param("size", "1000"))
               .andExpect(status().isOk())
               // While content size will be 12 (total available), the 'size' metadata
               // property reflects the applied Pageable size limit!
               .andExpect(jsonPath("$.size", is(50))); 
               // OR depending on your exact Spring Data config it might be jsonPath("$.pageable.pageSize", is(50))
    }

    @Test
    void whenCategoryIsEmpty_thenReturnsEmptyPage() throws Exception {
        // Fetch ID of the empty category we created in setUpData()
        Long emptyCatId = categoryRepository.findByName("Empty Category").stream().findFirst().get().getId();

        mockMvc.perform(get("/api/public/categories/{id}/products", emptyCatId))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$.content", is(empty())))
               .andExpect(jsonPath("$.totalElements", is(0)));
    }

    @Test
    void whenCategoryDoesNotExist_thenReturns404NotFound() throws Exception {
        // Use a definitely non-existent ID
        Long fakeId = 999999L;

        mockMvc.perform(get("/api/public/categories/{id}/products", fakeId))
               .andExpect(status().isNotFound());
               // Note: If you have a GlobalExceptionHandler, you might also test for a specific JSON error structure here.
               // e.g. .andExpect(jsonPath("$.message", containsString("Category not found")));
    }
}
