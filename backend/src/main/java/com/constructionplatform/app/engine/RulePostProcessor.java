package com.constructionplatform.app.engine;

import com.constructionplatform.app.entity.Rule;
import com.constructionplatform.app.entity.RuleCondition;
import com.constructionplatform.app.enums.CombinationType;
import com.constructionplatform.app.enums.EffectType;
import com.constructionplatform.app.enums.RuleStatus;
import com.constructionplatform.app.enums.TargetScope;
import com.constructionplatform.app.repository.RuleRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

/**
 * Applies active rules as post-processing adjustments to strategy-scored products.
 *
 * <p>This is the bridge between the admin-configured rule engine and the
 * strategy-based scoring pipeline. Rules can:</p>
 * <ul>
 *   <li><b>ADD_SCORE</b> – award bonus points to matching products</li>
 *   <li><b>DEDUCT_SCORE</b> – penalise products that match negative conditions</li>
 *   <li><b>FILTER_OUT</b> – mark products as excluded (shown greyed-out)</li>
 * </ul>
 */
@Component
public class RulePostProcessor {

    private static final Logger log = LoggerFactory.getLogger(RulePostProcessor.class);

    private final RuleRepository ruleRepository;
    private final ConditionMatcher conditionMatcher;

    public RulePostProcessor(RuleRepository ruleRepository, ConditionMatcher conditionMatcher) {
        this.ruleRepository = ruleRepository;
        this.conditionMatcher = conditionMatcher;
    }

    /**
     * Apply all active rules to the strategy-scored product list.
     *
     * @param strategyScores    products scored by the RecommendationEngine
     * @param normalizedAnswers the pre-normalised user answers
     * @return products with rule adjustments applied, sorted by finalScore desc
     */
    public List<AdjustedProductScore> applyRules(
            List<RecommendationEngine.ProductScore> strategyScores,
            Map<String, String> normalizedAnswers) {

        // Wrap each strategy score in an AdjustedProductScore
        List<AdjustedProductScore> adjusted = new ArrayList<>();
        for (RecommendationEngine.ProductScore ps : strategyScores) {
            adjusted.add(AdjustedProductScore.from(ps));
        }

        // Load active rules ordered by priority (highest first)
        List<Rule> activeRules = ruleRepository.findByRuleStatus(RuleStatus.ACTIVE);
        activeRules.sort(Comparator.comparing(Rule::getPriority).reversed());

        if (activeRules.isEmpty()) {
            log.debug("No active rules found; returning strategy scores unchanged.");
            return adjusted;
        }

        log.info("Applying {} active rule(s) to {} products", activeRules.size(), adjusted.size());

        // Evaluate each rule against each product
        for (AdjustedProductScore aps : adjusted) {
            for (Rule rule : activeRules) {
                if (!appliesToProduct(rule, aps)) continue;

                boolean matched = evaluateRule(rule, normalizedAnswers, aps);
                if (matched) {
                    applyEffect(rule, aps);
                }
            }
        }

        // Re-sort by final score descending
        adjusted.sort(Comparator.comparing(AdjustedProductScore::getFinalScore).reversed());

        return adjusted;
    }

    // ── Scope check ──────────────────────────────────────────────────────────

    private boolean appliesToProduct(Rule rule, AdjustedProductScore aps) {
        if (rule.getTargetScope() == TargetScope.GLOBAL) {
            return true;
        }

        if (rule.getTargetScope() == TargetScope.CATEGORY) {
            String categoryName = aps.getProduct().getCategory() != null
                    ? aps.getProduct().getCategory().getName()
                    : null;
            return rule.getTargetCategoryName() != null
                    && rule.getTargetCategoryName().equalsIgnoreCase(categoryName);
        }

        // PRODUCT_SET: not implemented yet — treat as global
        return true;
    }

    // ── Rule evaluation ──────────────────────────────────────────────────────

    private boolean evaluateRule(Rule rule, Map<String, String> normalizedAnswers, AdjustedProductScore aps) {
        // Dynamic attribute match (CombinationType.NONE)
        if (rule.getCombinationType() == CombinationType.NONE) {
            String dynAttr = rule.getDynamicAttribute();
            if (dynAttr == null || dynAttr.isBlank()) return false;
            return conditionMatcher.evaluateDynamic(dynAttr, normalizedAnswers, aps.getProduct());
        }

        // Condition-based evaluation
        List<RuleCondition> conditions = rule.getConditions();
        if (conditions == null || conditions.isEmpty()) {
            return false;
        }

        boolean allMatch = true;
        boolean anyMatch = false;

        for (RuleCondition cond : conditions) {
            boolean result = conditionMatcher.evaluate(cond, normalizedAnswers, aps.getProduct());
            if (result) anyMatch = true;
            if (!result) allMatch = false;
        }

        return switch (rule.getCombinationType()) {
            case ALL -> allMatch;
            case ANY -> anyMatch;
            case NONE -> false; // handled above
        };
    }

    // ── Effect application ───────────────────────────────────────────────────

    private void applyEffect(Rule rule, AdjustedProductScore aps) {
        EffectType effect = rule.getEffectType();
        if (effect == null) return;

        int effectValue = rule.getEffectValue() != null ? rule.getEffectValue() : 0;
        int weight = rule.getWeight() != null ? rule.getWeight() : 100;
        double adjustment = effectValue * (weight / 100.0);

        switch (effect) {
            case ADD_SCORE -> {
                aps.addScore(adjustment, rule.getName());
                log.debug("Rule '{}' → ADD {} to product '{}'",
                        rule.getName(), adjustment, aps.getProduct().getName());
            }
            case DEDUCT_SCORE -> {
                aps.deductScore(adjustment, rule.getName());
                log.debug("Rule '{}' → DEDUCT {} from product '{}'",
                        rule.getName(), adjustment, aps.getProduct().getName());
            }
            case FILTER_OUT -> {
                aps.markExcluded(rule.getName());
                log.info("Rule '{}' → FILTER_OUT product '{}'",
                        rule.getName(), aps.getProduct().getName());
            }
        }
    }
}
