package com.constructionplatform.app.engine;

import com.constructionplatform.app.entity.*;
import com.constructionplatform.app.enums.EffectType;
import com.constructionplatform.app.enums.RuleStatus;
import com.constructionplatform.app.enums.RuleType;
import com.constructionplatform.app.enums.ScoringMode;
import com.constructionplatform.app.repository.RuleRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Dynamic rule engine that scores products using admin-configured rules.
 *
 * <p>Pipeline:
 * <ol>
 *   <li>Load all ACTIVE rules from the database</li>
 *   <li>Apply PRODUCT_EXCLUSION rules → mark excluded products</li>
 *   <li>Apply CONDITIONAL_MATCH rules → calculate weighted base scores</li>
 *   <li>Apply SCORE_ADJUST rules → boost/deduct targeted products</li>
 *   <li>Sort by finalScore descending, return top N</li>
 * </ol>
 *
 * <p>CONDITIONAL_MATCH evaluation (flat mapping model):
 * <pre>
 *   For each rule:
 *     Collect all mappings whose answerKey+answerValue match the user's answers
 *     If no mappings match → use rule.defaultScore
 *     For each matched mapping, score the product attribute using the scoring mode:
 *       LEVELED  → rank-based deviation scoring (exact=10, 1-off=5, 2-off=2)
 *       CATEGORICAL → equality check (match=10, no-match=2)
 *       FIXED → return fixedScore directly
 *     Group matched mappings by answerKey, average within each key
 *     Rule score = average across all matched answer keys
 *   finalScore = Σ(ruleScore × weight) / Σ(weights)
 * </pre>
 */
@Service
public class DynamicRuleEngine {

    private static final Logger log = LoggerFactory.getLogger(DynamicRuleEngine.class);

    /** Ordered level ranks for LEVELED scoring */
    private static final Map<String, Integer> LEVEL_RANKS = Map.of(
            "LOW", 1, "MEDIUM", 2, "HIGH", 3,
            "XS", 1, "S", 2, "M", 3, "L", 4, "XL", 5
    );

    private final RuleRepository ruleRepository;

    public DynamicRuleEngine(RuleRepository ruleRepository) {
        this.ruleRepository = ruleRepository;
    }

    /**
     * Score and rank all products using admin-configured rules.
     */
    public List<AdjustedProductScore> scoreProducts(List<Product> products,
                                                     Map<String, String> normalizedAnswers,
                                                     int topN) {
        List<Rule> activeRules = ruleRepository.findByRuleStatus(RuleStatus.ACTIVE);
        log.info("DynamicRuleEngine: {} active rules loaded", activeRules.size());

        List<Rule> exclusionRules = filterByType(activeRules, RuleType.PRODUCT_EXCLUSION);
        List<Rule> matchRules = filterByType(activeRules, RuleType.CONDITIONAL_MATCH);
        List<Rule> adjustRules = filterByType(activeRules, RuleType.SCORE_ADJUST);

        // Step 1: Determine excluded product IDs
        Set<Long> excludedIds = resolveExclusions(exclusionRules);
        Map<Long, String> exclusionReasons = resolveExclusionReasons(exclusionRules);

        // Step 2 & 3: Score each product
        List<AdjustedProductScore> results = new ArrayList<>();

        for (Product product : products) {
            if (excludedIds.contains(product.getId())) {
                results.add(AdjustedProductScore.excluded(product,
                        exclusionReasons.getOrDefault(product.getId(), "Excluded by rule")));
                continue;
            }

            AdjustedProductScore scored = scoreByMappings(product, matchRules, normalizedAnswers);
            applyScoreAdjustments(scored, adjustRules);
            results.add(scored);
        }

        // Sort: non-excluded by finalScore desc, then excluded at the end
        results.sort((a, b) -> {
            if (a.isExcluded() != b.isExcluded()) return a.isExcluded() ? 1 : -1;
            int cmp = Double.compare(b.getFinalScore(), a.getFinalScore());
            if (cmp != 0) return cmp;
            return a.getProduct().getName().compareTo(b.getProduct().getName());
        });

        List<AdjustedProductScore> topResults = new ArrayList<>();
        int count = 0;
        for (AdjustedProductScore score : results) {
            if (!score.isExcluded() && count >= topN) continue;
            if (!score.isExcluded()) count++;
            topResults.add(score);
        }
        return topResults;
    }

