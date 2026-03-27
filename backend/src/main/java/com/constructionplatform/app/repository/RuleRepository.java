package com.constructionplatform.app.repository;

import com.constructionplatform.app.entity.Rule;
import com.constructionplatform.app.enums.RuleStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RuleRepository extends JpaRepository<Rule, Long> {

    List<Rule> findByRuleStatus(RuleStatus status);

    List<Rule> findByRuleStatusOrderByPriorityDesc(RuleStatus status);
}
