package com.constructionplatform.app.service;

import com.constructionplatform.app.engine.ProductEvaluationResult;
import com.constructionplatform.app.engine.RuleMatchResult;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RankingService {

    public List<ProductEvaluationResult> rank(List<ProductEvaluationResult> evaluatedProducts) {

        return evaluatedProducts.stream()
                .filter(result -> !result.isExcluded())
                .sorted(
                        Comparator.comparing(ProductEvaluationResult::getProvisionalScore).reversed()
                                .thenComparing((r1, r2) -> {
                                    int priority1 = calculatePriorityImpact(r1);
                                    int priority2 = calculatePriorityImpact(r2);
                                    return Integer.compare(priority2, priority1); // Higher priority impact first
                                })
                                .thenComparing(r -> r.getProduct().getId()) // Deterministic ordering by ID ascending
                )
                .collect(Collectors.toList());
    }

    private int calculatePriorityImpact(ProductEvaluationResult result) {
        if (result.getMatchedRules() == null || result.getMatchedRules().isEmpty()) {
            return 0;
        }

        return result.getMatchedRules().stream()
                .filter(rule -> rule.getPriority() != null)
                .mapToInt(RuleMatchResult::getPriority)
                .sum();
    }
}
