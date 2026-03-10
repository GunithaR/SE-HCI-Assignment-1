package com.constructionplatform.app.repository;

import com.constructionplatform.app.entity.Product;
import com.constructionplatform.app.entity.ProductAttribute;
import com.constructionplatform.app.entity.ProductAttribute.Material;
import com.constructionplatform.app.entity.ProductAttribute.ProductSize;
import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public final class ProductSpecifications {

    private ProductSpecifications() {
    }

    public static Specification<Product> publicCatalogFilters(
            Long categoryId,
            Long brandId,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            ProductSize size,
            Material material) {
        return (root, query, cb) -> {
            // Avoid N+1 when mapping to DTOs; don't apply fetches to count query.
            if (query != null && !Long.class.equals(query.getResultType())
                    && !long.class.equals(query.getResultType())) {
                root.fetch("brand", JoinType.LEFT);
                root.fetch("category", JoinType.LEFT);
                root.fetch("attribute", JoinType.LEFT);
                query.distinct(true);
            }

            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.isTrue(root.get("isActive")));

            if (categoryId != null) {
                predicates.add(cb.equal(root.get("category").get("id"), categoryId));
            }
            if (brandId != null) {
                predicates.add(cb.equal(root.get("brand").get("id"), brandId));
            }
            if (minPrice != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("basePrice"), minPrice));
            }
            if (maxPrice != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("basePrice"), maxPrice));
            }

            if (size != null || material != null) {
                Join<Product, ProductAttribute> attr = root.join("attribute", JoinType.LEFT);
                if (size != null) {
                    predicates.add(cb.equal(attr.get("size"), size));
                }
                if (material != null) {
                    predicates.add(cb.equal(attr.get("material"), material));
                }
            }

            return cb.and(predicates.toArray(Predicate[]::new));
        };
    }
}
