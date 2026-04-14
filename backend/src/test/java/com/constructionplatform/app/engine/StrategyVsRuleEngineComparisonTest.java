package com.constructionplatform.app.engine;

import com.constructionplatform.app.engine.strategy.*;
import com.constructionplatform.app.entity.*;
import com.constructionplatform.app.entity.ProductAttribute.*;
import com.constructionplatform.app.enums.*;
import com.constructionplatform.app.repository.RuleRepository;
import org.junit.jupiter.api.*;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

/**
 * Comparison test: runs the SAME product + answer combinations through
 * both the OLD hardcoded strategies and the NEW rule engine, comparing scores.
 *
 * <p>This test creates rules in-memory that EXACTLY replicate the hardcoded
 * strategy scoring, then asserts both systems produce identical results.
 */
class StrategyVsRuleEngineComparisonTest {

    // ── Old strategies ──────────────────────────────────────────────────────
    private BudgetStrategy budgetStrategy;
    private EnvironmentStrategy environmentStrategy;
    private PerformanceStrategy performanceStrategy;
    private StyleStrategy styleStrategy;
    private MaintenanceStrategy maintenanceStrategy;
    private UsageStrategy usageStrategy;

    // ── New rule engine ─────────────────────────────────────────────────────
    private DynamicRuleEngine ruleEngine;
    private RuleRepository mockRuleRepository;

    // ── Rules that replicate the old strategies ─────────────────────────────
    private List<Rule> replicaRules;

    @BeforeEach
    void setUp() {
        // Initialize old strategies
        budgetStrategy = new BudgetStrategy();
        environmentStrategy = new EnvironmentStrategy();
        performanceStrategy = new PerformanceStrategy();
        styleStrategy = new StyleStrategy();
        maintenanceStrategy = new MaintenanceStrategy();
        usageStrategy = new UsageStrategy();

        // Build rules that EXACTLY replicate old strategies
        replicaRules = buildReplicaRules();

        // Set up rule engine with mock repository
        mockRuleRepository = mock(RuleRepository.class);
        when(mockRuleRepository.findByRuleStatus(RuleStatus.ACTIVE)).thenReturn(replicaRules);
        ruleEngine = new DynamicRuleEngine(mockRuleRepository);
    }

    // ═════════════════════════════════════════════════════════════════════════
    // 1. BUDGET STRATEGY COMPARISON
    // ═════════════════════════════════════════════════════════════════════════

    static Stream<Arguments> budgetTestCases() {
        return Stream.of(
            // userBudget,  productBudget, expectedScore
            Arguments.of("LOW",    BudgetLevel.LOW,    10.0),
            Arguments.of("LOW",    BudgetLevel.MEDIUM,  5.0),
            Arguments.of("LOW",    BudgetLevel.HIGH,    2.0),
            Arguments.of("MEDIUM", BudgetLevel.LOW,     5.0),
            Arguments.of("MEDIUM", BudgetLevel.MEDIUM, 10.0),
            Arguments.of("MEDIUM", BudgetLevel.HIGH,    5.0),
            Arguments.of("HIGH",   BudgetLevel.LOW,     2.0),
            Arguments.of("HIGH",   BudgetLevel.MEDIUM,  5.0),
            Arguments.of("HIGH",   BudgetLevel.HIGH,   10.0)
        );
    }

    @ParameterizedTest(name = "Budget: user={0}, product={1} → expected={2}")
    @MethodSource("budgetTestCases")
    void budgetScoringMatches(String userBudget, BudgetLevel productBudget, double expected) {
        Product product = buildProduct(productBudget, ResistanceLevel.MEDIUM, MaintenanceLevel.MEDIUM, "Modern",
                ResistanceLevel.MEDIUM, ResistanceLevel.MEDIUM, ResistanceLevel.MEDIUM,
                ResistanceLevel.MEDIUM, ResistanceLevel.MEDIUM);

        UserAnswers answers = new UserAnswers("Roofing Solution", Map.of("budget", userBudget));
        double oldScore = budgetStrategy.evaluate(product, answers);

        // Run through rule engine (only the budget rule)
        Rule budgetRule = replicaRules.stream()
                .filter(r -> r.getName().equals("Budget Match")).findFirst().orElseThrow();
        double newScore = evaluateSingleRule(budgetRule, product, answers.getAnswers());

        assertEquals(expected, oldScore, 0.01, "Old strategy score mismatch");
        assertEquals(oldScore, newScore, 0.01,
                String.format("BUDGET MISMATCH: user=%s, product=%s → old=%.1f, new=%.1f",
                        userBudget, productBudget, oldScore, newScore));
    }

    @Test
    @DisplayName("Budget: no answer → old returns 5.0")
    void budgetNoAnswer() {
        Product product = buildProduct(BudgetLevel.LOW, ResistanceLevel.MEDIUM, MaintenanceLevel.MEDIUM, "Modern",
                ResistanceLevel.MEDIUM, ResistanceLevel.MEDIUM, ResistanceLevel.MEDIUM,
                ResistanceLevel.MEDIUM, ResistanceLevel.MEDIUM);

        UserAnswers answers = new UserAnswers("Roofing Solution", Map.of());
        double oldScore = budgetStrategy.evaluate(product, answers);
        assertEquals(5.0, oldScore, 0.01);

        Rule budgetRule = replicaRules.stream()
                .filter(r -> r.getName().equals("Budget Match")).findFirst().orElseThrow();
        double newScore = evaluateSingleRule(budgetRule, product, Map.of());
        assertEquals(oldScore, newScore, 0.01, "No-answer default should be 5.0 for both");
    }

    // ═════════════════════════════════════════════════════════════════════════
    // 2. MAINTENANCE STRATEGY COMPARISON
    // ═════════════════════════════════════════════════════════════════════════

    static Stream<Arguments> maintenanceTestCases() {
        return Stream.of(
            Arguments.of("LOW",    MaintenanceLevel.LOW,    10.0),
            Arguments.of("LOW",    MaintenanceLevel.MEDIUM,  5.0),
            Arguments.of("LOW",    MaintenanceLevel.HIGH,    2.0),
            Arguments.of("MEDIUM", MaintenanceLevel.LOW,     5.0),
            Arguments.of("MEDIUM", MaintenanceLevel.MEDIUM, 10.0),
            Arguments.of("MEDIUM", MaintenanceLevel.HIGH,    5.0),
            Arguments.of("HIGH",   MaintenanceLevel.LOW,     2.0),
            Arguments.of("HIGH",   MaintenanceLevel.MEDIUM,  5.0),
            Arguments.of("HIGH",   MaintenanceLevel.HIGH,   10.0)
        );
    }

