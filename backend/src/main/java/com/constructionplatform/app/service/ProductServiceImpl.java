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

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class ProductServiceImpl implements ProductService {

    private static final Logger log = LoggerFactory.getLogger(ProductServiceImpl.class);

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;
    private final FileStorageService fileStorageService;

    public ProductServiceImpl(ProductRepository productRepository,
                              CategoryRepository categoryRepository,
                              BrandRepository brandRepository,
                              FileStorageService fileStorageService) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.brandRepository = brandRepository;
        this.fileStorageService = fileStorageService;
    }

    @Override
    public Page<ProductResponseDTO> findByCategoryId(Long categoryId, Pageable pageable) {
        if (!categoryRepository.existsById(categoryId)) {
            throw new ResourceNotFoundException("Category", categoryId);
        }
        Page<Product> page = productRepository
                .findByCategoryIdAndIsActiveTrueOrderByNameAsc(categoryId, pageable);
        return page.map(ProductResponseDTO::from);
    }

    @Override
    public ProductResponseDTO findById(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", productId));
        return ProductResponseDTO.from(product);
    }

    @Override
    public List<ProductResponseDTO> recommendByBudgetAndClimate(BudgetLevel budgetLevel, ClimateSuitability climate) {
        List<Product> products = productRepository.findByRuleFilter(budgetLevel, climate);
        return products.stream().map(ProductResponseDTO::from).toList();
    }

    @Override
    public Page<ProductResponseDTO> findAllPublic(Pageable pageable, Long brandId, BigDecimal minPrice, BigDecimal maxPrice, ProductSize size, Material material) {
        validatePriceRange(minPrice, maxPrice);
        return productRepository
                .findAll(ProductSpecifications.publicCatalogFilters(
                        null, brandId, minPrice, maxPrice, size, material),
                        pageable)
                .map(ProductResponseDTO::from);
    }

    @Override
    public Page<ProductResponseDTO> findByCategoryIdPublic(Long categoryId, Pageable pageable, Long brandId, BigDecimal minPrice, BigDecimal maxPrice, ProductSize size, Material material) {
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

    @Override
    public Page<ProductResponseDTO> findAll(Pageable pageable) {
        return productRepository.findAllByOrderByNameAsc(pageable).map(ProductResponseDTO::from);
    }

    @Override
    @Transactional
    public ProductResponseDTO createProduct(ProductCreateRequestDTO request, List<MultipartFile> images) {
        if (productRepository.existsByName(request.getName())) {
            throw new IllegalArgumentException(
                    "A product with name '" + request.getName() + "' already exists.");
        }

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", request.getCategoryId()));
        Brand brand = brandRepository.findById(request.getBrandId())
                .orElseThrow(() -> new ResourceNotFoundException("Brand", request.getBrandId()));

        Product product = Product.builder()
                .category(category)
                .brand(brand)
                .name(request.getName())
                .description(request.getDescription())
                .basePrice(request.getBasePrice())
                .isActive(true)
                .build();

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

        Product saved = productRepository.save(product);

        if (images != null && !images.isEmpty()) {
            List<String> storedUrls = new ArrayList<>();
            for (MultipartFile imgFile : images) {
                if (!imgFile.isEmpty()) {
                    String imageUrl = fileStorageService.store(imgFile);
                    storedUrls.add(imageUrl);
                    com.constructionplatform.app.entity.ProductImage img = new com.constructionplatform.app.entity.ProductImage(saved, imageUrl);
                    saved.getImages().add(img);
                }
            }
            
            if (request.getMainImageIndex() != null && request.getMainImageIndex() >= 0 && request.getMainImageIndex() < storedUrls.size()) {
                saved.setImageUrl(storedUrls.get(request.getMainImageIndex()));
            } else if (!storedUrls.isEmpty()) {
                saved.setImageUrl(storedUrls.get(0));
            }
            
            saved = productRepository.save(saved);
        }

        log.info("ProductService: Created product id=[{}] name=[{}]", saved.getId(), saved.getName());
        return ProductResponseDTO.from(saved);
    }

    @Override
    @Transactional
    public void deleteProduct(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", productId));

        ensureNoCriticalDependencies(product);

        productRepository.delete(product);
        log.info("ProductService: Deleted product id=[{}] name=[{}]", productId, product.getName());
    }

    @Override
    @Transactional
    public ProductResponseDTO updateProduct(Long productId, ProductUpdateRequestDTO request, List<MultipartFile> images) {
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

        if (images != null && !images.isEmpty() && images.stream().anyMatch(img -> !img.isEmpty())) {
            if (product.getImageUrl() != null && !product.getImageUrl().trim().isEmpty()) {
                fileStorageService.delete(product.getImageUrl());
                product.setImageUrl(null);
            }
            for (com.constructionplatform.app.entity.ProductImage oldImg : product.getImages()) {
                fileStorageService.delete(oldImg.getImageUrl());
            }
            product.getImages().clear();
            
            List<String> storedUrls = new ArrayList<>();
            for (MultipartFile imgFile : images) {
                if (!imgFile.isEmpty()) {
                    String imageUrl = fileStorageService.store(imgFile);
                    storedUrls.add(imageUrl);
                    com.constructionplatform.app.entity.ProductImage img = new com.constructionplatform.app.entity.ProductImage(product, imageUrl);
                    product.getImages().add(img);
                }
            }

            if (request.getMainImageIndex() != null && request.getMainImageIndex() >= 0 && request.getMainImageIndex() < storedUrls.size()) {
                product.setImageUrl(storedUrls.get(request.getMainImageIndex()));
            } else if (!storedUrls.isEmpty()) {
                product.setImageUrl(storedUrls.get(0));
            }
        } else if (request.getMainImageIndex() != null && product.getImages() != null && !product.getImages().isEmpty()) {
            if (request.getMainImageIndex() >= 0 && request.getMainImageIndex() < product.getImages().size()) {
                product.setImageUrl(product.getImages().get(request.getMainImageIndex()).getImageUrl());
            }
        }

        Product saved = productRepository.save(product);
        log.info("ProductService: Updated product id=[{}] name=[{}]", saved.getId(), saved.getName());
        return ProductResponseDTO.from(saved);
    }

    @Override
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

    @Override
    public String getCompactProductCatalog() {
        List<Product> products = productRepository.findAll();
        StringBuilder sb = new StringBuilder();
        sb.append("--- AVAILABLE PLATFORM PRODUCTS ---\n");
        for (Product p : products) {
            if (p.getIsActive() != null && p.getIsActive()) {
                sb.append(String.format("- %s | Brand: %s | Category: %s | Price: Rs.%.2f",
                        p.getName(),
                        p.getBrand() != null ? p.getBrand().getName() : "Unknown",
                        p.getCategory() != null ? p.getCategory().getName() : "Unknown",
                        p.getBasePrice()));
                if (p.getAttribute() != null) {
                    sb.append(String.format(" | Budget: %s, Climate: %s, Durability: %s, Material: %s",
                            p.getAttribute().getBudgetLevel() != null ? p.getAttribute().getBudgetLevel() : "ANY",
                            p.getAttribute().getClimateSuitability() != null ? p.getAttribute().getClimateSuitability() : "ANY",
                            p.getAttribute().getDurabilityRating() != null ? p.getAttribute().getDurabilityRating() : "ANY",
                            p.getAttribute().getMaterial() != null ? p.getAttribute().getMaterial() : "ANY"));
                }
                sb.append("\n");
            }
        }
        return sb.toString();
    }

    private void validatePriceRange(BigDecimal minPrice, BigDecimal maxPrice) {
        if (minPrice != null && minPrice.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Minimum price cannot be negative.");
        }
        if (maxPrice != null && maxPrice.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Maximum price cannot be negative.");
        }
        if (minPrice != null && maxPrice != null && minPrice.compareTo(maxPrice) > 0) {
            throw new IllegalArgumentException("Minimum price cannot be greater than maximum price.");
        }
    }

    private void ensureNoCriticalDependencies(Product product) {
        // Example for future extension
    }
}
