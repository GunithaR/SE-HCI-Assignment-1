package com.constructionplatform.app.service;

import com.constructionplatform.app.engine.EvaluationResult;
import com.constructionplatform.app.engine.ProductEvaluationResult;
import com.constructionplatform.app.engine.RuleMatchResult;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ScoringService {

    public void score(EvaluationResult evaluationResult) {
        if (evaluationResult == null || evaluationResult.getProductResults() == null) {
            return;
        }

        List<ProductEvaluationResult> results = evaluationResult.getProductResults();

        for (ProductEvaluationResult result : results) {
            // Hard constraint excluded products do not get scored
            if (result.isExcluded()) {
                result.setProvisionalScore(0);
                continue;
            }

            int score = 0;

            for (RuleMatchResult matchedRule : result.getMatchedRules()) {
                if (!matchedRule.isHardConstraint()) {
                    // Soft preference rules add their weight to the final score
                    Integer weight = matchedRule.getWeight();
                    if (weight != null) {
                        score += weight;
                    }
                }
            }

            result.setProvisionalScore(score);
        }
    }
}