    @ParameterizedTest(name = "Maintenance: user={0}, product={1} → expected={2}")
    @MethodSource("maintenanceTestCases")
    void maintenanceScoringMatches(String userMaintenance, MaintenanceLevel productLevel, double expected) {
        Product product = buildProduct(BudgetLevel.MEDIUM, ResistanceLevel.MEDIUM, productLevel, "Modern",
                ResistanceLevel.MEDIUM, ResistanceLevel.MEDIUM, ResistanceLevel.MEDIUM,
                ResistanceLevel.MEDIUM, ResistanceLevel.MEDIUM);

        UserAnswers answers = new UserAnswers("Roofing Solution", Map.of("maintenance", userMaintenance));
        double oldScore = maintenanceStrategy.evaluate(product, answers);

        Rule maintenanceRule = replicaRules.stream()
                .filter(r -> r.getName().equals("Maintenance Match")).findFirst().orElseThrow();
        double newScore = evaluateSingleRule(maintenanceRule, product, answers.getAnswers());

        assertEquals(expected, oldScore, 0.01, "Old strategy score mismatch");
        assertEquals(oldScore, newScore, 0.01,
                String.format("MAINTENANCE MISMATCH: user=%s, product=%s → old=%.1f, new=%.1f",
                        userMaintenance, productLevel, oldScore, newScore));
    }

    // ═════════════════════════════════════════════════════════════════════════
    // 3. STYLE STRATEGY COMPARISON
    // ═════════════════════════════════════════════════════════════════════════

    static Stream<Arguments> styleTestCases() {
        return Stream.of(
            // Exact match
            Arguments.of("Modern",      "Modern",       10.0),
            Arguments.of("Traditional", "Traditional",  10.0),
            Arguments.of("Natural",     "Natural",      10.0),
            Arguments.of("Wooden",      "Wooden",       10.0),
            Arguments.of("Marble",      "Marble",       10.0),
            // Mismatches
            Arguments.of("Modern",      "Traditional",   2.0),
            Arguments.of("Modern",      "Natural",       2.0),
            Arguments.of("Traditional", "Modern",        2.0),
            Arguments.of("Wooden",      "Modern",        2.0)
        );
    }

    @ParameterizedTest(name = "Style: user={0}, product={1} → expected={2}")
    @MethodSource("styleTestCases")
    void styleScoringMatches(String userStyle, String productStyle, double expected) {
        Product product = buildProduct(BudgetLevel.MEDIUM, ResistanceLevel.MEDIUM, MaintenanceLevel.MEDIUM, productStyle,
                ResistanceLevel.MEDIUM, ResistanceLevel.MEDIUM, ResistanceLevel.MEDIUM,
                ResistanceLevel.MEDIUM, ResistanceLevel.MEDIUM);

        UserAnswers answers = new UserAnswers("Roofing Solution", Map.of("style", userStyle));
        double oldScore = styleStrategy.evaluate(product, answers);
        assertEquals(expected, oldScore, 0.01, "Old strategy sanity check");

        Rule styleRule = replicaRules.stream()
                .filter(r -> r.getName().equals("Style Match")).findFirst().orElseThrow();
        double newScore = evaluateSingleRule(styleRule, product, answers.getAnswers());

        assertEquals(oldScore, newScore, 0.01,
                String.format("STYLE MISMATCH: user=%s, product=%s → old=%.1f, new=%.1f",
                        userStyle, productStyle, oldScore, newScore));
    }

    // ═════════════════════════════════════════════════════════════════════════
    // 4. ENVIRONMENT STRATEGY COMPARISON
    // ═════════════════════════════════════════════════════════════════════════

    static Stream<Arguments> environmentTestCases() {
        return Stream.of(
            // location=coastal → corrosionResistance
            Arguments.of(Map.of("location", "coastal"),
                    ResistanceLevel.HIGH, ResistanceLevel.MEDIUM, ResistanceLevel.MEDIUM, 10.0),
            Arguments.of(Map.of("location", "coastal"),
                    ResistanceLevel.MEDIUM, ResistanceLevel.MEDIUM, ResistanceLevel.MEDIUM, 6.0),
            Arguments.of(Map.of("location", "coastal"),
                    ResistanceLevel.LOW, ResistanceLevel.MEDIUM, ResistanceLevel.MEDIUM, 2.0),

            // location=heavy rain → waterResistance
            Arguments.of(Map.of("location", "heavy rain"),
                    ResistanceLevel.MEDIUM, ResistanceLevel.HIGH, ResistanceLevel.MEDIUM, 10.0),
            Arguments.of(Map.of("location", "heavy rain"),
                    ResistanceLevel.MEDIUM, ResistanceLevel.MEDIUM, ResistanceLevel.MEDIUM, 6.0),

            // location=hot/dry → heatResistance
            Arguments.of(Map.of("location", "hot/dry"),
                    ResistanceLevel.MEDIUM, ResistanceLevel.MEDIUM, ResistanceLevel.HIGH, 10.0),
            Arguments.of(Map.of("location", "hot/dry"),
                    ResistanceLevel.MEDIUM, ResistanceLevel.MEDIUM, ResistanceLevel.LOW, 2.0),

            // location=urban → 7.0
            Arguments.of(Map.of("location", "urban"),
                    ResistanceLevel.LOW, ResistanceLevel.LOW, ResistanceLevel.LOW, 7.0),

            // environment=humid → waterResistance
            Arguments.of(Map.of("environment", "humid"),
                    ResistanceLevel.MEDIUM, ResistanceLevel.HIGH, ResistanceLevel.MEDIUM, 10.0),
            Arguments.of(Map.of("environment", "humid"),
                    ResistanceLevel.MEDIUM, ResistanceLevel.LOW, ResistanceLevel.MEDIUM, 2.0),

            // environment=dry → heatResistance
            Arguments.of(Map.of("environment", "dry"),
                    ResistanceLevel.MEDIUM, ResistanceLevel.MEDIUM, ResistanceLevel.HIGH, 10.0),

            // usage_environment=outdoor → avg(waterRes, corrosionRes)
            Arguments.of(Map.of("usage_environment", "outdoor"),
                    ResistanceLevel.HIGH, ResistanceLevel.HIGH, ResistanceLevel.MEDIUM, 10.0),
            Arguments.of(Map.of("usage_environment", "outdoor"),
                    ResistanceLevel.MEDIUM, ResistanceLevel.MEDIUM, ResistanceLevel.MEDIUM, 6.0),
            Arguments.of(Map.of("usage_environment", "outdoor"),
                    ResistanceLevel.LOW, ResistanceLevel.LOW, ResistanceLevel.MEDIUM, 2.0)
        );
    }

