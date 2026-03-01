package com.constructionplatform.app.controller;

import com.constructionplatform.app.dto.AdminUserCreateRequestDTO;
import com.constructionplatform.app.dto.AuthResponse;
import com.constructionplatform.app.dto.BrandCreateRequestDTO;
import com.constructionplatform.app.dto.BrandDTO;
import com.constructionplatform.app.dto.ProductCreateRequestDTO;
import com.constructionplatform.app.dto.ProductResponseDTO;
import com.constructionplatform.app.dto.ProductUpdateRequestDTO;
import com.constructionplatform.app.service.AdminUserService;
import com.constructionplatform.app.service.BrandService;
import com.constructionplatform.app.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    public AdminController(ProductService productService,
            AdminUserService adminUserService,
            BrandService brandService) {
        this.productService = productService;
        this.adminUserService = adminUserService;
        this.brandService = brandService;
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

    /** POST /api/admin/products — create a new product with attributes */
    @PostMapping("/products")
    public ResponseEntity<ProductResponseDTO> createProduct(
            @Valid @RequestBody ProductCreateRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(productService.createProduct(request));
    }

    /**
     * PUT /api/admin/products/{id} — fully replace all fields of an existing
     * product.
     * This includes the isActive (In Stock / Out of Stock) flag.
     */
    @PutMapping("/products/{id}")
    public ResponseEntity<ProductResponseDTO> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductUpdateRequestDTO request) {
        return ResponseEntity.ok(productService.updateProduct(id, request));
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

    // ── Admin user management ─────────────────────────────────────────────────

    /** POST /api/admin/users — create a new ADMIN account */
    @PostMapping("/users")
    public ResponseEntity<AuthResponse> createAdminUser(
            @Valid @RequestBody AdminUserCreateRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(adminUserService.createAdminUser(request));
    }
}
