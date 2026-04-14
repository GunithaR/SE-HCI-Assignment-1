package com.constructionplatform.app.service;

import com.constructionplatform.app.dto.ProductCreateRequestDTO;
import com.constructionplatform.app.dto.ProductResponseDTO;
import com.constructionplatform.app.dto.ProductUpdateRequestDTO;
import com.constructionplatform.app.entity.Brand;
import com.constructionplatform.app.entity.Category;
import com.constructionplatform.app.entity.Product;
import com.constructionplatform.app.entity.ProductAttribute;
import com.constructionplatform.app.entity.ProductAttribute.Material;
import com.constructionplatform.app.entity.ProductAttribute.ProductSize;
import com.constructionplatform.app.entity.ProductAttribute.BudgetLevel;
import com.constructionplatform.app.entity.ProductAttribute.ClimateSuitability;
import com.constructionplatform.app.exception.ResourceNotFoundException;
import com.constructionplatform.app.repository.BrandRepository;
import com.constructionplatform.app.repository.CategoryRepository;
import com.constructionplatform.app.repository.ProductRepository;
import com.constructionplatform.app.repository.ProductSpecifications;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

/**
 * Use-case layer for Product operations.
 *
 * <p>
 * Handles paginated catalog browsing, single-product detail fetching,
 * and admin product creation with attribute validation.
 */
@Service
@Transactional(readOnly = true)
public class ProductService {

        private static final Logger log = LoggerFactory.getLogger(ProductService.class);

        private final ProductRepository productRepository;
        private final CategoryRepository categoryRepository;
        private final BrandRepository brandRepository;
        private final FileStorageService fileStorageService;

        public ProductService(ProductRepository productRepository,
                        CategoryRepository categoryRepository,
                        BrandRepository brandRepository,
                        FileStorageService fileStorageService) {
                this.productRepository = productRepository;
                this.categoryRepository = categoryRepository;
                this.brandRepository = brandRepository;
                this.fileStorageService = fileStorageService;
        }

        // ── Public use cases ──────────────────────────────────────────────────────

        /**
         * Returns a paginated page of active products for the given category.
         *
         * @param categoryId ID of the parent category
         * @param pageable   Spring Data pageable (page, size, sort)
         * @return page of {@link ProductResponseDTO}
         * @throws ResourceNotFoundException if categoryId does not map to any category
         */
        public Page<ProductResponseDTO> findByCategoryId(Long categoryId, Pageable pageable) {
                // Validate category exists before querying products
                if (!categoryRepository.existsById(categoryId)) {
                        throw new ResourceNotFoundException("Category", categoryId);
                }
                Page<Product> page = productRepository
                                .findByCategoryIdAndIsActiveTrueOrderByNameAsc(categoryId, pageable);
                return page.map(ProductResponseDTO::from);
        }

        /**
         * Returns the full detail of a single product including its attributes.
         *
         * @param productId ID of the product
         * @return {@link ProductResponseDTO} with all aggregated data
         * @throws ResourceNotFoundException if productId does not exist
         */
        public ProductResponseDTO findById(Long productId) {
                Product product = productRepository.findById(productId)
                                .orElseThrow(() -> new ResourceNotFoundException("Product", productId));
                return ProductResponseDTO.from(product);
        }

        /**
         * Recommendation use case — returns a list of best-matching products
         * for the given budget and climate, ordered by durability.
         */
        public java.util.List<ProductResponseDTO> recommendByBudgetAndClimate(
                        BudgetLevel budgetLevel,
                        ClimateSuitability climate) {
                java.util.List<Product> products = productRepository.findByRuleFilter(budgetLevel, climate);
                return products.stream().map(ProductResponseDTO::from).toList();
        }

        /**
         * Public catalog search (active products only) with optional filters.
         */
        public Page<ProductResponseDTO> findAllPublic(
                        Pageable pageable,
                        Long brandId,
                        java.math.BigDecimal minPrice,
                        java.math.BigDecimal maxPrice,
                        ProductSize size,
                        Material material) {
                validatePriceRange(minPrice, maxPrice);
                return productRepository
                                .findAll(ProductSpecifications.publicCatalogFilters(
                                                null, brandId, minPrice, maxPrice, size, material),
                                                pageable)
                                .map(ProductResponseDTO::from);
        }