    @ParameterizedTest(name = "Environment: answers={0}, corr={1}, water={2}, heat={3} → expected={4}")
    @MethodSource("environmentTestCases")
    void environmentScoringMatches(Map<String, String> answersMap,
                                    ResistanceLevel corrosion, ResistanceLevel water,
                                    ResistanceLevel heat, double expected) {
        Product product = buildProductWithEnvAttributes(corrosion, water, heat);

        UserAnswers answers = new UserAnswers("Roofing Solution", answersMap);
        double oldScore = environmentStrategy.evaluate(product, answers);
        assertEquals(expected, oldScore, 0.01, "Old strategy sanity check");

        Rule envRule = replicaRules.stream()
                .filter(r -> r.getName().equals("Environment Match")).findFirst().orElseThrow();
        double newScore = evaluateSingleRule(envRule, product, answersMap);

        assertEquals(oldScore, newScore, 0.01,
                String.format("ENVIRONMENT MISMATCH: answers=%s → old=%.1f, new=%.1f",
                        answersMap, oldScore, newScore));
    }

    // ═════════════════════════════════════════════════════════════════════════
    // 5. PERFORMANCE STRATEGY COMPARISON
    // ═════════════════════════════════════════════════════════════════════════

    @Test
    @DisplayName("Performance: concern=keep house cool → heatResistance scoring")
    void performanceConcernHeat() {
        for (ResistanceLevel rl : ResistanceLevel.values()) {
            Product product = buildProduct(BudgetLevel.MEDIUM, ResistanceLevel.MEDIUM, MaintenanceLevel.MEDIUM, "Modern",
                    ResistanceLevel.MEDIUM, ResistanceLevel.MEDIUM, rl,
                    ResistanceLevel.MEDIUM, ResistanceLevel.MEDIUM);
            Map<String, String> answersMap = Map.of("concern", "keep house cool");
            UserAnswers answers = new UserAnswers("Roofing Solution", answersMap);
            double oldScore = performanceStrategy.evaluate(product, answers);
            Rule perfRule = replicaRules.stream()
                    .filter(r -> r.getName().equals("Performance Match")).findFirst().orElseThrow();
            double newScore = evaluateSingleRule(perfRule, product, answersMap);
            assertEquals(oldScore, newScore, 0.01,
                    String.format("PERF/heat MISMATCH: heatRes=%s → old=%.1f, new=%.1f", rl, oldScore, newScore));
        }
    }

    @Test
    @DisplayName("Performance: concern=reduce noise → noiseReduction scoring")
    void performanceConcernNoise() {
        for (ResistanceLevel rl : ResistanceLevel.values()) {
            Product product = buildProduct(BudgetLevel.MEDIUM, ResistanceLevel.MEDIUM, MaintenanceLevel.MEDIUM, "Modern",
                    ResistanceLevel.MEDIUM, ResistanceLevel.MEDIUM, ResistanceLevel.MEDIUM,
                    ResistanceLevel.MEDIUM, rl);
            Map<String, String> answersMap = Map.of("concern", "reduce noise");
            UserAnswers answers = new UserAnswers("Roofing Solution", answersMap);
            double oldScore = performanceStrategy.evaluate(product, answers);
            Rule perfRule = replicaRules.stream()
                    .filter(r -> r.getName().equals("Performance Match")).findFirst().orElseThrow();
            double newScore = evaluateSingleRule(perfRule, product, answersMap);
            assertEquals(oldScore, newScore, 0.01,
                    String.format("PERF/noise MISMATCH: noiseRed=%s → old=%.1f, new=%.1f", rl, oldScore, newScore));
        }
    }

    @Test
    @DisplayName("Performance: slip_resistance=yes → slipResistance scoring")
    void performanceSlipResistance() {
        for (ResistanceLevel rl : ResistanceLevel.values()) {
            Product product = buildProduct(BudgetLevel.MEDIUM, ResistanceLevel.MEDIUM, MaintenanceLevel.MEDIUM, "Modern",
                    ResistanceLevel.MEDIUM, ResistanceLevel.MEDIUM, ResistanceLevel.MEDIUM,
                    rl, ResistanceLevel.MEDIUM);
            Map<String, String> answersMap = Map.of("slip_resistance", "yes");
            UserAnswers answers = new UserAnswers("Roofing Solution", answersMap);
            double oldScore = performanceStrategy.evaluate(product, answers);
            Rule perfRule = replicaRules.stream()
                    .filter(r -> r.getName().equals("Performance Match")).findFirst().orElseThrow();
            double newScore = evaluateSingleRule(perfRule, product, answersMap);
            assertEquals(oldScore, newScore, 0.01,
                    String.format("PERF/slip MISMATCH: slipRes=%s → old=%.1f, new=%.1f", rl, oldScore, newScore));
        }
    }

    @Test
    @DisplayName("Performance: slip_resistance=no → 7.0 for both")
    void performanceSlipNo() {
        Product product = buildProduct(BudgetLevel.MEDIUM, ResistanceLevel.MEDIUM, MaintenanceLevel.MEDIUM, "Modern",
                ResistanceLevel.MEDIUM, ResistanceLevel.MEDIUM, ResistanceLevel.MEDIUM,
                ResistanceLevel.LOW, ResistanceLevel.MEDIUM);
        Map<String, String> answersMap = Map.of("slip_resistance", "no");
        UserAnswers answers = new UserAnswers("Roofing Solution", answersMap);
        double oldScore = performanceStrategy.evaluate(product, answers);
        Rule perfRule = replicaRules.stream()
                .filter(r -> r.getName().equals("Performance Match")).findFirst().orElseThrow();
        double newScore = evaluateSingleRule(perfRule, product, answersMap);
        assertEquals(7.0, oldScore, 0.01);
        assertEquals(oldScore, newScore, 0.01, "slip=no should be 7.0 for both");
    }