    // ── CONDITIONAL_MATCH scoring (flat mapping model) ──────────────────────

    private AdjustedProductScore scoreByMappings(Product product,
                                                  List<Rule> matchRules,
                                                  Map<String, String> normalizedAnswers) {
        Map<String, Double> ruleScoreBreakdown = new LinkedHashMap<>();
        List<String> tradeOffs = new ArrayList<>();
        double totalWeightedScore = 0.0;
        int totalWeight = 0;

        for (Rule rule : matchRules) {
            // Check category filter
            if (rule.getTargetCategoryName() != null && !rule.getTargetCategoryName().isBlank()) {
                String productCategory = product.getCategory() != null ? product.getCategory().getName() : "";
                if (!productCategory.equalsIgnoreCase(rule.getTargetCategoryName())) {
                    continue;
                }
            }

            double ruleScore = evaluateRule(rule, product, normalizedAnswers);
            int weight = rule.getWeight();

            ruleScoreBreakdown.put(rule.getName(), ruleScore);
            totalWeightedScore += ruleScore * weight;
            totalWeight += weight;

            if (ruleScore <= 3.0 && weight >= 25) {
                tradeOffs.add(rule.getName() + " score is low (" + String.format("%.1f", ruleScore) + "/10)");
            }
        }

        double baseScore = totalWeight > 0 ? totalWeightedScore / totalWeight : 0.0;
        baseScore = Math.round(baseScore * 100.0) / 100.0;

        log.debug("Product '{}': baseScore={}, breakdown={}", product.getName(), baseScore, ruleScoreBreakdown);
        return AdjustedProductScore.scored(product, baseScore, ruleScoreBreakdown, tradeOffs);
    }

    /**
     * Evaluate a CONDITIONAL_MATCH rule for a product.
     *
     * <p>Finds all mappings whose answerKey+answerValue match the user's answers,
     * scores each one, groups by answerKey, averages per key, then averages across keys.
     */
    private double evaluateRule(Rule rule, Product product, Map<String, String> normalizedAnswers) {
        List<AnswerAttributeMapping> mappings = rule.getMappings();
        if (mappings == null || mappings.isEmpty()) {
            return rule.getDefaultScore() != null ? rule.getDefaultScore() : 5.0;
        }

        // Find all mappings that match the user's answers
        List<AnswerAttributeMapping> matchedMappings = new ArrayList<>();
        for (AnswerAttributeMapping mapping : mappings) {
            String userAnswer = normalizedAnswers != null
                    ? normalizedAnswers.get(mapping.getAnswerKey()) : null;

            if (userAnswer != null && userAnswer.equalsIgnoreCase(mapping.getAnswerValue())) {
                matchedMappings.add(mapping);
            }
        }

        // No mapping matched any user answer → default score
        if (matchedMappings.isEmpty()) {
            return rule.getDefaultScore() != null ? rule.getDefaultScore() : 5.0;
        }

        // Group matched mappings by answerKey and average within each key
        Map<String, List<Double>> scoresByKey = new LinkedHashMap<>();
        for (AnswerAttributeMapping m : matchedMappings) {
            double score = scoreMapping(m, product);
            scoresByKey.computeIfAbsent(m.getAnswerKey(), k -> new ArrayList<>()).add(score);
        }

        // Average across all answer keys
        double total = 0.0;
        for (List<Double> scores : scoresByKey.values()) {
            double keyAvg = scores.stream().mapToDouble(Double::doubleValue).average().orElse(5.0);
            total += keyAvg;
        }

        return total / scoresByKey.size();
    }

    /**
     * Score a single mapping against a product using its scoring mode.
     */
    private double scoreMapping(AnswerAttributeMapping mapping, Product product) {
        return switch (mapping.getScoringMode()) {
            case LEVELED -> scoreLeveled(mapping, product);
            case CATEGORICAL -> scoreCategorical(mapping, product);
            case FIXED -> mapping.getFixedScore() != null ? mapping.getFixedScore() : 5.0;
        };
    }

