package com.constructionplatform.app.config;

import com.constructionplatform.app.entity.Brand;
import com.constructionplatform.app.entity.Category;
import com.constructionplatform.app.entity.Product;
import com.constructionplatform.app.entity.ProductAttribute;
import com.constructionplatform.app.entity.ProductAttribute.*;
import com.constructionplatform.app.enums.Role;
import com.constructionplatform.app.entity.Rule;
import com.constructionplatform.app.entity.RuleCondition;
import com.constructionplatform.app.entity.User;
import com.constructionplatform.app.enums.*;
import com.constructionplatform.app.repository.BrandRepository;
import com.constructionplatform.app.repository.CategoryRepository;
import com.constructionplatform.app.repository.ProductRepository;
import com.constructionplatform.app.repository.RuleRepository;
import com.constructionplatform.app.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Component
public class DataSeeder implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private static final List<String> BASE_CATEGORIES = List.of(
            "Roofing Solution",
            "Flooring Solution",
            "Ceiling Solution",
            "Wall Solution",
            "Accessories");

    private static final List<String> BASE_BRANDS = List.of(
            "PE+",
            "SIVILIMA",
            "Gfloor",
            "AntonRoofing",
            "Other");

    private static final List<String> DEPRECATED_BRANDS = List.of(
            "Asian Paints",
            "Saint-Gobain",
            "UltraTech Cement",
            "Kajaria Ceramics",
            "Berger Paints");

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;
    private final ProductRepository productRepository;
    private final RuleRepository ruleRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.seed.admin-email:admin@platform.com}")
    private String adminEmail;

    @Value("${app.seed.admin-password:Admin@1234}")
    private String adminPassword;

    public DataSeeder(UserRepository userRepository,
            CategoryRepository categoryRepository,
            BrandRepository brandRepository,
            ProductRepository productRepository,
            RuleRepository ruleRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.brandRepository = brandRepository;
        this.productRepository = productRepository;
        this.ruleRepository = ruleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        seedAdminUser();
        seedCategories();
        removeDeprecatedBrands();
        seedBrands();
        seedDemoProducts();
        seedSampleRules();
    }

    private void seedAdminUser() {
        if (userRepository.existsByEmail(adminEmail)) {
            log.info("DataSeeder: Admin [{}] already exists — skipping.", adminEmail);
            return;
        }
        User admin = User.builder()
                .email(adminEmail)
                .passwordHash(passwordEncoder.encode(adminPassword))
                .role(Role.ADMIN)
                .build();
        userRepository.save(admin);
        log.info("DataSeeder: Default Admin account created → email=[{}]", adminEmail);
    }

    private void seedCategories() {
        for (String name : BASE_CATEGORIES) {
            if (categoryRepository.existsByName(name)) {
                log.debug("DataSeeder: Category '{}' already exists — skipping.", name);
            } else {
                categoryRepository.save(Category.builder().name(name).build());
                log.info("DataSeeder: Category '{}' created.", name);
            }
        }
    }

    private void removeDeprecatedBrands() {
        if (productRepository.count() > 0) {
            log.debug("DataSeeder: Products exist — skipping deprecated brand cleanup.");
            return;
        }
        for (String name : DEPRECATED_BRANDS) {
            brandRepository.findByName(name).ifPresent(brand -> {
                brandRepository.delete(brand);
                log.info("DataSeeder: Removed deprecated brand '{}'.", name);
            });
        }
    }

    private void seedBrands() {
        for (String name : BASE_BRANDS) {
            if (brandRepository.existsByName(name)) {
                log.debug("DataSeeder: Brand '{}' already exists — skipping.", name);
            } else {
                brandRepository.save(Brand.builder().name(name).build());
                log.info("DataSeeder: Brand '{}' created.", name);
            }
        }
    }

    private void seedDemoProducts() {
        long existing = productRepository.count();
        if (existing > 0) {
            log.info("DataSeeder: Products already exist (count={}) — skipping.", existing);
            return;
        }

        List<Category> categories = categoryRepository.findAll();
        List<Brand> brands = brandRepository.findAll();
        if (categories.isEmpty() || brands.isEmpty()) {
            log.warn("DataSeeder: Cannot seed — categories or brands missing.");
            return;
        }

        int created = 0;
        for (Category cat : categories) {
            String catName = cat.getName();
            switch (catName) {
                case "Roofing Solution" -> created += seedRoofingProducts(cat, brands);
                case "Flooring Solution" -> created += seedFlooringProducts(cat, brands);
                case "Wall Solution" -> created += seedWallProducts(cat, brands);
                case "Ceiling Solution" -> created += seedCeilingProducts(cat, brands);
                case "Accessories" -> created += seedAccessoriesProducts(cat, brands);
                default -> log.warn("DataSeeder: Unknown category '{}'", catName);
            }
        }
        log.info("DataSeeder: Seeded {} realistic demo products.", created);
    }

    // ── Roofing Products ─────────────────────────────────────────────────────

    private int seedRoofingProducts(Category cat, List<Brand> brands) {
        Object[][] data = {
            // name, price, budget, durability, climate, maintenance, style, material,
            // waterRes, corrosionRes, heatRes, slipRes, noiseRed
            {"Metal Sheet Roofing", 120, BudgetLevel.LOW, 6, ClimateSuitability.ALL, MaintenanceLevel.LOW, "Industrial", Material.STEEL,
             ResistanceLevel.HIGH, ResistanceLevel.MEDIUM, ResistanceLevel.LOW, ResistanceLevel.LOW, ResistanceLevel.LOW},
            {"Clay Tile Roof", 350, BudgetLevel.MEDIUM, 8, ClimateSuitability.TROPICAL, MaintenanceLevel.MEDIUM, "Traditional", Material.CERAMIC,
             ResistanceLevel.HIGH, ResistanceLevel.HIGH, ResistanceLevel.HIGH, ResistanceLevel.MEDIUM, ResistanceLevel.MEDIUM},
            {"Asphalt Shingle Roof", 200, BudgetLevel.LOW, 5, ClimateSuitability.TEMPERATE, MaintenanceLevel.LOW, "Modern", Material.OTHER,
             ResistanceLevel.MEDIUM, ResistanceLevel.LOW, ResistanceLevel.MEDIUM, ResistanceLevel.LOW, ResistanceLevel.MEDIUM},
            {"Concrete Flat Roof", 450, BudgetLevel.MEDIUM, 9, ClimateSuitability.ALL, MaintenanceLevel.LOW, "Modern", Material.CONCRETE,
             ResistanceLevel.HIGH, ResistanceLevel.HIGH, ResistanceLevel.HIGH, ResistanceLevel.MEDIUM, ResistanceLevel.HIGH},
            {"Polycarbonate Roof Sheet", 180, BudgetLevel.LOW, 4, ClimateSuitability.TROPICAL, MaintenanceLevel.LOW, "Modern", Material.PVC,
             ResistanceLevel.MEDIUM, ResistanceLevel.HIGH, ResistanceLevel.LOW, ResistanceLevel.LOW, ResistanceLevel.LOW},
            {"Premium Copper Roof", 800, BudgetLevel.HIGH, 10, ClimateSuitability.ALL, MaintenanceLevel.LOW, "Traditional", Material.OTHER,
             ResistanceLevel.HIGH, ResistanceLevel.HIGH, ResistanceLevel.HIGH, ResistanceLevel.MEDIUM, ResistanceLevel.MEDIUM},
            {"Aluminum Standing Seam", 550, BudgetLevel.HIGH, 9, ClimateSuitability.ALL, MaintenanceLevel.LOW, "Modern", Material.ALUMINUM,
             ResistanceLevel.HIGH, ResistanceLevel.HIGH, ResistanceLevel.MEDIUM, ResistanceLevel.LOW, ResistanceLevel.MEDIUM},
            {"Wooden Shingle Roof", 300, BudgetLevel.MEDIUM, 6, ClimateSuitability.TEMPERATE, MaintenanceLevel.HIGH, "Natural", Material.WOOD,
             ResistanceLevel.LOW, ResistanceLevel.LOW, ResistanceLevel.LOW, ResistanceLevel.LOW, ResistanceLevel.HIGH},
            {"Fiber Cement Roof", 250, BudgetLevel.MEDIUM, 7, ClimateSuitability.ALL, MaintenanceLevel.LOW, "Modern", Material.CONCRETE,
             ResistanceLevel.HIGH, ResistanceLevel.HIGH, ResistanceLevel.MEDIUM, ResistanceLevel.MEDIUM, ResistanceLevel.MEDIUM},
            {"Thatch Roof Panel", 160, BudgetLevel.LOW, 3, ClimateSuitability.TROPICAL, MaintenanceLevel.HIGH, "Natural", Material.OTHER,
             ResistanceLevel.LOW, ResistanceLevel.LOW, ResistanceLevel.HIGH, ResistanceLevel.LOW, ResistanceLevel.HIGH},
        };
        return seedProducts(cat, brands, data);
    }

    // ── Flooring Products ────────────────────────────────────────────────────

    private int seedFlooringProducts(Category cat, List<Brand> brands) {
        Object[][] data = {
            {"Ceramic Floor Tile", 80, BudgetLevel.LOW, 7, ClimateSuitability.ALL, MaintenanceLevel.LOW, "Modern", Material.CERAMIC,
             ResistanceLevel.HIGH, ResistanceLevel.MEDIUM, ResistanceLevel.MEDIUM, ResistanceLevel.MEDIUM, ResistanceLevel.LOW},
            {"Porcelain Floor Tile", 150, BudgetLevel.MEDIUM, 9, ClimateSuitability.ALL, MaintenanceLevel.LOW, "Modern", Material.CERAMIC,
             ResistanceLevel.HIGH, ResistanceLevel.HIGH, ResistanceLevel.HIGH, ResistanceLevel.HIGH, ResistanceLevel.LOW},
            {"Hardwood Flooring", 400, BudgetLevel.HIGH, 7, ClimateSuitability.TEMPERATE, MaintenanceLevel.HIGH, "Wooden", Material.WOOD,
             ResistanceLevel.LOW, ResistanceLevel.LOW, ResistanceLevel.LOW, ResistanceLevel.LOW, ResistanceLevel.MEDIUM},
            {"Vinyl Plank Flooring", 60, BudgetLevel.LOW, 5, ClimateSuitability.ALL, MaintenanceLevel.LOW, "Wooden", Material.PVC,
             ResistanceLevel.HIGH, ResistanceLevel.HIGH, ResistanceLevel.LOW, ResistanceLevel.MEDIUM, ResistanceLevel.MEDIUM},
            {"Natural Stone Floor", 500, BudgetLevel.HIGH, 10, ClimateSuitability.ALL, MaintenanceLevel.MEDIUM, "Marble", Material.OTHER,
             ResistanceLevel.MEDIUM, ResistanceLevel.MEDIUM, ResistanceLevel.HIGH, ResistanceLevel.LOW, ResistanceLevel.LOW},
            {"Laminate Flooring", 90, BudgetLevel.LOW, 4, ClimateSuitability.TEMPERATE, MaintenanceLevel.LOW, "Wooden", Material.OTHER,
             ResistanceLevel.LOW, ResistanceLevel.MEDIUM, ResistanceLevel.LOW, ResistanceLevel.LOW, ResistanceLevel.MEDIUM},
            {"Concrete Polished Floor", 200, BudgetLevel.MEDIUM, 9, ClimateSuitability.ALL, MaintenanceLevel.LOW, "Industrial", Material.CONCRETE,
             ResistanceLevel.HIGH, ResistanceLevel.HIGH, ResistanceLevel.HIGH, ResistanceLevel.MEDIUM, ResistanceLevel.LOW},
            {"Terracotta Floor Tile", 130, BudgetLevel.MEDIUM, 6, ClimateSuitability.TROPICAL, MaintenanceLevel.MEDIUM, "Rustic", Material.CERAMIC,
             ResistanceLevel.MEDIUM, ResistanceLevel.MEDIUM, ResistanceLevel.HIGH, ResistanceLevel.MEDIUM, ResistanceLevel.LOW},
            {"Rubber Flooring", 70, BudgetLevel.LOW, 6, ClimateSuitability.ALL, MaintenanceLevel.LOW, "Modern", Material.OTHER,
             ResistanceLevel.HIGH, ResistanceLevel.HIGH, ResistanceLevel.LOW, ResistanceLevel.HIGH, ResistanceLevel.HIGH},
            {"Marble Floor Tile", 600, BudgetLevel.HIGH, 8, ClimateSuitability.ALL, MaintenanceLevel.MEDIUM, "Marble", Material.OTHER,
             ResistanceLevel.LOW, ResistanceLevel.LOW, ResistanceLevel.MEDIUM, ResistanceLevel.LOW, ResistanceLevel.LOW},
        };
        return seedProducts(cat, brands, data);
    }

    // ── Wall Products ────────────────────────────────────────────────────────

    private int seedWallProducts(Category cat, List<Brand> brands) {
        Object[][] data = {
            {"PVC Wall Panel", 50, BudgetLevel.LOW, 5, ClimateSuitability.ALL, MaintenanceLevel.LOW, "Modern", Material.PVC,
             ResistanceLevel.HIGH, ResistanceLevel.HIGH, ResistanceLevel.LOW, ResistanceLevel.LOW, ResistanceLevel.LOW},
            {"Ceramic Wall Tile", 100, BudgetLevel.MEDIUM, 7, ClimateSuitability.ALL, MaintenanceLevel.LOW, "Modern", Material.CERAMIC,
             ResistanceLevel.HIGH, ResistanceLevel.MEDIUM, ResistanceLevel.MEDIUM, ResistanceLevel.MEDIUM, ResistanceLevel.LOW},
            {"Wooden Wall Cladding", 250, BudgetLevel.MEDIUM, 6, ClimateSuitability.TEMPERATE, MaintenanceLevel.HIGH, "Wooden", Material.WOOD,
             ResistanceLevel.LOW, ResistanceLevel.LOW, ResistanceLevel.LOW, ResistanceLevel.LOW, ResistanceLevel.MEDIUM},
            {"Brick Veneer Wall", 180, BudgetLevel.MEDIUM, 8, ClimateSuitability.ALL, MaintenanceLevel.LOW, "Textured", Material.BRICK,
             ResistanceLevel.MEDIUM, ResistanceLevel.MEDIUM, ResistanceLevel.HIGH, ResistanceLevel.MEDIUM, ResistanceLevel.MEDIUM},
            {"Glass Wall Panel", 400, BudgetLevel.HIGH, 6, ClimateSuitability.TEMPERATE, MaintenanceLevel.MEDIUM, "Modern", Material.GLASS,
             ResistanceLevel.HIGH, ResistanceLevel.HIGH, ResistanceLevel.LOW, ResistanceLevel.LOW, ResistanceLevel.LOW},
            {"Concrete Textured Wall", 120, BudgetLevel.LOW, 9, ClimateSuitability.ALL, MaintenanceLevel.LOW, "Industrial", Material.CONCRETE,
             ResistanceLevel.HIGH, ResistanceLevel.HIGH, ResistanceLevel.HIGH, ResistanceLevel.MEDIUM, ResistanceLevel.MEDIUM},
            {"Decorative Wallpaper", 40, BudgetLevel.LOW, 3, ClimateSuitability.TEMPERATE, MaintenanceLevel.MEDIUM, "Minimal", Material.OTHER,
             ResistanceLevel.LOW, ResistanceLevel.LOW, ResistanceLevel.LOW, ResistanceLevel.LOW, ResistanceLevel.LOW},
            {"Stone Wall Cladding", 350, BudgetLevel.HIGH, 9, ClimateSuitability.ALL, MaintenanceLevel.LOW, "Natural", Material.OTHER,
             ResistanceLevel.MEDIUM, ResistanceLevel.HIGH, ResistanceLevel.HIGH, ResistanceLevel.MEDIUM, ResistanceLevel.MEDIUM},
            {"Aluminum Composite Panel", 300, BudgetLevel.MEDIUM, 7, ClimateSuitability.ALL, MaintenanceLevel.LOW, "Modern", Material.ALUMINUM,
             ResistanceLevel.HIGH, ResistanceLevel.HIGH, ResistanceLevel.MEDIUM, ResistanceLevel.LOW, ResistanceLevel.LOW},
            {"Gypsum Plaster Wall", 80, BudgetLevel.LOW, 5, ClimateSuitability.TEMPERATE, MaintenanceLevel.MEDIUM, "Minimal", Material.OTHER,
             ResistanceLevel.LOW, ResistanceLevel.LOW, ResistanceLevel.LOW, ResistanceLevel.LOW, ResistanceLevel.MEDIUM},
        };
        return seedProducts(cat, brands, data);
    }

    // ── Ceiling Products ─────────────────────────────────────────────────────

    private int seedCeilingProducts(Category cat, List<Brand> brands) {
        Object[][] data = {
            {"PVC Ceiling Panel", 45, BudgetLevel.LOW, 5, ClimateSuitability.ALL, MaintenanceLevel.LOW, "Modern", Material.PVC,
             ResistanceLevel.HIGH, ResistanceLevel.HIGH, ResistanceLevel.LOW, ResistanceLevel.LOW, ResistanceLevel.LOW},
            {"Gypsum False Ceiling", 120, BudgetLevel.MEDIUM, 6, ClimateSuitability.TEMPERATE, MaintenanceLevel.MEDIUM, "Modern", Material.OTHER,
             ResistanceLevel.LOW, ResistanceLevel.LOW, ResistanceLevel.LOW, ResistanceLevel.LOW, ResistanceLevel.HIGH},
            {"Wooden Ceiling Panel", 280, BudgetLevel.MEDIUM, 7, ClimateSuitability.TEMPERATE, MaintenanceLevel.HIGH, "Traditional", Material.WOOD,
             ResistanceLevel.LOW, ResistanceLevel.LOW, ResistanceLevel.LOW, ResistanceLevel.LOW, ResistanceLevel.HIGH},
            {"Metal Grid Ceiling", 200, BudgetLevel.MEDIUM, 8, ClimateSuitability.ALL, MaintenanceLevel.LOW, "Industrial", Material.ALUMINUM,
             ResistanceLevel.HIGH, ResistanceLevel.HIGH, ResistanceLevel.MEDIUM, ResistanceLevel.LOW, ResistanceLevel.MEDIUM},
            {"Acoustic Ceiling Tile", 150, BudgetLevel.MEDIUM, 6, ClimateSuitability.ALL, MaintenanceLevel.LOW, "Minimal", Material.OTHER,
             ResistanceLevel.MEDIUM, ResistanceLevel.MEDIUM, ResistanceLevel.LOW, ResistanceLevel.LOW, ResistanceLevel.HIGH},
            {"Fiber Cement Board Ceiling", 100, BudgetLevel.LOW, 7, ClimateSuitability.ALL, MaintenanceLevel.LOW, "Modern", Material.CONCRETE,
             ResistanceLevel.HIGH, ResistanceLevel.HIGH, ResistanceLevel.MEDIUM, ResistanceLevel.LOW, ResistanceLevel.MEDIUM},
            {"Stretch Ceiling Film", 350, BudgetLevel.HIGH, 5, ClimateSuitability.ALL, MaintenanceLevel.LOW, "Modern", Material.PVC,
             ResistanceLevel.HIGH, ResistanceLevel.HIGH, ResistanceLevel.LOW, ResistanceLevel.LOW, ResistanceLevel.MEDIUM},
            {"Bamboo Ceiling Panel", 180, BudgetLevel.MEDIUM, 5, ClimateSuitability.TROPICAL, MaintenanceLevel.MEDIUM, "Natural", Material.WOOD,
             ResistanceLevel.LOW, ResistanceLevel.LOW, ResistanceLevel.LOW, ResistanceLevel.LOW, ResistanceLevel.MEDIUM},
            {"Mineral Fiber Ceiling", 90, BudgetLevel.LOW, 5, ClimateSuitability.ALL, MaintenanceLevel.LOW, "Minimal", Material.OTHER,
             ResistanceLevel.MEDIUM, ResistanceLevel.MEDIUM, ResistanceLevel.MEDIUM, ResistanceLevel.LOW, ResistanceLevel.HIGH},
            {"Glass Ceiling Panel", 500, BudgetLevel.HIGH, 6, ClimateSuitability.TEMPERATE, MaintenanceLevel.MEDIUM, "Modern", Material.GLASS,
             ResistanceLevel.HIGH, ResistanceLevel.HIGH, ResistanceLevel.LOW, ResistanceLevel.LOW, ResistanceLevel.LOW},
        };
        return seedProducts(cat, brands, data);
    }

    // ── Accessories Products ─────────────────────────────────────────────────

    private int seedAccessoriesProducts(Category cat, List<Brand> brands) {
        Object[][] data = {
            {"Stainless Steel Screws Pack", 15, BudgetLevel.LOW, 8, ClimateSuitability.ALL, MaintenanceLevel.LOW, "Industrial", Material.STEEL,
             ResistanceLevel.HIGH, ResistanceLevel.HIGH, ResistanceLevel.MEDIUM, ResistanceLevel.LOW, ResistanceLevel.LOW},
            {"Silicone Sealant Tube", 12, BudgetLevel.LOW, 5, ClimateSuitability.ALL, MaintenanceLevel.LOW, "Modern", Material.OTHER,
             ResistanceLevel.HIGH, ResistanceLevel.HIGH, ResistanceLevel.MEDIUM, ResistanceLevel.LOW, ResistanceLevel.LOW},
            {"Decorative Wall Hook Set", 25, BudgetLevel.LOW, 4, ClimateSuitability.ALL, MaintenanceLevel.LOW, "Modern", Material.STEEL,
             ResistanceLevel.MEDIUM, ResistanceLevel.MEDIUM, ResistanceLevel.LOW, ResistanceLevel.LOW, ResistanceLevel.LOW},
            {"Premium Door Handle", 80, BudgetLevel.MEDIUM, 7, ClimateSuitability.ALL, MaintenanceLevel.LOW, "Modern", Material.STEEL,
             ResistanceLevel.MEDIUM, ResistanceLevel.HIGH, ResistanceLevel.LOW, ResistanceLevel.LOW, ResistanceLevel.LOW},
            {"Edge Trim Profile", 18, BudgetLevel.LOW, 6, ClimateSuitability.ALL, MaintenanceLevel.LOW, "Minimal", Material.ALUMINUM,
             ResistanceLevel.MEDIUM, ResistanceLevel.HIGH, ResistanceLevel.MEDIUM, ResistanceLevel.LOW, ResistanceLevel.LOW},
            {"Heavy Duty Wall Anchors", 20, BudgetLevel.LOW, 9, ClimateSuitability.ALL, MaintenanceLevel.LOW, "Industrial", Material.STEEL,
             ResistanceLevel.HIGH, ResistanceLevel.HIGH, ResistanceLevel.MEDIUM, ResistanceLevel.LOW, ResistanceLevel.LOW},
            {"Brass Cabinet Knobs", 45, BudgetLevel.MEDIUM, 6, ClimateSuitability.ALL, MaintenanceLevel.MEDIUM, "Traditional", Material.OTHER,
             ResistanceLevel.MEDIUM, ResistanceLevel.MEDIUM, ResistanceLevel.LOW, ResistanceLevel.LOW, ResistanceLevel.LOW},
            {"Outdoor Waterproof Tape", 10, BudgetLevel.LOW, 3, ClimateSuitability.ALL, MaintenanceLevel.LOW, "Industrial", Material.OTHER,
             ResistanceLevel.HIGH, ResistanceLevel.HIGH, ResistanceLevel.MEDIUM, ResistanceLevel.LOW, ResistanceLevel.LOW},
            {"Designer Light Switch Plate", 35, BudgetLevel.MEDIUM, 5, ClimateSuitability.ALL, MaintenanceLevel.LOW, "Modern", Material.PVC,
             ResistanceLevel.MEDIUM, ResistanceLevel.MEDIUM, ResistanceLevel.LOW, ResistanceLevel.LOW, ResistanceLevel.LOW},
            {"Premium Grout Mix", 30, BudgetLevel.MEDIUM, 7, ClimateSuitability.ALL, MaintenanceLevel.LOW, "Minimal", Material.OTHER,
             ResistanceLevel.HIGH, ResistanceLevel.HIGH, ResistanceLevel.MEDIUM, ResistanceLevel.LOW, ResistanceLevel.LOW},
        };
        return seedProducts(cat, brands, data);
    }

    // ── Helper ───────────────────────────────────────────────────────────────

    private int seedProducts(Category cat, List<Brand> brands, Object[][] data) {
        int count = 0;
        for (int i = 0; i < data.length; i++) {
            Object[] d = data[i];
            Brand brand = brands.get(i % brands.size());

            Product product = Product.builder()
                    .category(cat)
                    .brand(brand)
                    .name((String) d[0])
                    .description("High-quality " + cat.getName().toLowerCase() + " product.")
                    .basePrice(BigDecimal.valueOf((Integer) d[1]))
                    .isActive(true)
                    .build();

            ProductAttribute attr = ProductAttribute.builder()
                    .product(product)
                    .budgetLevel((BudgetLevel) d[2])
                    .durabilityRating((Integer) d[3])
                    .climateSuitability((ClimateSuitability) d[4])
                    .maintenanceLevel((MaintenanceLevel) d[5])
                    .style((String) d[6])
                    .material((Material) d[7])
                    .waterResistance((ResistanceLevel) d[8])
                    .corrosionResistance((ResistanceLevel) d[9])
                    .heatResistance((ResistanceLevel) d[10])
                    .slipResistance((ResistanceLevel) d[11])
                    .noiseReduction((ResistanceLevel) d[12])
                    .build();

            product.setAttribute(attr);
            productRepository.save(product);
            count++;
        }
        return count;
    }
    // ── Sample Rules ─────────────────────────────────────────────────────────

    private void seedSampleRules() {
        if (ruleRepository.count() > 0) {
            log.info("DataSeeder: Rules already exist — skipping.");
            return;
        }

        // Sample Rule 1: Low Budget Match (SOFT_PREFERENCE + ADD_SCORE)
        Rule lowBudgetRule = new Rule();
        lowBudgetRule.setName("Low Budget Match");
        lowBudgetRule.setDescription("Add score to products when user selects low budget");
        lowBudgetRule.setRuleType(RuleType.SOFT_PREFERENCE);
        lowBudgetRule.setRuleStatus(RuleStatus.ACTIVE);
        lowBudgetRule.setTargetScope(TargetScope.GLOBAL);
        lowBudgetRule.setCombinationType(CombinationType.ALL);
        lowBudgetRule.setPriority(10);
        lowBudgetRule.setWeight(15);
        lowBudgetRule.setEffectType(EffectType.ADD_SCORE);
        lowBudgetRule.setEffectValue(10);

        RuleCondition budgetCondition = new RuleCondition();
        budgetCondition.setOperandSource(OperandSource.USER_INPUT);
        budgetCondition.setAttributeName("budget");
        budgetCondition.setOperator(ConditionOperator.EQUALS);
        budgetCondition.setExpectedValue("LOW");
        lowBudgetRule.addCondition(budgetCondition);

        ruleRepository.save(lowBudgetRule);
        log.info("DataSeeder: Sample rule 'Low Budget Match' created.");

        // Sample Rule 2: Coastal Climate Strict (HARD_CONSTRAINT + FILTER_OUT)
        Rule coastalRule = new Rule();
        coastalRule.setName("Coastal Climate Strict");
        coastalRule.setDescription("Exclude products not suitable for coastal climates");
        coastalRule.setRuleType(RuleType.HARD_CONSTRAINT);
        coastalRule.setRuleStatus(RuleStatus.ACTIVE);
        coastalRule.setTargetScope(TargetScope.GLOBAL);
        coastalRule.setCombinationType(CombinationType.ALL);
        coastalRule.setPriority(20);
        coastalRule.setWeight(0);
        coastalRule.setEffectType(EffectType.FILTER_OUT);
        coastalRule.setEffectValue(null);

        RuleCondition climateCondition = new RuleCondition();
        climateCondition.setOperandSource(OperandSource.USER_INPUT);
        climateCondition.setAttributeName("climate");
        climateCondition.setOperator(ConditionOperator.EQUALS);
        climateCondition.setExpectedValue("COASTAL");
        coastalRule.addCondition(climateCondition);

        RuleCondition corrosionCondition = new RuleCondition();
        corrosionCondition.setOperandSource(OperandSource.PRODUCT);
        corrosionCondition.setAttributeName("corrosionResistance");
        corrosionCondition.setOperator(ConditionOperator.EQUALS);
        corrosionCondition.setExpectedValue("LOW");
        coastalRule.addCondition(corrosionCondition);

        ruleRepository.save(coastalRule);
        log.info("DataSeeder: Sample rule 'Coastal Climate Strict' created.");
    }
}