    // ═════════════════════════════════════════════════════════════════════════
    // 6. USAGE STRATEGY COMPARISON
    // ═════════════════════════════════════════════════════════════════════════

    @Test
    @DisplayName("Usage: flooring_usage=bathroom → avg(waterRes, slipRes)")
    void usageFlooringBathroom() {
        for (ResistanceLevel water : ResistanceLevel.values()) {
            for (ResistanceLevel slip : ResistanceLevel.values()) {
                Product product = buildProduct(BudgetLevel.MEDIUM, ResistanceLevel.MEDIUM, MaintenanceLevel.MEDIUM, "Modern",
                        water, ResistanceLevel.MEDIUM, ResistanceLevel.MEDIUM,
                        slip, ResistanceLevel.MEDIUM);
                Map<String, String> answersMap = Map.of("flooring_usage", "bathroom/wet area");
                UserAnswers answers = new UserAnswers("Flooring Solution", answersMap);
                double oldScore = usageStrategy.evaluate(product, answers);
                Rule usageRule = replicaRules.stream()
                        .filter(r -> r.getName().equals("Usage Match")).findFirst().orElseThrow();
                double newScore = evaluateSingleRule(usageRule, product, answersMap);
                assertEquals(oldScore, newScore, 0.01,
                        String.format("USAGE/bathroom MISMATCH: water=%s, slip=%s → old=%.1f, new=%.1f",
                                water, slip, oldScore, newScore));
            }
        }
    }

    @Test
    @DisplayName("Usage: flooring_usage=outdoor → avg(waterRes, heatRes)")
    void usageFlooringOutdoor() {
        for (ResistanceLevel water : ResistanceLevel.values()) {
            for (ResistanceLevel heat : ResistanceLevel.values()) {
                Product product = buildProduct(BudgetLevel.MEDIUM, ResistanceLevel.MEDIUM, MaintenanceLevel.MEDIUM, "Modern",
                        water, ResistanceLevel.MEDIUM, heat,
                        ResistanceLevel.MEDIUM, ResistanceLevel.MEDIUM);
                Map<String, String> answersMap = Map.of("flooring_usage", "outdoor");
                UserAnswers answers = new UserAnswers("Flooring Solution", answersMap);
                double oldScore = usageStrategy.evaluate(product, answers);
                Rule usageRule = replicaRules.stream()
                        .filter(r -> r.getName().equals("Usage Match")).findFirst().orElseThrow();
                double newScore = evaluateSingleRule(usageRule, product, answersMap);
                assertEquals(oldScore, newScore, 0.01,
                        String.format("USAGE/outdoor MISMATCH: water=%s, heat=%s → old=%.1f, new=%.1f",
                                water, heat, oldScore, newScore));
            }
        }
    }

    @Test
    @DisplayName("Usage: flooring_usage=living/bedroom → 7.0")
    void usageFlooringLiving() {
        Product product = buildProduct(BudgetLevel.MEDIUM, ResistanceLevel.LOW, MaintenanceLevel.MEDIUM, "Modern",
                ResistanceLevel.LOW, ResistanceLevel.MEDIUM, ResistanceLevel.MEDIUM,
                ResistanceLevel.LOW, ResistanceLevel.MEDIUM);
        Map<String, String> answersMap = Map.of("flooring_usage", "living/bedroom");
        UserAnswers answers = new UserAnswers("Flooring Solution", answersMap);
        double oldScore = usageStrategy.evaluate(product, answers);
        Rule usageRule = replicaRules.stream()
                .filter(r -> r.getName().equals("Usage Match")).findFirst().orElseThrow();
        double newScore = evaluateSingleRule(usageRule, product, answersMap);
        assertEquals(7.0, oldScore, 0.01);
        assertEquals(oldScore, newScore, 0.01);
    }

    @Test
    @DisplayName("Usage: traffic=low → 7.0")
    void usageTrafficLow() {
        Product product = buildProduct(BudgetLevel.MEDIUM, ResistanceLevel.MEDIUM, MaintenanceLevel.MEDIUM, "Modern",
                ResistanceLevel.MEDIUM, ResistanceLevel.MEDIUM, ResistanceLevel.MEDIUM,
                ResistanceLevel.MEDIUM, ResistanceLevel.MEDIUM);
        Map<String, String> answersMap = Map.of("traffic", "low");
        UserAnswers answers = new UserAnswers("Flooring Solution", answersMap);
        double oldScore = usageStrategy.evaluate(product, answers);
        Rule usageRule = replicaRules.stream()
                .filter(r -> r.getName().equals("Usage Match")).findFirst().orElseThrow();
        double newScore = evaluateSingleRule(usageRule, product, answersMap);
        assertEquals(7.0, oldScore, 0.01);
        assertEquals(oldScore, newScore, 0.01);
    }

    @Test
    @DisplayName("Usage: wall_usage=kitchen → avg(waterRes, heatRes)")
    void usageWallKitchen() {
        for (ResistanceLevel water : ResistanceLevel.values()) {
            for (ResistanceLevel heat : ResistanceLevel.values()) {
                Product product = buildProduct(BudgetLevel.MEDIUM, ResistanceLevel.MEDIUM, MaintenanceLevel.MEDIUM, "Modern",
                        water, ResistanceLevel.MEDIUM, heat,
                        ResistanceLevel.MEDIUM, ResistanceLevel.MEDIUM);
                Map<String, String> answersMap = Map.of("wall_usage", "kitchen");
                UserAnswers answers = new UserAnswers("Wall Solution", answersMap);
                double oldScore = usageStrategy.evaluate(product, answers);
                Rule usageRule = replicaRules.stream()
                        .filter(r -> r.getName().equals("Usage Match")).findFirst().orElseThrow();
                double newScore = evaluateSingleRule(usageRule, product, answersMap);
                assertEquals(oldScore, newScore, 0.01,
                        String.format("USAGE/wall-kitchen MISMATCH: water=%s, heat=%s → old=%.1f, new=%.1f",
                                water, heat, oldScore, newScore));
            }
        }
    }