        /**
         * Public catalog search within a category (active only) with optional filters.
         */
        public Page<ProductResponseDTO> findByCategoryIdPublic(
                        Long categoryId,
                        Pageable pageable,
                        Long brandId,
                        java.math.BigDecimal minPrice,
                        java.math.BigDecimal maxPrice,
                        ProductSize size,
                        Material material) {
                validatePriceRange(minPrice, maxPrice);
                if (!categoryRepository.existsById(categoryId)) {
                        throw new ResourceNotFoundException("Category", categoryId);
                }
                return productRepository
                                .findAll(ProductSpecifications.publicCatalogFilters(
                                                categoryId, brandId, minPrice, maxPrice, size, material),
                                                pageable)
                                .map(ProductResponseDTO::from);
        }

        /**
         * Validates the numeric price range filters. Throws {@link IllegalArgumentException}
         * with a user-friendly message that is mapped to a 409 CONFLICT by
         * {@link com.constructionplatform.app.exception.GlobalExceptionHandler}.
         */
        private void validatePriceRange(java.math.BigDecimal minPrice, java.math.BigDecimal maxPrice) {
                if (minPrice != null && minPrice.compareTo(java.math.BigDecimal.ZERO) < 0) {
                        throw new IllegalArgumentException("Minimum price cannot be negative.");
                }
                if (maxPrice != null && maxPrice.compareTo(java.math.BigDecimal.ZERO) < 0) {
                        throw new IllegalArgumentException("Maximum price cannot be negative.");
                }
                if (minPrice != null && maxPrice != null && minPrice.compareTo(maxPrice) > 0) {
                        throw new IllegalArgumentException("Minimum price cannot be greater than maximum price.");
                }
        }

        // ── Admin use cases ───────────────────────────────────────────────────────

        /**
         * Returns ALL products across every category (paginated) — admin overview.
         * Unlike the public endpoint, this is not filtered by category.
         *
         * @param pageable pagination params
         * @return page of {@link ProductResponseDTO}
         */
        public Page<ProductResponseDTO> findAll(Pageable pageable) {
                return productRepository.findAllByOrderByNameAsc(pageable).map(ProductResponseDTO::from);
        }

        /**
         * Creates a new product and its associated attributes.
         *
         * <p>
         * Business rules enforced here (beyond Jakarta Validation):
         * <ul>
         * <li>Product name must be unique.</li>
         * <li>Category and Brand must exist.</li>
         * <li>Durability rating must be LOW, MEDIUM, or HIGH.</li>
         * </ul>
         *
         * @param request validated DTO from the controller
         * @return persisted product as a {@link ProductResponseDTO}
         */
        @Transactional
        public ProductResponseDTO createProduct(ProductCreateRequestDTO request, MultipartFile image) {
                // Guard: duplicate name check
                if (productRepository.existsByName(request.getName())) {
                        throw new IllegalArgumentException(
                                        "A product with name '" + request.getName() + "' already exists.");
                }

                // Resolve category and brand — throw 404 if either is missing
                Category category = categoryRepository.findById(request.getCategoryId())
                                .orElseThrow(() -> new ResourceNotFoundException("Category", request.getCategoryId()));
                Brand brand = brandRepository.findById(request.getBrandId())
                                .orElseThrow(() -> new ResourceNotFoundException("Brand", request.getBrandId()));

                // Build product entity
                Product product = Product.builder()
                                .category(category)
                                .brand(brand)
                                .name(request.getName())
                                .description(request.getDescription())
                                .basePrice(request.getBasePrice())
                                .isActive(true)
                                .build();

                // Build and link the attribute (shared PK via @MapsId)
                ProductAttribute attribute = ProductAttribute.builder()
                                .product(product)
                                .budgetLevel(request.getBudgetLevel())
                                .durabilityRating(request.getDurabilityRating())
                                .climateSuitability(request.getClimateSuitability())
                                .maintenanceLevel(request.getMaintenanceLevel())
                                .style(request.getStyle())
                                .size(request.getSize())
                                .material(request.getMaterial())
                                .build();

                product.setAttribute(attribute);

                // Persist first so we have the ID, then store image if provided
                Product saved = productRepository.save(product);

                if (image != null && !image.isEmpty()) {
                        String imageUrl = fileStorageService.store(image);
                        saved.setImageUrl(imageUrl);
                        saved = productRepository.save(saved);
                }

                log.info("ProductService: Created product id=[{}] name=[{}]", saved.getId(), saved.getName());
                return ProductResponseDTO.from(saved);
        }

