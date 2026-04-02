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

  @Query("SELECT p FROM Product p WHERE p.id = :id AND (p.isDeleted = false OR p.isDeleted IS NULL)")
  java.util.Optional<Product> findByIdAndIsDeletedFalse(@Param("id") Long id);

  @Query("SELECT p FROM Product p WHERE p.isActive = true AND (p.isDeleted = false OR p.isDeleted IS NULL)")
  List<Product> findByIsActiveTrueAndIsDeletedFalse();

  @Query("SELECT p FROM Product p WHERE p.category.name = :categoryName AND p.isActive = true AND (p.isDeleted = false OR p.isDeleted IS NULL)")
  List<Product> findByCategoryNameAndIsActiveTrueAndIsDeletedFalse(@Param("categoryName") String categoryName);

  @Query("SELECT p FROM Product p WHERE p.category.name LIKE %:categoryName% AND p.isActive = true AND (p.isDeleted = false OR p.isDeleted IS NULL)")
  List<Product> findByCategoryNameContainingAndIsActiveTrueAndIsDeletedFalse(@Param("categoryName") String categoryName);

  @Query("SELECT p FROM Product p WHERE p.category.id = :categoryId AND p.isActive = true AND (p.isDeleted = false OR p.isDeleted IS NULL) ORDER BY p.name ASC")
  Page<Product> findByCategoryIdAndIsActiveTrueAndIsDeletedFalseOrderByNameAsc(@Param("categoryId") Long categoryId, Pageable pageable);

  @Query("SELECT CASE WHEN COUNT(p) > 0 THEN true ELSE false END FROM Product p WHERE p.name = :name AND (p.isDeleted = false OR p.isDeleted IS NULL)")
  boolean existsByNameAndIsDeletedFalse(@Param("name") String name);

  @Query("SELECT CASE WHEN COUNT(p) > 0 THEN true ELSE false END FROM Product p WHERE p.name = :name AND p.id <> :id AND (p.isDeleted = false OR p.isDeleted IS NULL)")
  boolean existsByNameAndIdNotAndIsDeletedFalse(@Param("name") String name, @Param("id") Long id);

  @Query("SELECT p FROM Product p WHERE (p.isDeleted = false OR p.isDeleted IS NULL) ORDER BY p.name ASC")
  Page<Product> findAllByIsDeletedFalseOrderByNameAsc(Pageable pageable);

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
        AND p.isDeleted = false
        AND a.budgetLevel = :budgetLevel
        AND (a.climateSuitability = :climate OR a.climateSuitability = 'ALL')
      ORDER BY a.durabilityRating DESC
      """)
  List<Product> findByRuleFilter(
      @Param("budgetLevel") BudgetLevel budgetLevel,
      @Param("climate") ClimateSuitability climate);
}