    @Test
    @DisplayName("Usage: wall_usage=bathroom → waterResistance only")
    void usageWallBathroom() {
        for (ResistanceLevel water : ResistanceLevel.values()) {
            Product product = buildProduct(BudgetLevel.MEDIUM, ResistanceLevel.MEDIUM, MaintenanceLevel.MEDIUM, "Modern",
                    water, ResistanceLevel.MEDIUM, ResistanceLevel.MEDIUM,
                    ResistanceLevel.MEDIUM, ResistanceLevel.MEDIUM);
            Map<String, String> answersMap = Map.of("wall_usage", "bathroom");
            UserAnswers answers = new UserAnswers("Wall Solution", answersMap);
            double oldScore = usageStrategy.evaluate(product, answers);
            Rule usageRule = replicaRules.stream()
                    .filter(r -> r.getName().equals("Usage Match")).findFirst().orElseThrow();
            double newScore = evaluateSingleRule(usageRule, product, answersMap);
            assertEquals(oldScore, newScore, 0.01,
                    String.format("USAGE/wall-bath MISMATCH: water=%s → old=%.1f, new=%.1f",
                            water, oldScore, newScore));
        }
    }

    @Test
    @DisplayName("Usage: wall_usage=living room → 7.0")
    void usageWallLiving() {
        Product product = buildProduct(BudgetLevel.MEDIUM, ResistanceLevel.MEDIUM, MaintenanceLevel.MEDIUM, "Modern",
                ResistanceLevel.MEDIUM, ResistanceLevel.MEDIUM, ResistanceLevel.MEDIUM,
                ResistanceLevel.MEDIUM, ResistanceLevel.MEDIUM);
        Map<String, String> answersMap = Map.of("wall_usage", "living room");
        UserAnswers answers = new UserAnswers("Wall Solution", answersMap);
        double oldScore = usageStrategy.evaluate(product, answers);
        Rule usageRule = replicaRules.stream()
                .filter(r -> r.getName().equals("Usage Match")).findFirst().orElseThrow();
        double newScore = evaluateSingleRule(usageRule, product, answersMap);
        assertEquals(7.0, oldScore, 0.01);
        assertEquals(oldScore, newScore, 0.01);
    }

    // ═════════════════════════════════════════════════════════════════════════
    // 7. FULL SCENARIO: Realistic combinations per category
    // ═════════════════════════════════════════════════════════════════════════

    @Test
    @DisplayName("Full Roofing scenario: coastal, keep house cool, Modern, LOW budget")
    void fullRoofingScenario() {
        Product product = buildProduct(BudgetLevel.LOW, ResistanceLevel.MEDIUM, MaintenanceLevel.LOW, "Modern",
                ResistanceLevel.HIGH, ResistanceLevel.HIGH, ResistanceLevel.MEDIUM,
                ResistanceLevel.LOW, ResistanceLevel.LOW);

        Map<String, String> answersMap = Map.of(
                "budget", "LOW",
                "location", "coastal",
                "concern", "keep house cool",
                "style", "Modern",
                "maintenance", "LOW"
        );
        UserAnswers answers = new UserAnswers("Roofing Solution", answersMap);

        printComparison("ROOFING", product, answers, answersMap);
    }

    @Test
    @DisplayName("Full Flooring scenario: bathroom, high traffic, Marble, HIGH budget")
    void fullFlooringScenario() {
        Product product = buildProduct(BudgetLevel.HIGH, ResistanceLevel.HIGH, MaintenanceLevel.LOW, "Marble",
                ResistanceLevel.HIGH, ResistanceLevel.HIGH, ResistanceLevel.HIGH,
                ResistanceLevel.HIGH, ResistanceLevel.LOW);

        Map<String, String> answersMap = Map.of(
                "budget", "HIGH",
                "flooring_usage", "bathroom/wet area",
                "traffic", "high",
                "slip_resistance", "yes",
                "style", "Marble",
                "maintenance", "LOW"
        );
        UserAnswers answers = new UserAnswers("Flooring Solution", answersMap);

        printComparison("FLOORING", product, answers, answersMap);
    }

    @Test
    @DisplayName("Full Wall scenario: kitchen, humid, Traditional, MEDIUM budget")
    void fullWallScenario() {
        Product product = buildProduct(BudgetLevel.MEDIUM, ResistanceLevel.MEDIUM, MaintenanceLevel.MEDIUM, "Traditional",
                ResistanceLevel.HIGH, ResistanceLevel.MEDIUM, ResistanceLevel.MEDIUM,
                ResistanceLevel.MEDIUM, ResistanceLevel.MEDIUM);

        Map<String, String> answersMap = Map.of(
                "budget", "MEDIUM",
                "wall_usage", "kitchen",
                "environment", "humid",
                "priority", "easy to clean",
                "style", "Traditional",
                "maintenance", "MEDIUM"
        );
        UserAnswers answers = new UserAnswers("Wall Solution", answersMap);

        printComparison("WALL", product, answers, answersMap);
    }

    @Test
    @DisplayName("Full Ceiling scenario: heat reduction goal, Industrial, LOW budget")
    void fullCeilingScenario() {
        Product product = buildProduct(BudgetLevel.LOW, ResistanceLevel.MEDIUM, MaintenanceLevel.LOW, "Industrial",
                ResistanceLevel.HIGH, ResistanceLevel.HIGH, ResistanceLevel.MEDIUM,
                ResistanceLevel.LOW, ResistanceLevel.HIGH);

        Map<String, String> answersMap = Map.of(
                "budget", "LOW",
                "goal", "sound insulation",
                "style", "Industrial",
                "maintenance", "LOW"
        );
        UserAnswers answers = new UserAnswers("Ceiling Solution", answersMap);

        printComparison("CEILING", product, answers, answersMap);
    }

