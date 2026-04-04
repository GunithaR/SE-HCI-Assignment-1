package com.constructionplatform.app.repository;

import com.constructionplatform.app.entity.Product;
import com.constructionplatform.app.entity.ProductAttribute.BudgetLevel;
import com.constructionplatform.app.entity.ProductAttribute.ClimateSuitability;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {

  List<Product> findByIsActiveTrue();

  List<Product> findByCategoryNameAndIsActiveTrue(String categoryName);

  List<Product> findByCategoryNameContainingAndIsActiveTrue(String categoryName);


  /** Paginated listing of active products belonging to a specific category. */
  Page<Product> findByCategoryIdAndIsActiveTrueOrderByNameAsc(Long categoryId, Pageable pageable);

  boolean existsByName(String name);

  /**
   * Used during product update to check name uniqueness while excluding the
   * product being edited.
   */
  boolean existsByNameAndIdNot(String name, Long id);

  /**
   * All products across every category — used by the admin dashboard overview.
   */
  Page<Product> findAllByOrderByNameAsc(Pageable pageable);

  /**
   * Rule-based filtering query used by the recommendation engine.
   * Fetches only active products that match both the requested budget level
   * and an exact climate match OR the universal "ALL" value.
   */
  @Query("""
      SELECT p FROM Product p
      JOIN FETCH p.attribute a
      JOIN FETCH p.brand b
      JOIN FETCH p.category c
      WHERE p.isActive = true
        AND a.budgetLevel = :budgetLevel
        AND (a.climateSuitability = :climate OR a.climateSuitability = 'ALL')
      ORDER BY a.durabilityRating DESC
      """)
  List<Product> findByRuleFilter(
      @Param("budgetLevel") BudgetLevel budgetLevel,
      @Param("climate") ClimateSuitability climate);

  /**
   * Fetch multiple products by their IDs for comparison.
   * Returns only active products.
   */
  @Query("""
      SELECT DISTINCT p FROM Product p
      LEFT JOIN FETCH p.attribute
      LEFT JOIN FETCH p.brand
      LEFT JOIN FETCH p.category
      WHERE p.id IN :ids AND p.isActive = true
      """)
  List<Product> findByIdInAndIsActiveTrue(@Param("ids") List<Long> ids);
}
