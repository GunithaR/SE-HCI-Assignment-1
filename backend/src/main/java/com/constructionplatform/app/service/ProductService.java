package com.constructionplatform.app.service;

import com.constructionplatform.app.dto.ProductCreateRequestDTO;
import com.constructionplatform.app.dto.ProductResponseDTO;
import com.constructionplatform.app.dto.ProductUpdateRequestDTO;
import com.constructionplatform.app.entity.Brand;
import com.constructionplatform.app.entity.Category;
import com.constructionplatform.app.entity.Product;
import com.constructionplatform.app.entity.ProductAttribute;
import com.constructionplatform.app.exception.ResourceNotFoundException;
import com.constructionplatform.app.repository.BrandRepository;
import com.constructionplatform.app.repository.CategoryRepository;
import com.constructionplatform.app.repository.ProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

        public ProductService(ProductRepository productRepository,
                        CategoryRepository categoryRepository,
                        BrandRepository brandRepository) {
                this.productRepository = productRepository;
                this.categoryRepository = categoryRepository;
                this.brandRepository = brandRepository;
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
         * <li>Durability rating must be 1–10 (also covered by DTO @Min/@Max).</li>
         * </ul>
         *
         * @param request validated DTO from the controller
         * @return persisted product as a {@link ProductResponseDTO}
         */
        @Transactional
        public ProductResponseDTO createProduct(ProductCreateRequestDTO request) {
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
                                .build();

                product.setAttribute(attribute);

                Product saved = productRepository.save(product);
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
                if (!productRepository.existsById(productId)) {
                        throw new ResourceNotFoundException("Product", productId);
                }
                productRepository.deleteById(productId);
                log.info("ProductService: Deleted product id=[{}]", productId);
        }

        /**
         * Fully replaces all mutable fields of a product (PUT semantics).
         * Name uniqueness is enforced while excluding the product itself.
         */
        @Transactional
        public ProductResponseDTO updateProduct(Long productId, ProductUpdateRequestDTO request) {
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
}