    @Test
    @DisplayName("Full Accessories scenario: outdoor, long-lasting, Modern, MEDIUM budget")
    void fullAccessoriesScenario() {
        Product product = buildProduct(BudgetLevel.MEDIUM, ResistanceLevel.HIGH, MaintenanceLevel.LOW, "Modern",
                ResistanceLevel.MEDIUM, ResistanceLevel.HIGH, ResistanceLevel.MEDIUM,
                ResistanceLevel.LOW, ResistanceLevel.LOW);

        Map<String, String> answersMap = Map.of(
                "budget", "MEDIUM",
                "usage_environment", "outdoor",
                "priority", "long-lasting",
                "style", "Modern",
                "maintenance", "LOW"
        );
        UserAnswers answers = new UserAnswers("Accessories", answersMap);

        printComparison("ACCESSORIES", product, answers, answersMap);
    }

    // ═════════════════════════════════════════════════════════════════════════
    // Helper: print side-by-side comparison for a full scenario
    // ═════════════════════════════════════════════════════════════════════════

    private void printComparison(String category, Product product, UserAnswers answers,
                                  Map<String, String> answersMap) {
        System.out.println("\n══════════════════════════════════════════════");
        System.out.printf("  %s CATEGORY COMPARISON%n", category);
        System.out.println("══════════════════════════════════════════════");
        System.out.println("Answers: " + answersMap);
        System.out.println("Product: budget=" + product.getAttribute().getBudgetLevel()
                + ", dur=" + product.getAttribute().getDurabilityRating()
                + ", style=" + product.getAttribute().getStyle()
                + ", waterRes=" + product.getAttribute().getWaterResistance()
                + ", corrRes=" + product.getAttribute().getCorrosionResistance()
                + ", heatRes=" + product.getAttribute().getHeatResistance()
                + ", slipRes=" + product.getAttribute().getSlipResistance()
                + ", noiseRed=" + product.getAttribute().getNoiseReduction()
                + ", maint=" + product.getAttribute().getMaintenanceLevel());
        System.out.println("──────────────────────────────────────────────");
        System.out.printf("%-20s %10s %10s %s%n", "STRATEGY", "OLD", "NEW", "MATCH?");
        System.out.println("──────────────────────────────────────────────");

        // Budget
        double oldBudget = budgetStrategy.evaluate(product, answers);
        double newBudget = evaluateSingleRule(findRule("Budget Match"), product, answersMap);
        printRow("Budget", oldBudget, newBudget);

        // Environment
        double oldEnv = environmentStrategy.evaluate(product, answers);
        double newEnv = evaluateSingleRule(findRule("Environment Match"), product, answersMap);
        printRow("Environment", oldEnv, newEnv);

        // Performance
        double oldPerf = performanceStrategy.evaluate(product, answers);
        double newPerf = evaluateSingleRule(findRule("Performance Match"), product, answersMap);
        printRow("Performance", oldPerf, newPerf);

        // Style
        double oldStyle = styleStrategy.evaluate(product, answers);
        double newStyle = evaluateSingleRule(findRule("Style Match"), product, answersMap);
        printRow("Style", oldStyle, newStyle);

        // Maintenance
        double oldMaint = maintenanceStrategy.evaluate(product, answers);
        double newMaint = evaluateSingleRule(findRule("Maintenance Match"), product, answersMap);
        printRow("Maintenance", oldMaint, newMaint);

        // Usage
        double oldUsage = usageStrategy.evaluate(product, answers);
        double newUsage = evaluateSingleRule(findRule("Usage Match"), product, answersMap);
        printRow("Usage", oldUsage, newUsage);

        System.out.println("══════════════════════════════════════════════\n");
    }

    private void printRow(String name, double old, double _new) {
        boolean match = Math.abs(old - _new) < 0.01;
        System.out.printf("%-20s %10.2f %10.2f %s%n", name, old, _new, match ? "  ✅" : "  ❌ MISMATCH");
    }

    // ═════════════════════════════════════════════════════════════════════════
    // Rule building: exact replicas of hardcoded strategies
    // ═════════════════════════════════════════════════════════════════════════