    /**
     * LEVELED scoring: compare product attribute tier vs ideal level using rank deviation.
     * exact match → exactMatchScore, 1 level off → deviation1Score, 2+ → deviation2Score
     */
    private double scoreLeveled(AnswerAttributeMapping mapping, Product product) {
        String productValue = getProductAttributeValue(product, mapping.getProductAttribute());
        if (productValue == null || productValue.isBlank()) {
            return mapping.getNoDataScore() != null ? mapping.getNoDataScore() : 3.0;
        }

        String idealLevel = mapping.getIdealLevel();
        if (idealLevel == null) {
            return mapping.getNoDataScore() != null ? mapping.getNoDataScore() : 3.0;
        }

        // For numeric attributes like durabilityRating
        Integer productInt = tryParseInt(productValue);
        Integer idealInt = tryParseInt(idealLevel);

        boolean isConstraintAttribute = mapping.getProductAttribute().toLowerCase().contains("budget") || 
                                        mapping.getProductAttribute().toLowerCase().contains("maintenance");

        if (productInt != null && idealInt != null) {
            int diff = productInt - idealInt;
            
            if (!isConstraintAttribute && diff > 0) {
                return mapping.getExactMatchScore() != null ? mapping.getExactMatchScore() : 10.0;
            }

            // Numeric comparison: each 1-2 points of difference = ~1 deviation step
            int absDiff = Math.abs(diff);
            if (absDiff == 0) return mapping.getExactMatchScore() != null ? mapping.getExactMatchScore() : 10.0;
            if (absDiff <= 2) return mapping.getDeviation1Score() != null ? mapping.getDeviation1Score() : 5.0;
            return mapping.getDeviation2Score() != null ? mapping.getDeviation2Score() : 2.0;
        }

        // Tier-based comparison (LOW/MEDIUM/HIGH)
        int productRank = LEVEL_RANKS.getOrDefault(productValue.toUpperCase(), 2);
        int idealRank = LEVEL_RANKS.getOrDefault(idealLevel.toUpperCase(), 2);
        
        int diff = productRank - idealRank;

        // In the legacy system, exceeding a required ResistanceLevel (e.g., getting HIGH durability when only MEDIUM was needed)
        // yielded a perfect 10.0 score. However, exceeding a constraint like Budget or Maintenance is a negative deviation.
        if (!isConstraintAttribute && diff > 0) {
            // Exceeding a resistance threshold grants a perfect score
            return mapping.getExactMatchScore() != null ? mapping.getExactMatchScore() : 10.0;
        }

        int absDiff = Math.abs(diff);

        if (absDiff == 0) return mapping.getExactMatchScore() != null ? mapping.getExactMatchScore() : 10.0;
        if (absDiff == 1) return mapping.getDeviation1Score() != null ? mapping.getDeviation1Score() : 5.0;
        return mapping.getDeviation2Score() != null ? mapping.getDeviation2Score() : 2.0;
    }

    /**
     * CATEGORICAL scoring: exact match vs no match.
     */
    private double scoreCategorical(AnswerAttributeMapping mapping, Product product) {
        String productValue = getProductAttributeValue(product, mapping.getProductAttribute());
        if (productValue == null || productValue.isBlank()) {
            return mapping.getNoDataScore() != null ? mapping.getNoDataScore() : 3.0;
        }

        String idealLevel = mapping.getIdealLevel();
        if (idealLevel == null) {
            return mapping.getNoDataScore() != null ? mapping.getNoDataScore() : 3.0;
        }

        // Split idealLevel by comma to support exact and compatible lists. Format: "EXACT,COMPAT1,COMPAT2"
        String[] idealTokens = idealLevel.split(",");
        String exactIdeal = idealTokens[0].trim();

        // Exact match check (case-insensitive, supports substring)
        boolean exactMatch = productValue.equalsIgnoreCase(exactIdeal)
                || productValue.toUpperCase().contains(exactIdeal.toUpperCase())
                || exactIdeal.toUpperCase().contains(productValue.toUpperCase());

        if (exactMatch) {
            return mapping.getMatchScore() != null ? mapping.getMatchScore() : 10.0;
        }

        // Check compatible styles (tokens from index 1 onwards)
        for (int i = 1; i < idealTokens.length; i++) {
            String compatIdeal = idealTokens[i].trim();
            if (productValue.equalsIgnoreCase(compatIdeal)
                    || productValue.toUpperCase().contains(compatIdeal.toUpperCase())
                    || compatIdeal.toUpperCase().contains(productValue.toUpperCase())) {
                return mapping.getDeviation1Score() != null ? mapping.getDeviation1Score() : 6.0;
            }
        }

        return mapping.getNoMatchScore() != null ? mapping.getNoMatchScore() : 2.0;
    }

