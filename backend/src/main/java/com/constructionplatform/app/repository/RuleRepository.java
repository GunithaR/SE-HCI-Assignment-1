package com.constructionplatform.app.repository;

import com.constructionplatform.app.entity.Rule;
import com.constructionplatform.app.enums.RuleStatus;
import com.constructionplatform.app.enums.RuleType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RuleRepository extends JpaRepository<Rule, Long> {

    List<Rule> findByRuleStatus(RuleStatus status);

    List<Rule> findByRuleType(RuleType ruleType);

    List<Rule> findByRuleStatusAndRuleType(RuleStatus status, RuleType ruleType);

    @Query("SELECT r FROM Rule r LEFT JOIN FETCH r.mappings LEFT JOIN FETCH r.productTargets WHERE r.id = :id")
    Rule findByIdWithDetails(Long id);

    boolean existsByName(String name);
}