    /**
     * Builds rules that EXACTLY replicate the old hardcoded strategies.
     *
     * Key differences to match:
     * - Old scoreResistance: HIGH=10, MEDIUM=6, LOW=2  (NOT 10/5/2!)
     * - Old budget/maintenance rank deviation: exact=10, 1-off=5, 2-off=2
     * - Old style: exact=10, compatible=6, mismatch=2
     * - Old environment: checks location FIRST, then environment, then usage_environment
     */
    private List<Rule> buildReplicaRules() {
        List<Rule> rules = new ArrayList<>();

        // ═══ BUDGET (exact replica: rank deviation 10/5/2) ═══
        Rule budget = makeRule("Budget Match", RulePriority.HIGH, 5.0);
        leveled(budget, "budget", "LOW",    "budgetLevel", "LOW",    10.0, 5.0, 2.0, 5.0);
        leveled(budget, "budget", "MEDIUM", "budgetLevel", "MEDIUM", 10.0, 5.0, 2.0, 5.0);
        leveled(budget, "budget", "HIGH",   "budgetLevel", "HIGH",   10.0, 5.0, 2.0, 5.0);
        rules.add(budget);

        // ═══ ENVIRONMENT (exact replica: scoreResistance=10/6/2) ═══
        // Old code checks location first, then environment, then usage_environment
        // We replicate with LEVELED (10/6/2 deviation) matching exact scoreResistance
        Rule env = makeRule("Environment Match", RulePriority.HIGH, 5.0);
        // location=coastal → corrosionResistance: HIGH=10, MEDIUM=6, LOW=2
        leveled(env, "location", "coastal",     "corrosionResistance", "HIGH", 10.0, 6.0, 2.0, 3.0);
        // location=heavy rain → waterResistance
        leveled(env, "location", "heavy rain",  "waterResistance",     "HIGH", 10.0, 6.0, 2.0, 3.0);
        // location=hot/dry → heatResistance
        leveled(env, "location", "hot/dry",     "heatResistance",      "HIGH", 10.0, 6.0, 2.0, 3.0);
        // location=urban → fixed 7.0
        fixed(env, "location", "urban", 7.0);
        // environment=humid → waterResistance
        leveled(env, "environment", "humid",    "waterResistance",     "HIGH", 10.0, 6.0, 2.0, 3.0);
        // environment=dry → heatResistance
        leveled(env, "environment", "dry",      "heatResistance",      "HIGH", 10.0, 6.0, 2.0, 3.0);
        // usage_environment=outdoor → avg(waterRes, corrosionRes), each scored 10/6/2
        leveled(env, "usage_environment", "outdoor", "waterResistance",     "HIGH", 10.0, 6.0, 2.0, 3.0);
        leveled(env, "usage_environment", "outdoor", "corrosionResistance", "HIGH", 10.0, 6.0, 2.0, 3.0);
        fixed(env, "usage_environment", "indoor", 7.0);
        rules.add(env);

        // ═══ PERFORMANCE (exact replica) ═══
        Rule perf = makeRule("Performance Match", RulePriority.HIGH, 5.0);
        // concern=keep house cool → heatResistance (10/6/2)
        leveled(perf, "concern", "keep house cool", "heatResistance",  "HIGH", 10.0, 6.0, 2.0, 3.0);
        leveled(perf, "concern", "long-lasting",    "durabilityRating", "HIGH",  10.0, 6.0, 2.0, 3.0);
        // concern=reduce noise → noiseReduction (10/6/2)
        leveled(perf, "concern", "reduce noise",    "noiseReduction",   "HIGH", 10.0, 6.0, 2.0, 3.0);
        // priority=long-lasting → same as concern
        leveled(perf, "priority", "long-lasting",   "durabilityRating", "HIGH",  10.0, 6.0, 2.0, 3.0);
        // priority=easy to clean → waterResistance (10/6/2)
        leveled(perf, "priority", "easy to clean",  "waterResistance",  "HIGH", 10.0, 6.0, 2.0, 3.0);
        // goal=heat reduction → heatResistance (10/6/2)
        leveled(perf, "goal", "heat reduction",     "heatResistance",   "HIGH", 10.0, 6.0, 2.0, 3.0);
        // goal=sound insulation → noiseReduction (10/6/2)
        leveled(perf, "goal", "sound insulation",   "noiseReduction",   "HIGH", 10.0, 6.0, 2.0, 3.0);
        fixed(perf, "goal", "appearance", 7.0);
        fixed(perf, "goal", "hide wiring", 7.0);
        // slip_resistance=yes → slipResistance (10/6/2)
        leveled(perf, "slip_resistance", "yes",     "slipResistance",   "HIGH", 10.0, 6.0, 2.0, 3.0);
        // slip_resistance=no → 7.0
        fixed(perf, "slip_resistance", "no", 7.0);
        rules.add(perf);

        // ═══ STYLE (exact replica: match=10, compatible=6, mismatch=2) ═══
        // Old code does BOTH substring matching AND compatibility groups.
        // New CATEGORICAL does substring matching too, so exact matches work.
        Rule style = makeRule("Style Match", RulePriority.MEDIUM, 5.0);
        categorical(style, "style", "MODERN", "style", "MODERN,MINIMAL,INDUSTRIAL", 10.0, 2.0, 3.0);
        categorical(style, "style", "MINIMAL", "style", "MINIMAL,MODERN,INDUSTRIAL", 10.0, 2.0, 3.0);
        categorical(style, "style", "INDUSTRIAL", "style", "INDUSTRIAL,MODERN,MINIMAL", 10.0, 2.0, 3.0);
        categorical(style, "style", "TRADITIONAL", "style", "TRADITIONAL,RUSTIC", 10.0, 2.0, 3.0);
        categorical(style, "style", "RUSTIC", "style", "RUSTIC,TRADITIONAL", 10.0, 2.0, 3.0);
        categorical(style, "style", "NATURAL", "style", "NATURAL,WOODEN,MARBLE,TEXTURED", 10.0, 2.0, 3.0);
        categorical(style, "style", "WOODEN", "style", "WOODEN,NATURAL,MARBLE,TEXTURED", 10.0, 2.0, 3.0);
        categorical(style, "style", "MARBLE", "style", "MARBLE,NATURAL,WOODEN,TEXTURED", 10.0, 2.0, 3.0);
        categorical(style, "style", "TEXTURED", "style", "TEXTURED,NATURAL,WOODEN,MARBLE", 10.0, 2.0, 3.0);
        rules.add(style);

        // ═══ MAINTENANCE (exact replica: rank deviation 10/5/2) ═══
        Rule maint = makeRule("Maintenance Match", RulePriority.LOW, 5.0);
        leveled(maint, "maintenance", "LOW",    "maintenanceLevel", "LOW",    10.0, 5.0, 2.0, 5.0);
        leveled(maint, "maintenance", "MEDIUM", "maintenanceLevel", "MEDIUM", 10.0, 5.0, 2.0, 5.0);
        leveled(maint, "maintenance", "HIGH",   "maintenanceLevel", "HIGH",   10.0, 5.0, 2.0, 5.0);
        rules.add(maint);

        // ═══ USAGE (exact replica) ═══
        Rule usage = makeRule("Usage Match", RulePriority.LOW, 5.0);
        // flooring_usage=bathroom → avg(waterRes 10/6/2, slipRes 10/6/2)
        leveled(usage, "flooring_usage", "bathroom/wet area", "waterResistance", "HIGH", 10.0, 6.0, 2.0, 3.0);
        leveled(usage, "flooring_usage", "bathroom/wet area", "slipResistance",  "HIGH", 10.0, 6.0, 2.0, 3.0);
        // flooring_usage=outdoor → avg(waterRes, heatRes)
        leveled(usage, "flooring_usage", "outdoor", "waterResistance", "HIGH", 10.0, 6.0, 2.0, 3.0);
        leveled(usage, "flooring_usage", "outdoor", "heatResistance",  "HIGH", 10.0, 6.0, 2.0, 3.0);
        // flooring_usage=living/bedroom → 7.0
        fixed(usage, "flooring_usage", "living/bedroom", 7.0);
        // traffic=high → durabilityRating (now enum, exact match with LEVELED)
        leveled(usage, "traffic", "high",   "durabilityRating", "HIGH",   10.0, 6.0, 2.0, 3.0);
        leveled(usage, "traffic", "medium", "durabilityRating", "MEDIUM", 10.0, 6.0, 2.0, 3.0);
        // traffic=low → 7.0
        fixed(usage, "traffic", "low", 7.0);
        // wall_usage=kitchen → avg(waterRes, heatRes)
        leveled(usage, "wall_usage", "kitchen", "waterResistance", "HIGH", 10.0, 6.0, 2.0, 3.0);
        leveled(usage, "wall_usage", "kitchen", "heatResistance",  "HIGH", 10.0, 6.0, 2.0, 3.0);
        // wall_usage=bathroom → waterResistance only
        leveled(usage, "wall_usage", "bathroom", "waterResistance", "HIGH", 10.0, 6.0, 2.0, 3.0);
        fixed(usage, "wall_usage", "living room", 7.0);
        // accessory_type
        leveled(usage, "accessory_type", "installation", "durabilityRating", "HIGH", 10.0, 6.0, 2.0, 3.0);
        fixed(usage, "accessory_type", "finishing", 7.0);
        fixed(usage, "accessory_type", "decorative", 6.0);
        // usage_duration
        leveled(usage, "usage_duration", "long-term", "durabilityRating", "HIGH", 10.0, 6.0, 2.0, 3.0);
        fixed(usage, "usage_duration", "one-time", 7.0);
        // room_type
        leveled(usage, "room_type", "kitchen", "heatResistance", "HIGH", 10.0, 6.0, 2.0, 3.0);
        leveled(usage, "room_type", "office", "noiseReduction", "HIGH", 10.0, 6.0, 2.0, 3.0);
        fixed(usage, "room_type", "living room", 7.0);
        fixed(usage, "room_type", "bedroom", 7.0);
        rules.add(usage);

        return rules;
    }

