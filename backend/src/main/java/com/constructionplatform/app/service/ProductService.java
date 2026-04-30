package com.constructionplatform.app.service;

import com.constructionplatform.app.dto.ProductCreateRequestDTO;
import com.constructionplatform.app.dto.ProductResponseDTO;
import com.constructionplatform.app.dto.ProductUpdateRequestDTO;
import com.constructionplatform.app.entity.ProductAttribute.Material;
import com.constructionplatform.app.entity.ProductAttribute.ProductSize;
import com.constructionplatform.app.entity.ProductAttribute.BudgetLevel;
import com.constructionplatform.app.entity.ProductAttribute.ClimateSuitability;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;

public interface ProductService {
    Page<ProductResponseDTO> findByCategoryId(Long categoryId, Pageable pageable);
    ProductResponseDTO findById(Long productId);
    List<ProductResponseDTO> recommendByBudgetAndClimate(BudgetLevel budgetLevel, ClimateSuitability climate);
    Page<ProductResponseDTO> findAllPublic(Pageable pageable, Long brandId, BigDecimal minPrice, BigDecimal maxPrice, ProductSize size, Material material);
    Page<ProductResponseDTO> findByCategoryIdPublic(Long categoryId, Pageable pageable, Long brandId, BigDecimal minPrice, BigDecimal maxPrice, ProductSize size, Material material);
    Page<ProductResponseDTO> findAll(Pageable pageable);
    ProductResponseDTO createProduct(ProductCreateRequestDTO request, List<MultipartFile> images);
    void deleteProduct(Long productId);
    ProductResponseDTO updateProduct(Long productId, ProductUpdateRequestDTO request, List<MultipartFile> images);
    ProductResponseDTO toggleStatus(Long productId, boolean inStock);
    String getCompactProductCatalog();
}
