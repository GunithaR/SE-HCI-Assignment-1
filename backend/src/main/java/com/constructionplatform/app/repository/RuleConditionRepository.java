package com.constructionplatform.app.repository;

import com.constructionplatform.app.entity.RuleCondition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RuleConditionRepository extends JpaRepository<RuleCondition, Long> {
}