    // ═════════════════════════════════════════════════════════════════════════
    // Rule engine helper: evaluate a single rule for a product
    // ═════════════════════════════════════════════════════════════════════════

    private double evaluateSingleRule(Rule rule, Product product, Map<String, String> normalizedAnswers) {
        // Use reflection-free approach: directly invoke the rule engine's evaluation logic
        // We set up a mock repository that returns only the single rule
        RuleRepository singleRuleMock = mock(RuleRepository.class);
        when(singleRuleMock.findByRuleStatus(RuleStatus.ACTIVE)).thenReturn(List.of(rule));
        DynamicRuleEngine engine = new DynamicRuleEngine(singleRuleMock);

        List<AdjustedProductScore> results = engine.scoreProducts(List.of(product), normalizedAnswers, 1);
        return results.isEmpty() ? 0.0 : results.get(0).getStrategyScore();
    }

    private Rule findRule(String name) {
        return replicaRules.stream().filter(r -> r.getName().equals(name)).findFirst().orElseThrow();
    }

    // ═════════════════════════════════════════════════════════════════════════
    // Product builders
    // ═════════════════════════════════════════════════════════════════════════

    private Product buildProduct(BudgetLevel budget, ResistanceLevel durability, MaintenanceLevel maintenance,
                                  String style, ResistanceLevel waterRes, ResistanceLevel corrRes,
                                  ResistanceLevel heatRes, ResistanceLevel slipRes, ResistanceLevel noiseRed) {
        Product product = new Product();
        product.setId(1L);
        product.setName("Test Product");
        product.setBasePrice(BigDecimal.valueOf(100));
        product.setIsActive(true);

        Category cat = new Category();
        cat.setId(1L);
        cat.setName("Test Category");
        product.setCategory(cat);

        ProductAttribute attr = ProductAttribute.builder()
                .product(product)
                .budgetLevel(budget)
                .durabilityRating(durability)
                .maintenanceLevel(maintenance)
                .style(style)
                .waterResistance(waterRes)
                .corrosionResistance(corrRes)
                .heatResistance(heatRes)
                .slipResistance(slipRes)
                .noiseReduction(noiseRed)
                .climateSuitability(ClimateSuitability.ALL)
                .material(Material.STEEL)
                .build();

        product.setAttribute(attr);
        return product;
    }

    private Product buildProductWithEnvAttributes(ResistanceLevel corrosion, ResistanceLevel water,
                                                    ResistanceLevel heat) {
        return buildProduct(BudgetLevel.MEDIUM, ResistanceLevel.MEDIUM, MaintenanceLevel.MEDIUM, "Modern",
                water, corrosion, heat, ResistanceLevel.MEDIUM, ResistanceLevel.MEDIUM);
    }

    // ═════════════════════════════════════════════════════════════════════════
    // Rule construction helpers
    // ═════════════════════════════════════════════════════════════════════════

    private Rule makeRule(String name, RulePriority priority, double defaultScore) {
        Rule r = new Rule();
        r.setId((long) name.hashCode());
        r.setName(name);
        r.setDescription("Replica of old " + name);
        r.setRuleType(RuleType.CONDITIONAL_MATCH);
        r.setRuleStatus(RuleStatus.ACTIVE);
        r.setRulePriority(priority);
        r.setDefaultScore(defaultScore);
        return r;
    }

    private void leveled(Rule rule, String answerKey, String answerValue,
                          String productAttribute, String idealLevel,
                          double exact, double dev1, double dev2, double noData) {
        AnswerAttributeMapping m = new AnswerAttributeMapping();
        m.setAnswerKey(answerKey);
        m.setAnswerValue(answerValue);
        m.setProductAttribute(productAttribute);
        m.setScoringMode(ScoringMode.LEVELED);
        m.setIdealLevel(idealLevel);
        m.setExactMatchScore(exact);
        m.setDeviation1Score(dev1);
        m.setDeviation2Score(dev2);
        m.setNoDataScore(noData);
        rule.addMapping(m);
    }

    private void categorical(Rule rule, String answerKey, String answerValue,
                              String productAttribute, String idealLevel,
                              double matchScore, double noMatchScore, double noData) {
        AnswerAttributeMapping m = new AnswerAttributeMapping();
        m.setAnswerKey(answerKey);
        m.setAnswerValue(answerValue);
        m.setProductAttribute(productAttribute);
        m.setScoringMode(ScoringMode.CATEGORICAL);
        m.setIdealLevel(idealLevel);
        m.setMatchScore(matchScore);
        m.setNoMatchScore(noMatchScore);
        m.setNoDataScore(noData);
        rule.addMapping(m);
    }

    private void fixed(Rule rule, String answerKey, String answerValue, double score) {
        AnswerAttributeMapping m = new AnswerAttributeMapping();
        m.setAnswerKey(answerKey);
        m.setAnswerValue(answerValue);
        m.setScoringMode(ScoringMode.FIXED);
        m.setFixedScore(score);
        m.setNoDataScore(3.0);
        rule.addMapping(m);
    }
}
