package com.constructionplatform.app.engine;

import com.constructionplatform.app.entity.Product;
import com.constructionplatform.app.entity.Rule;
import com.constructionplatform.app.entity.RuleCondition;
import com.constructionplatform.app.enums.CombinationType;
import com.constructionplatform.app.enums.RuleStatus;
import com.constructionplatform.app.enums.RuleType;
import com.constructionplatform.app.repository.RuleRepository;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class RuleEvaluator {

    private final RuleRepository ruleRepository;
    private final ConditionEvaluator conditionEvaluator;

    public RuleEvaluator(RuleRepository ruleRepository, ConditionEvaluator conditionEvaluator) {
        this.ruleRepository = ruleRepository;
        this.conditionEvaluator = conditionEvaluator;
    }

    public EvaluationResult evaluateRules(InputProfile inputProfile, List<Product> products) {
        List<Rule> activeRules = ruleRepository.findByRuleStatusOrderByPriorityDesc(RuleStatus.ACTIVE);
        
        EvaluationResult evaluationResult = new EvaluationResult();
        evaluationResult.setInputProfile(inputProfile);

        for (Product product : products) {
            ProductEvaluationResult productResult = evaluateProduct(product, inputProfile, activeRules);
            evaluationResult.getProductResults().add(productResult);
        }

        return evaluationResult;
    }

    private ProductEvaluationResult evaluateProduct(Product product, InputProfile inputProfile, List<Rule> activeRules) {
        ProductEvaluationResult productResult = new ProductEvaluationResult();
        productResult.setProduct(product);

        for (Rule rule : activeRules) {
            RuleMatchResult matchResult = evaluateSingleRule(rule, product, inputProfile);

            if (matchResult.isMatched()) {
                productResult.getMatchedRules().add(matchResult);
            } else if (matchResult.isHardConstraint()) {
                // If a hard constraint fails to match, the product is completely excluded
                productResult.getFailedHardConstraints().add(matchResult);
                productResult.setExcluded(true);
            }
            // Soft preferences that fail are simply ignored (they don't add to score)
        }

        return productResult;
    }

    private RuleMatchResult evaluateSingleRule(Rule rule, Product product, InputProfile inputProfile) {
        RuleMatchResult matchResult = new RuleMatchResult();
        matchResult.setRuleId(rule.getId());
        matchResult.setRuleName(rule.getName());
        matchResult.setHardConstraint(rule.getRuleType() == RuleType.HARD_CONSTRAINT);
        matchResult.setWeight(rule.getWeight());
        matchResult.setPriority(rule.getPriority());

        // If it's a dynamic rule, bypass conditions array and evaluate dynamic target
        if (rule.getCombinationType() == CombinationType.NONE) {
            String attr = rule.getDynamicAttribute();
            if (attr != null && !attr.isEmpty()) {
                boolean isMatched = conditionEvaluator.evaluateDynamic(attr, inputProfile, product);
                matchResult.setMatched(isMatched);
                if (isMatched) {
                    matchResult.getMatchedConditions().add("Dynamic matched: " + attr);
                } else {
                    matchResult.getFailedConditions().add("Dynamic failed: " + attr);
                }
            } else {
                matchResult.setMatched(false);
            }
            return matchResult;
        }

        if (rule.getConditions() == null || rule.getConditions().isEmpty()) {
            // A regular rule with no conditions is technically matched by default
            matchResult.setMatched(true);
            return matchResult;
        }

        boolean allMatched = true;
        boolean anyMatched = false;

        for (RuleCondition condition : rule.getConditions()) {
            boolean isConditionMet = conditionEvaluator.evaluate(condition, inputProfile, product);
            
            String logString = condition.getAttributeName() + " " + condition.getOperator() + " " + condition.getExpectedValue();
            
            if (isConditionMet) {
                matchResult.getMatchedConditions().add(logString);
                anyMatched = true;
            } else {
                matchResult.getFailedConditions().add(logString);
                allMatched = false;
            }
        }

        if (rule.getCombinationType() == CombinationType.ALL) {
            matchResult.setMatched(allMatched);
        } else if (rule.getCombinationType() == CombinationType.ANY) {
            matchResult.setMatched(anyMatched);
        }

        return matchResult;
    }
}
