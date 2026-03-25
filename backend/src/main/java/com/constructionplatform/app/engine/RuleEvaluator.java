package com.constructionplatform.app.engine;

import com.constructionplatform.app.entity.Product;
import com.constructionplatform.app.entity.Rule;
import com.constructionplatform.app.entity.RuleCondition;
import com.constructionplatform.app.enums.CombinationType;
import com.constructionplatform.app.enums.EffectType;
import com.constructionplatform.app.enums.RuleStatus;
import com.constructionplatform.app.enums.RuleType;
import com.constructionplatform.app.repository.RuleRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Core rule evaluation engine.
 * For each product, iterates over all active rules and applies effects:
 *   ADD_SCORE     → score += effectValue × weight
 *   DEDUCT_SCORE  → score -= effectValue × weight
 *   FILTER_OUT    → exclude product from results
 */
@Component
public class RuleEvaluator {

    private static final Logger log = LoggerFactory.getLogger(RuleEvaluator.class);

    private final RuleRepository ruleRepository;
    private final ConditionEvaluator conditionEvaluator;

    public RuleEvaluator(RuleRepository ruleRepository, ConditionEvaluator conditionEvaluator) {
        this.ruleRepository = ruleRepository;
        this.conditionEvaluator = conditionEvaluator;
    }

    /**
     * Evaluate all active rules against a list of products for the given input profile.
     */
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
                // Apply the effect
                EffectType effect = rule.getEffectType();
                if (effect == null) {
                    // Legacy: infer from rule type
                    effect = rule.getRuleType() == RuleType.HARD_CONSTRAINT
                            ? EffectType.FILTER_OUT
                            : EffectType.ADD_SCORE;
                }

                matchResult.setEffectType(effect);
                matchResult.setEffectValue(rule.getEffectValue());

                switch (effect) {
                    case ADD_SCORE -> {
                        int val = rule.getEffectValue() != null ? rule.getEffectValue() : 0;
                        double w = rule.getWeight() != null ? rule.getWeight() : 1.0;
                        double contribution = val * w;
                        matchResult.setScoreContribution(contribution);
                        productResult.getMatchedRules().add(matchResult);
                        log.debug("Rule '{}' ADD_SCORE +{} to product '{}'", rule.getName(), contribution, product.getName());
                    }
                    case DEDUCT_SCORE -> {
                        int val = rule.getEffectValue() != null ? rule.getEffectValue() : 0;
                        double w = rule.getWeight() != null ? rule.getWeight() : 1.0;
                        double contribution = -(val * w);
                        matchResult.setScoreContribution(contribution);
                        productResult.getMatchedRules().add(matchResult);
                        log.debug("Rule '{}' DEDUCT_SCORE {} from product '{}'", rule.getName(), contribution, product.getName());
                    }
                    case FILTER_OUT -> {
                        matchResult.setScoreContribution(0);
                        productResult.getFailedHardConstraints().add(matchResult);
                        productResult.setExcluded(true);
                        log.debug("Rule '{}' FILTER_OUT excludes product '{}'", rule.getName(), product.getName());
                    }
                }
            } else if (matchResult.isHardConstraint()) {
                // Hard constraint did NOT match — for FILTER_OUT rules, non-match means product is OK
                // For HARD_CONSTRAINT type with FILTER_OUT: match = exclude, non-match = keep
                // This is already correct: we only exclude on match with FILTER_OUT
            }
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

        // Dynamic attribute evaluation (combination type = NONE)
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

        // No conditions → auto-match
        if (rule.getConditions() == null || rule.getConditions().isEmpty()) {
            matchResult.setMatched(true);
            return matchResult;
        }

        // Evaluate conditions
        boolean allMatched = true;
        boolean anyMatched = false;

        for (RuleCondition condition : rule.getConditions()) {
            boolean isConditionMet = conditionEvaluator.evaluate(condition, inputProfile, product);
            String logString = condition.getOperandSource() + "." + condition.getAttributeName()
                    + " " + condition.getOperator() + " " + condition.getExpectedValue();

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
