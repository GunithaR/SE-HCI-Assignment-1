package com.constructionplatform.app.engine;

import com.constructionplatform.app.entity.Category;
import com.constructionplatform.app.entity.Product;
import com.constructionplatform.app.entity.ProductAttribute;
import com.constructionplatform.app.entity.Rule;
import com.constructionplatform.app.entity.AnswerAttributeMapping;
import com.constructionplatform.app.enums.ScoringMode;
import com.constructionplatform.app.repository.RuleRepository;
import com.constructionplatform.app.enums.RulePriority;
import com.constructionplatform.app.enums.RuleStatus;
import com.constructionplatform.app.enums.RuleType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.math.BigDecimal;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

class DynamicRuleEngineTest {

    private RuleRepository ruleRepository;
    private DynamicRuleEngine ruleEngine;

    @BeforeEach
    void setUp() {
        ruleRepository = Mockito.mock(RuleRepository.class);
        ruleEngine = new DynamicRuleEngine(ruleRepository);
    }

    private Product buildTestProduct(String budget, String dur, String waterRes) {
        Product p = new Product();
        p.setName("Test Item");
        p.setBasePrice(new BigDecimal("100"));
        Category cat = new Category();
        cat.setName("TestCategory");
        p.setCategory(cat);

        ProductAttribute attr = new ProductAttribute();
        if (budget != null) attr.setBudgetLevel(ProductAttribute.BudgetLevel.valueOf(budget));
        if (dur != null) attr.setDurabilityRating(ProductAttribute.ResistanceLevel.valueOf(dur));
        if (waterRes != null) attr.setWaterResistance(ProductAttribute.ResistanceLevel.valueOf(waterRes));
        p.setAttribute(attr);

        return p;
    }

    private AnswerAttributeMapping makeMapping(String answerKey, String answerValue, String attr, String idealCode, Double match, Double dev1, Double defScore) {
        AnswerAttributeMapping m = new AnswerAttributeMapping();
        m.setScoringMode(ScoringMode.LEVELED);
        m.setAnswerKey(answerKey);
        m.setAnswerValue(answerValue);
        m.setProductAttribute(attr);
        m.setIdealLevel(idealCode);
        m.setExactMatchScore(match != null ? match : 10.0);
        m.setDeviation1Score(dev1 != null ? dev1 : 5.0);
        m.setDeviation2Score(2.0);
        m.setNoDataScore(defScore != null ? defScore : 3.0);
        return m;
    }

    @Test
    @DisplayName("Aggregates scores correctly across multiple matched active rules and answers")
    void testScoreAggregationAndBreakdown() {
        // Setup Rules
        Rule rule1 = new Rule();
        rule1.setName("Budget Rule");
        rule1.setRulePriority(RulePriority.HIGH); // weight = 25
        rule1.setDefaultScore(5.0);
        rule1.setRuleStatus(RuleStatus.ACTIVE);
        rule1.setRuleType(RuleType.CONDITIONAL_MATCH);
        rule1.addMapping(makeMapping("budget", "low", "budgetLevel", "LOW", 10.0, 5.0, 5.0));

        Rule rule2 = new Rule();
        rule2.setName("Durability Rule");
        rule2.setRulePriority(RulePriority.MEDIUM); // weight = 15
        rule2.setDefaultScore(7.0);
        rule2.setRuleStatus(RuleStatus.ACTIVE);
        rule2.setRuleType(RuleType.CONDITIONAL_MATCH);
        rule2.addMapping(makeMapping("usage", "heavy", "durabilityRating", "HIGH", 10.0, 6.0, 3.0));
        rule2.addMapping(makeMapping("usage", "heavy", "waterResistance", "HIGH", 10.0, 6.0, 3.0));

        when(ruleRepository.findByRuleStatus(RuleStatus.ACTIVE)).thenReturn(List.of(rule1, rule2));

        // Setup User Answers
        Map<String, String> answers = new HashMap<>();
        answers.put("budget", "low"); // Will match Budget Rule (Exact match)
        answers.put("usage", "heavy"); // Will match Durability Rule (both mappings)

        // Setup identical product but differing ratings
        Product p1 = buildTestProduct("LOW", "MEDIUM", "HIGH");
        // p1 Budget config match: budgetLevel LOW vs ideal LOW = EXACT = 10.0
        // p1 Durability config match mapping 1: dur MEDIUM vs HIGH = dev1 = 6.0
        // p1 Durability config match mapping 2: water HIGH vs HIGH = exact = 10.0
        // rule2 avg for "usage" key = (6.0 + 10.0) / 2 = 8.0

        List<Product> catalog = List.of(p1);

        // Act
        List<AdjustedProductScore> results = ruleEngine.scoreProducts(catalog, answers, 5);

        // Assert
        assertEquals(1, results.size());
        AdjustedProductScore result = results.get(0);
        
        // Assert breakdowns
        Map<String, Double> breakdown = result.getStrategyScores();
        assertNotNull(breakdown);
        assertEquals(2, breakdown.size());
        assertEquals(10.0, breakdown.get("Budget Rule"), 0.01, "Budget rule should score exactly 10.0");
        assertEquals(8.0, breakdown.get("Durability Rule"), 0.01, "Durability rule should average 10.0 and 6.0 to 8.0");

        // Assert Weighted Aggregation
        // Weight High (rule1)=25, Medium (rule2)=15, total=40
        // logic: ((10.0 * 25) + (8.0 * 15)) / 40
        // 250 + 120 = 370. 370 / 40 = 9.25
        assertEquals(9.25, result.getFinalScore(), 0.01, "Total score should be correctly weighted");
    }

    @Test
    @DisplayName("Averages multiple answers for the same key within a rule")
    void testMultipleMappingsSameKey() {
        Rule rule = new Rule();
        rule.setName("Multi Mapping");
        rule.setRulePriority(RulePriority.LOW); // weight = 10
        rule.setRuleStatus(RuleStatus.ACTIVE);
        rule.setRuleType(RuleType.CONDITIONAL_MATCH);
        // Both trigger off "feature"="all"
        rule.addMapping(makeMapping("feature", "all", "budgetLevel", "LOW", 10.0, 5.0, 3.0));
        rule.addMapping(makeMapping("feature", "all", "waterResistance", "HIGH", 10.0, 6.0, 3.0));

        when(ruleRepository.findByRuleStatus(RuleStatus.ACTIVE)).thenReturn(List.of(rule));

        Map<String, String> answers = Map.of("feature", "all");
        Product p = buildTestProduct("LOW", null, "LOW"); // Water is Low, budget is Low
        
        List<AdjustedProductScore> res = ruleEngine.scoreProducts(List.of(p), answers, 5);
        
        // Budget = Exact(10), Water = dev2(2) -> rule score = (10+2)/2 = 6.0
        assertEquals(6.0, res.get(0).getFinalScore(), 0.01);
    }
}