    // ── SCORE_ADJUST ────────────────────────────────────────────────────────

    private void applyScoreAdjustments(AdjustedProductScore scored, List<Rule> adjustRules) {
        for (Rule rule : adjustRules) {
            if (rule.getProductTargets() == null || rule.getProductTargets().isEmpty()) continue;
            boolean isTargeted = rule.getProductTargets().stream()
                    .anyMatch(t -> t.getProduct().getId().equals(scored.getProduct().getId()));
            if (!isTargeted) continue;

            if (rule.getEffectType() == EffectType.ADD_SCORE && rule.getEffectValue() != null) {
                scored.addScore(rule.getEffectValue(), rule.getName());
            } else if (rule.getEffectType() == EffectType.DEDUCT_SCORE && rule.getEffectValue() != null) {
                scored.deductScore(rule.getEffectValue(), rule.getName());
            }
        }
    }

    // ── PRODUCT_EXCLUSION ───────────────────────────────────────────────────

    private Set<Long> resolveExclusions(List<Rule> exclusionRules) {
        Set<Long> ids = new HashSet<>();
        for (Rule rule : exclusionRules) {
            if (rule.getProductTargets() != null) {
                for (RuleProductTarget t : rule.getProductTargets()) ids.add(t.getProduct().getId());
            }
        }
        return ids;
    }

    private Map<Long, String> resolveExclusionReasons(List<Rule> exclusionRules) {
        Map<Long, String> reasons = new HashMap<>();
        for (Rule rule : exclusionRules) {
            if (rule.getProductTargets() != null) {
                for (RuleProductTarget t : rule.getProductTargets()) reasons.put(t.getProduct().getId(), rule.getName());
            }
        }
        return reasons;
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    private List<Rule> filterByType(List<Rule> rules, RuleType type) {
        return rules.stream().filter(r -> r.getRuleType() == type).toList();
    }

    private Integer tryParseInt(String value) {
        try {
            return Integer.parseInt(value.trim());
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private String getProductAttributeValue(Product product, String attributeName) {
        if (attributeName == null) return null;
        ProductAttribute attr = product.getAttribute();
        if (attr == null) return null;

        return switch (attributeName.toLowerCase()) {
            case "budgetlevel", "budget_level" ->
                    attr.getBudgetLevel() != null ? attr.getBudgetLevel().name() : null;
            case "maintenancelevel", "maintenance_level" ->
                    attr.getMaintenanceLevel() != null ? attr.getMaintenanceLevel().name() : null;
            case "climatesuitability", "climate_suitability" ->
                    attr.getClimateSuitability() != null ? attr.getClimateSuitability().name() : null;
            case "durabilityrating", "durability_rating" ->
                    attr.getDurabilityRating() != null ? attr.getDurabilityRating().name() : null;
            case "style" -> attr.getStyle();
            case "size" -> attr.getSize() != null ? attr.getSize().name() : null;
            case "material" -> attr.getMaterial() != null ? attr.getMaterial().name() : null;
            case "waterresistance", "water_resistance" ->
                    attr.getWaterResistance() != null ? attr.getWaterResistance().name() : null;
            case "corrosionresistance", "corrosion_resistance" ->
                    attr.getCorrosionResistance() != null ? attr.getCorrosionResistance().name() : null;
            case "heatresistance", "heat_resistance" ->
                    attr.getHeatResistance() != null ? attr.getHeatResistance().name() : null;
            case "slipresistance", "slip_resistance" ->
                    attr.getSlipResistance() != null ? attr.getSlipResistance().name() : null;
            case "noisereduction", "noise_reduction" ->
                    attr.getNoiseReduction() != null ? attr.getNoiseReduction().name() : null;
            case "usagearea", "usage_area" -> attr.getUsageArea();
            default -> {
                log.warn("Unknown product attribute: {}", attributeName);
                yield null;
            }
        };
    }
}
