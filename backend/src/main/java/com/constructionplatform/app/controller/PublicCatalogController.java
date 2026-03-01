package com.constructionplatform.app.controller;

import com.constructionplatform.app.dto.BrandDTO;
import com.constructionplatform.app.dto.CategoryDTO;
import com.constructionplatform.app.dto.ProductResponseDTO;
import com.constructionplatform.app.entity.ProductAttribute.BudgetLevel;
import com.constructionplatform.app.entity.ProductAttribute.ClimateSuitability;
import com.constructionplatform.app.entity.ProductAttribute.MaintenanceLevel;
import com.constructionplatform.app.service.BrandService;
import com.constructionplatform.app.service.CategoryService;
import com.constructionplatform.app.service.ProductService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Public catalog endpoints — no JWT required.
 * Route prefix: {@code /api/public}
 */
@RestController
@RequestMapping("/api/public")
public class PublicCatalogController {

    private final CategoryService categoryService;
    private final ProductService productService;
    private final BrandService brandService;

    public PublicCatalogController(CategoryService categoryService,
            ProductService productService,
            BrandService brandService) {
        this.categoryService = categoryService;
        this.productService = productService;
        this.brandService = brandService;
    }

    // ── Categories ────────────────────────────────────────────────────────────

    /** GET /api/public/categories */
    @GetMapping("/categories")
    public ResponseEntity<List<CategoryDTO>> getCategories() {
        return ResponseEntity.ok(categoryService.findAll());
    }

    // ── Brands ────────────────────────────────────────────────────────────────

    /**
     * Returns all brands — used by the frontend brand dropdown in Add Product.
     * GET /api/public/brands
     */
    @GetMapping("/brands")
    public ResponseEntity<List<BrandDTO>> getBrands() {
        return ResponseEntity.ok(brandService.findAll());
    }

    /**
     * Returns all products across every category (active only) — used by the public
     * home page.
     * GET /api/public/products?page=0&size=24
     */
    @GetMapping("/products")
    public ResponseEntity<Page<ProductResponseDTO>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "24") int size) {
        Pageable pageable = PageRequest.of(page, Math.min(size, 100));
        return ResponseEntity.ok(productService.findAll(pageable));
    }

    // ── Products ──────────────────────────────────────────────────────────────

    /** GET /api/public/categories/{categoryId}/products?page=0&size=10 */
    @GetMapping("/categories/{categoryId}/products")
    public ResponseEntity<Page<ProductResponseDTO>> getProductsByCategory(
            @PathVariable Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, Math.min(size, 50));
        return ResponseEntity.ok(productService.findByCategoryId(categoryId, pageable));
    }

    /** GET /api/public/products/{productId} */
    @GetMapping("/products/{productId}")
    public ResponseEntity<ProductResponseDTO> getProductById(@PathVariable Long productId) {
        return ResponseEntity.ok(productService.findById(productId));
    }

    // ── Attribute enum options ────────────────────────────────────────────────

    /** GET /api/public/attributes/options */
    @GetMapping("/attributes/options")
    public ResponseEntity<Map<String, List<String>>> getAttributeOptions() {
        Map<String, List<String>> options = Map.of(
                "budgetLevels", enumNames(BudgetLevel.values()),
                "climateSuitabilities", enumNames(ClimateSuitability.values()),
                "maintenanceLevels", enumNames(MaintenanceLevel.values()),
                "durabilityRange", List.of("1", "2", "3", "4", "5", "6", "7", "8", "9", "10"));
        return ResponseEntity.ok(options);
    }

    private List<String> enumNames(Enum<?>[] values) {
        return Arrays.stream(values).map(Enum::name).collect(Collectors.toList());
    }
}
