package com.constructionplatform.app.controller;

import com.constructionplatform.app.dto.AdminUserCreateRequestDTO;
import com.constructionplatform.app.dto.AuthResponse;
import com.constructionplatform.app.dto.BrandCreateRequestDTO;
import com.constructionplatform.app.dto.BrandDTO;
import com.constructionplatform.app.dto.ProductCreateRequestDTO;
import com.constructionplatform.app.dto.ProductResponseDTO;
import com.constructionplatform.app.dto.ProductUpdateRequestDTO;
import com.constructionplatform.app.entity.RecommendationHistory;
import com.constructionplatform.app.repository.RecommendationHistoryRepository;
import com.constructionplatform.app.service.AdminUserService;
import com.constructionplatform.app.service.BrandService;
import com.constructionplatform.app.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

/**
 * Admin-only endpoints — requires a valid JWT with the ADMIN role.
 * Route prefix: {@code /api/admin}
 */
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final ProductService productService;
    private final AdminUserService adminUserService;
    private final BrandService brandService;
    private final RecommendationHistoryRepository recommendationHistoryRepository;

    public AdminController(ProductService productService,
            AdminUserService adminUserService,
            BrandService brandService,
            RecommendationHistoryRepository recommendationHistoryRepository) {
        this.productService = productService;
        this.adminUserService = adminUserService;
        this.brandService = brandService;
        this.recommendationHistoryRepository = recommendationHistoryRepository;
    }

    // ── Product management ────────────────────────────────────────────────────

    /**
     * GET /api/admin/products?page=0&size=100 — all products across every category
     */
    @GetMapping("/products")
    public ResponseEntity<Page<ProductResponseDTO>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "100") int size) {
        Pageable pageable = PageRequest.of(page, Math.min(size, 200));
        return ResponseEntity.ok(productService.findAll(pageable));
    }

    /** POST /api/admin/products — create a new product with optional images */
    @PostMapping(value = "/products", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProductResponseDTO> createProduct(
            @RequestPart("data") @Valid ProductCreateRequestDTO request,
            @RequestPart(value = "images", required = false) java.util.List<MultipartFile> images) {
        return ResponseEntity.status(HttpStatus.CREATED).body(productService.createProduct(request, images));
    }

    /**
     * PUT /api/admin/products/{id} — fully replace all fields of an existing product.
     * Optionally supply new images to replace the old ones.
     */
    @PutMapping(value = "/products/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProductResponseDTO> updateProduct(
            @PathVariable Long id,
            @RequestPart("data") @Valid ProductUpdateRequestDTO request,
            @RequestPart(value = "images", required = false) java.util.List<MultipartFile> images) {
        return ResponseEntity.ok(productService.updateProduct(id, request, images));
    }

    /**
     * PATCH /api/admin/products/{id}/status?inStock=true|false
     * Quick toggle for In Stock / Out of Stock without editing other fields.
     */
    @PatchMapping("/products/{id}/status")
    public ResponseEntity<ProductResponseDTO> toggleStatus(
            @PathVariable Long id,
            @RequestParam boolean inStock) {
        return ResponseEntity.ok(productService.toggleStatus(id, inStock));
    }

    /** DELETE /api/admin/products/{id} — permanently remove a product */
    @DeleteMapping("/products/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    // ── Brand management ──────────────────────────────────────────────────────

    /** POST /api/admin/brands — create a new brand */
    @PostMapping("/brands")
    public ResponseEntity<BrandDTO> createBrand(
            @Valid @RequestBody BrandCreateRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(brandService.createBrand(request));
    }

    // ── Sub-Admin user management ──────────────────────────────────────────────

    /**
     * POST /api/admin/sub-admins — create a new SUB_ADMIN account.
     * Restricted to ADMIN only — sub-admins cannot promote other users.
     */
    @PostMapping("/sub-admins")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AuthResponse> createSubAdminUser(
            @Valid @RequestBody AdminUserCreateRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(adminUserService.createSubAdminUser(request));
    }

    // ── User listing ───────────────────────────────────────────────────────────

    /** GET /api/admin/users — list all registered users (ADMIN only) */
    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<java.util.List<com.constructionplatform.app.dto.UserSummaryDTO>> getAllUsers() {
        return ResponseEntity.ok(adminUserService.getAllUsers());
    }

    // ── Recommendation History management ──────────────────────────────────────

    /** GET /api/admin/recommendation-history — fetch all logged recommendation sessions */
    @GetMapping("/recommendation-history")
    public ResponseEntity<java.util.List<RecommendationHistory>> getRecommendationHistory() {
        return ResponseEntity.ok(recommendationHistoryRepository.findAllByOrderByStartedAtDesc());
    }
}