        /**
         * Permanently deletes a product and its cascaded attributes.
         * The {@code cascade = ALL} on the {@code @OneToOne} attribute relation
         * ensures the {@code product_attributes} row is removed automatically.
         *
         * @param productId ID of the product to delete
         * @throws ResourceNotFoundException if the ID does not exist
         */
        @Transactional
        public void deleteProduct(Long productId) {
                Product product = productRepository.findById(productId)
                                .orElseThrow(() -> new ResourceNotFoundException("Product", productId));

                ensureNoCriticalDependencies(product);

                productRepository.delete(product);
                log.info("ProductService: Deleted product id=[{}] name=[{}]", productId, product.getName());
        }

        /**
         * Fully replaces all mutable fields of a product (PUT semantics).
         * Name uniqueness is enforced while excluding the product itself.
         * If a new image is provided it replaces the old one (old file is deleted).
         * If no image is provided the existing imageUrl is preserved.
         */
        @Transactional
        public ProductResponseDTO updateProduct(Long productId, ProductUpdateRequestDTO request, MultipartFile image) {
                Product product = productRepository.findById(productId)
                                .orElseThrow(() -> new ResourceNotFoundException("Product", productId));

                if (productRepository.existsByNameAndIdNot(request.getName(), productId)) {
                        throw new IllegalArgumentException(
                                        "Another product with name '" + request.getName() + "' already exists.");
                }

                Category category = categoryRepository.findById(request.getCategoryId())
                                .orElseThrow(() -> new ResourceNotFoundException("Category", request.getCategoryId()));
                Brand brand = brandRepository.findById(request.getBrandId())
                                .orElseThrow(() -> new ResourceNotFoundException("Brand", request.getBrandId()));

                product.setName(request.getName());
                product.setDescription(request.getDescription());
                product.setBasePrice(request.getBasePrice());
                product.setCategory(category);
                product.setBrand(brand);
                if (request.getIsActive() != null) {
                        product.setIsActive(request.getIsActive());
                }

                ProductAttribute attr = product.getAttribute();
                if (attr == null) {
                        attr = ProductAttribute.builder().product(product).build();
                        product.setAttribute(attr);
                }
                attr.setBudgetLevel(request.getBudgetLevel());
                attr.setDurabilityRating(request.getDurabilityRating());
                attr.setClimateSuitability(request.getClimateSuitability());
                attr.setMaintenanceLevel(request.getMaintenanceLevel());
                attr.setStyle(request.getStyle());
                attr.setSize(request.getSize());
                attr.setMaterial(request.getMaterial());

                // Replace image only if a new one was uploaded
                if (image != null && !image.isEmpty()) {
                        fileStorageService.delete(product.getImageUrl()); // delete old file, if any
                        product.setImageUrl(fileStorageService.store(image));
                }

                Product saved = productRepository.save(product);
                log.info("ProductService: Updated product id=[{}] name=[{}]", saved.getId(), saved.getName());
                return ProductResponseDTO.from(saved);
        }

        /**
         * Toggles the In Stock / Out of Stock status of a product.
         * true = In Stock (isActive=true), false = Out of Stock (isActive=false).
         */
        @Transactional
        public ProductResponseDTO toggleStatus(Long productId, boolean inStock) {
                Product product = productRepository.findById(productId)
                                .orElseThrow(() -> new ResourceNotFoundException("Product", productId));
                product.setIsActive(inStock);
                Product saved = productRepository.save(product);
                log.info("ProductService: Product id=[{}] set to {}", productId,
                                inStock ? "IN STOCK" : "OUT OF STOCK");
                return ProductResponseDTO.from(saved);
        }

        /**
         * Guard hook for future domain rules around product deletion.
         *
         * <p>In the current version of the platform, products are not referenced by
         * persistent recommendation or order entities, so physical deletion is safe:
         * the recommendation engine always queries the live {@code products} table
         * and will simply stop seeing the removed product.</p>
         *
         * <p>If you later introduce critical aggregates (e.g. Orders, SavedProjects),
         * checks should be added here and throw {@link IllegalArgumentException} with
         * a clear message, which {@link com.constructionplatform.app.exception.GlobalExceptionHandler}
         * will surface as a 409 CONFLICT to the admin UI.</p>
         */
        private void ensureNoCriticalDependencies(Product product) {
                // Example for future extension:
                // if (orderRepository.existsByProductId(product.getId())) {
                //     throw new IllegalArgumentException(
                //         "Cannot delete this product because it is referenced by existing orders.");
                // }
        }
}
