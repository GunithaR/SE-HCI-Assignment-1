package com.constructionplatform.app.config;

import com.constructionplatform.app.entity.*;
import com.constructionplatform.app.entity.ProductAttribute.*;
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
            log.info("DataSeeder: Admin [{}] already exists â€” skipping.", adminEmail);
            return;
        }
        User admin = User.builder()
                .email(adminEmail)
                .passwordHash(passwordEncoder.encode(adminPassword))
                .role(Role.ADMIN)
                .build();
        userRepository.save(admin);
        log.info("DataSeeder: Default Admin account created â†’ email=[{}]", adminEmail);
    }

    private void seedCategories() {
        for (String name : BASE_CATEGORIES) {
            if (categoryRepository.existsByName(name)) {
                log.debug("DataSeeder: Category '{}' already exists â€” skipping.", name);
            } else {
                categoryRepository.save(Category.builder().name(name).build());
                log.info("DataSeeder: Category '{}' created.", name);
            }
        }
    }

    private void removeDeprecatedBrands() {
        if (productRepository.count() > 0) {
            log.debug("DataSeeder: Products exist â€” skipping deprecated brand cleanup.");
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
                log.debug("DataSeeder: Brand '{}' already exists â€” skipping.", name);
            } else {
                brandRepository.save(Brand.builder().name(name).build());
                log.info("DataSeeder: Brand '{}' created.", name);
            }
        }
    }

    private void seedDemoProducts() {
        long existing = productRepository.count();
        if (existing > 0) {
            log.info("DataSeeder: Products already exist (count={}) â€” skipping.", existing);
            return;
        }

        List<Category> categories = categoryRepository.findAll();
        List<Brand> brands = brandRepository.findAll();
        if (categories.isEmpty() || brands.isEmpty()) {
            log.warn("DataSeeder: Cannot seed â€” categories or brands missing.");
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

    // â”€â”€ Roofing Products â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    private int seedRoofingProducts(Category cat, List<Brand> brands) {
        Object[][] data = {
            // name, price, budget, durability, climate, maintenance, style, material,
            // waterRes, corrosionRes, heatRes, slipRes, noiseRed
            {"Metal Sheet Roofing", 120, BudgetLevel.LOW, ResistanceLevel.MEDIUM, ClimateSuitability.ALL, MaintenanceLevel.LOW, "Industrial", Material.STEEL,
             ResistanceLevel.HIGH, ResistanceLevel.MEDIUM, ResistanceLevel.LOW, ResistanceLevel.LOW, ResistanceLevel.LOW},
            {"Clay Tile Roof", 350, BudgetLevel.MEDIUM, ResistanceLevel.HIGH, ClimateSuitability.TROPICAL, MaintenanceLevel.MEDIUM, "Traditional", Material.CERAMIC,
             ResistanceLevel.HIGH, ResistanceLevel.HIGH, ResistanceLevel.HIGH, ResistanceLevel.MEDIUM, ResistanceLevel.MEDIUM},
            {"Asphalt Shingle Roof", 200, BudgetLevel.LOW, ResistanceLevel.MEDIUM, ClimateSuitability.TEMPERATE, MaintenanceLevel.LOW, "Modern", Material.OTHER,
             ResistanceLevel.MEDIUM, ResistanceLevel.LOW, ResistanceLevel.MEDIUM, ResistanceLevel.LOW, ResistanceLevel.MEDIUM},
            {"Concrete Flat Roof", 450, BudgetLevel.MEDIUM, ResistanceLevel.HIGH, ClimateSuitability.ALL, MaintenanceLevel.LOW, "Modern", Material.CONCRETE,
             ResistanceLevel.HIGH, ResistanceLevel.HIGH, ResistanceLevel.HIGH, ResistanceLevel.MEDIUM, ResistanceLevel.HIGH},
            {"Polycarbonate Roof Sheet", 180, BudgetLevel.LOW, ResistanceLevel.LOW, ClimateSuitability.TROPICAL, MaintenanceLevel.LOW, "Modern", Material.PVC,
             ResistanceLevel.MEDIUM, ResistanceLevel.HIGH, ResistanceLevel.LOW, ResistanceLevel.LOW, ResistanceLevel.LOW},
            {"Premium Copper Roof", 800, BudgetLevel.HIGH, ResistanceLevel.HIGH, ClimateSuitability.ALL, MaintenanceLevel.LOW, "Traditional", Material.OTHER,
             ResistanceLevel.HIGH, ResistanceLevel.HIGH, ResistanceLevel.HIGH, ResistanceLevel.MEDIUM, ResistanceLevel.MEDIUM},
            {"Aluminum Standing Seam", 550, BudgetLevel.HIGH, ResistanceLevel.HIGH, ClimateSuitability.ALL, MaintenanceLevel.LOW, "Modern", Material.ALUMINUM,
             ResistanceLevel.HIGH, ResistanceLevel.HIGH, ResistanceLevel.MEDIUM, ResistanceLevel.LOW, ResistanceLevel.MEDIUM},
            {"Wooden Shingle Roof", 300, BudgetLevel.MEDIUM, ResistanceLevel.MEDIUM, ClimateSuitability.TEMPERATE, MaintenanceLevel.HIGH, "Natural", Material.WOOD,
             ResistanceLevel.LOW, ResistanceLevel.LOW, ResistanceLevel.LOW, ResistanceLevel.LOW, ResistanceLevel.HIGH},
            {"Fiber Cement Roof", 250, BudgetLevel.MEDIUM, ResistanceLevel.MEDIUM, ClimateSuitability.ALL, MaintenanceLevel.LOW, "Modern", Material.CONCRETE,
             ResistanceLevel.HIGH, ResistanceLevel.HIGH, ResistanceLevel.MEDIUM, ResistanceLevel.MEDIUM, ResistanceLevel.MEDIUM},
            {"Thatch Roof Panel", 160, BudgetLevel.LOW, ResistanceLevel.LOW, ClimateSuitability.TROPICAL, MaintenanceLevel.HIGH, "Natural", Material.OTHER,
             ResistanceLevel.LOW, ResistanceLevel.LOW, ResistanceLevel.HIGH, ResistanceLevel.LOW, ResistanceLevel.HIGH},
        };
        return seedProducts(cat, brands, data);
    }

    // â”€â”€ Flooring Products â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    private int seedFlooringProducts(Category cat, List<Brand> brands) {
        Object[][] data = {
            {"Ceramic Floor Tile", 80, BudgetLevel.LOW, ResistanceLevel.MEDIUM, ClimateSuitability.ALL, MaintenanceLevel.LOW, "Modern", Material.CERAMIC,
             ResistanceLevel.HIGH, ResistanceLevel.MEDIUM, ResistanceLevel.MEDIUM, ResistanceLevel.MEDIUM, ResistanceLevel.LOW},
            {"Porcelain Floor Tile", 150, BudgetLevel.MEDIUM, ResistanceLevel.HIGH, ClimateSuitability.ALL, MaintenanceLevel.LOW, "Modern", Material.CERAMIC,
             ResistanceLevel.HIGH, ResistanceLevel.HIGH, ResistanceLevel.HIGH, ResistanceLevel.HIGH, ResistanceLevel.LOW},
            {"Hardwood Flooring", 400, BudgetLevel.HIGH, ResistanceLevel.MEDIUM, ClimateSuitability.TEMPERATE, MaintenanceLevel.HIGH, "Wooden", Material.WOOD,
             ResistanceLevel.LOW, ResistanceLevel.LOW, ResistanceLevel.LOW, ResistanceLevel.LOW, ResistanceLevel.MEDIUM},
            {"Vinyl Plank Flooring", 60, BudgetLevel.LOW, ResistanceLevel.MEDIUM, ClimateSuitability.ALL, MaintenanceLevel.LOW, "Wooden", Material.PVC,
             ResistanceLevel.HIGH, ResistanceLevel.HIGH, ResistanceLevel.LOW, ResistanceLevel.MEDIUM, ResistanceLevel.MEDIUM},
            {"Natural Stone Floor", 500, BudgetLevel.HIGH, ResistanceLevel.HIGH, ClimateSuitability.ALL, MaintenanceLevel.MEDIUM, "Marble", Material.OTHER,
             ResistanceLevel.MEDIUM, ResistanceLevel.MEDIUM, ResistanceLevel.HIGH, ResistanceLevel.LOW, ResistanceLevel.LOW},
            {"Laminate Flooring", 90, BudgetLevel.LOW, ResistanceLevel.LOW, ClimateSuitability.TEMPERATE, MaintenanceLevel.LOW, "Wooden", Material.OTHER,
             ResistanceLevel.LOW, ResistanceLevel.MEDIUM, ResistanceLevel.LOW, ResistanceLevel.LOW, ResistanceLevel.MEDIUM},
            {"Concrete Polished Floor", 200, BudgetLevel.MEDIUM, ResistanceLevel.HIGH, ClimateSuitability.ALL, MaintenanceLevel.LOW, "Industrial", Material.CONCRETE,
             ResistanceLevel.HIGH, ResistanceLevel.HIGH, ResistanceLevel.HIGH, ResistanceLevel.MEDIUM, ResistanceLevel.LOW},
            {"Terracotta Floor Tile", 130, BudgetLevel.MEDIUM, ResistanceLevel.MEDIUM, ClimateSuitability.TROPICAL, MaintenanceLevel.MEDIUM, "Rustic", Material.CERAMIC,
             ResistanceLevel.MEDIUM, ResistanceLevel.MEDIUM, ResistanceLevel.HIGH, ResistanceLevel.MEDIUM, ResistanceLevel.LOW},
            {"Rubber Flooring", 70, BudgetLevel.LOW, ResistanceLevel.MEDIUM, ClimateSuitability.ALL, MaintenanceLevel.LOW, "Modern", Material.OTHER,
             ResistanceLevel.HIGH, ResistanceLevel.HIGH, ResistanceLevel.LOW, ResistanceLevel.HIGH, ResistanceLevel.HIGH},
            {"Marble Floor Tile", 600, BudgetLevel.HIGH, ResistanceLevel.HIGH, ClimateSuitability.ALL, MaintenanceLevel.MEDIUM, "Marble", Material.OTHER,
             ResistanceLevel.LOW, ResistanceLevel.LOW, ResistanceLevel.MEDIUM, ResistanceLevel.LOW, ResistanceLevel.LOW},
        };
        return seedProducts(cat, brands, data);
    }

    // â”€â”€ Wall Products â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    private int seedWallProducts(Category cat, List<Brand> brands) {
        Object[][] data = {
            {"PVC Wall Panel", 50, BudgetLevel.LOW, ResistanceLevel.MEDIUM, ClimateSuitability.ALL, MaintenanceLevel.LOW, "Modern", Material.PVC,
             ResistanceLevel.HIGH, ResistanceLevel.HIGH, ResistanceLevel.LOW, ResistanceLevel.LOW, ResistanceLevel.LOW},
            {"Ceramic Wall Tile", 100, BudgetLevel.MEDIUM, ResistanceLevel.MEDIUM, ClimateSuitability.ALL, MaintenanceLevel.LOW, "Modern", Material.CERAMIC,
             ResistanceLevel.HIGH, ResistanceLevel.MEDIUM, ResistanceLevel.MEDIUM, ResistanceLevel.MEDIUM, ResistanceLevel.LOW},
            {"Wooden Wall Cladding", 250, BudgetLevel.MEDIUM, ResistanceLevel.MEDIUM, ClimateSuitability.TEMPERATE, MaintenanceLevel.HIGH, "Wooden", Material.WOOD,
             ResistanceLevel.LOW, ResistanceLevel.LOW, ResistanceLevel.LOW, ResistanceLevel.LOW, ResistanceLevel.MEDIUM},
            {"Brick Veneer Wall", 180, BudgetLevel.MEDIUM, ResistanceLevel.HIGH, ClimateSuitability.ALL, MaintenanceLevel.LOW, "Textured", Material.BRICK,
             ResistanceLevel.MEDIUM, ResistanceLevel.MEDIUM, ResistanceLevel.HIGH, ResistanceLevel.MEDIUM, ResistanceLevel.MEDIUM},
            {"Glass Wall Panel", 400, BudgetLevel.HIGH, ResistanceLevel.MEDIUM, ClimateSuitability.TEMPERATE, MaintenanceLevel.MEDIUM, "Modern", Material.GLASS,
             ResistanceLevel.HIGH, ResistanceLevel.HIGH, ResistanceLevel.LOW, ResistanceLevel.LOW, ResistanceLevel.LOW},
            {"Concrete Textured Wall", 120, BudgetLevel.LOW, ResistanceLevel.HIGH, ClimateSuitability.ALL, MaintenanceLevel.LOW, "Industrial", Material.CONCRETE,
             ResistanceLevel.HIGH, ResistanceLevel.HIGH, ResistanceLevel.HIGH, ResistanceLevel.MEDIUM, ResistanceLevel.MEDIUM},
            {"Decorative Wallpaper", 40, BudgetLevel.LOW, ResistanceLevel.LOW, ClimateSuitability.TEMPERATE, MaintenanceLevel.MEDIUM, "Minimal", Material.OTHER,
             ResistanceLevel.LOW, ResistanceLevel.LOW, ResistanceLevel.LOW, ResistanceLevel.LOW, ResistanceLevel.LOW},
            {"Stone Wall Cladding", 350, BudgetLevel.HIGH, ResistanceLevel.HIGH, ClimateSuitability.ALL, MaintenanceLevel.LOW, "Natural", Material.OTHER,
             ResistanceLevel.MEDIUM, ResistanceLevel.HIGH, ResistanceLevel.HIGH, ResistanceLevel.MEDIUM, ResistanceLevel.MEDIUM},
            {"Aluminum Composite Panel", 300, BudgetLevel.MEDIUM, ResistanceLevel.MEDIUM, ClimateSuitability.ALL, MaintenanceLevel.LOW, "Modern", Material.ALUMINUM,
             ResistanceLevel.HIGH, ResistanceLevel.HIGH, ResistanceLevel.MEDIUM, ResistanceLevel.LOW, ResistanceLevel.LOW},
            {"Gypsum Plaster Wall", 80, BudgetLevel.LOW, ResistanceLevel.MEDIUM, ClimateSuitability.TEMPERATE, MaintenanceLevel.MEDIUM, "Minimal", Material.OTHER,
             ResistanceLevel.LOW, ResistanceLevel.LOW, ResistanceLevel.LOW, ResistanceLevel.LOW, ResistanceLevel.MEDIUM},
        };
        return seedProducts(cat, brands, data);
    }

    // â”€â”€ Ceiling Products â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    private int seedCeilingProducts(Category cat, List<Brand> brands) {
        Object[][] data = {
            {"PVC Ceiling Panel", 45, BudgetLevel.LOW, ResistanceLevel.MEDIUM, ClimateSuitability.ALL, MaintenanceLevel.LOW, "Modern", Material.PVC,
             ResistanceLevel.HIGH, ResistanceLevel.HIGH, ResistanceLevel.LOW, ResistanceLevel.LOW, ResistanceLevel.LOW},
            {"Gypsum False Ceiling", 120, BudgetLevel.MEDIUM, ResistanceLevel.MEDIUM, ClimateSuitability.TEMPERATE, MaintenanceLevel.MEDIUM, "Modern", Material.OTHER,
             ResistanceLevel.LOW, ResistanceLevel.LOW, ResistanceLevel.LOW, ResistanceLevel.LOW, ResistanceLevel.HIGH},
            {"Wooden Ceiling Panel", 280, BudgetLevel.MEDIUM, ResistanceLevel.MEDIUM, ClimateSuitability.TEMPERATE, MaintenanceLevel.HIGH, "Traditional", Material.WOOD,
             ResistanceLevel.LOW, ResistanceLevel.LOW, ResistanceLevel.LOW, ResistanceLevel.LOW, ResistanceLevel.HIGH},
            {"Metal Grid Ceiling", 200, BudgetLevel.MEDIUM, ResistanceLevel.HIGH, ClimateSuitability.ALL, MaintenanceLevel.LOW, "Industrial", Material.ALUMINUM,
             ResistanceLevel.HIGH, ResistanceLevel.HIGH, ResistanceLevel.MEDIUM, ResistanceLevel.LOW, ResistanceLevel.MEDIUM},
            {"Acoustic Ceiling Tile", 150, BudgetLevel.MEDIUM, ResistanceLevel.MEDIUM, ClimateSuitability.ALL, MaintenanceLevel.LOW, "Minimal", Material.OTHER,
             ResistanceLevel.MEDIUM, ResistanceLevel.MEDIUM, ResistanceLevel.LOW, ResistanceLevel.LOW, ResistanceLevel.HIGH},
            {"Fiber Cement Board Ceiling", 100, BudgetLevel.LOW, ResistanceLevel.MEDIUM, ClimateSuitability.ALL, MaintenanceLevel.LOW, "Modern", Material.CONCRETE,
             ResistanceLevel.HIGH, ResistanceLevel.HIGH, ResistanceLevel.MEDIUM, ResistanceLevel.LOW, ResistanceLevel.MEDIUM},
            {"Stretch Ceiling Film", 350, BudgetLevel.HIGH, ResistanceLevel.MEDIUM, ClimateSuitability.ALL, MaintenanceLevel.LOW, "Modern", Material.PVC,
             ResistanceLevel.HIGH, ResistanceLevel.HIGH, ResistanceLevel.LOW, ResistanceLevel.LOW, ResistanceLevel.MEDIUM},
            {"Bamboo Ceiling Panel", 180, BudgetLevel.MEDIUM, ResistanceLevel.MEDIUM, ClimateSuitability.TROPICAL, MaintenanceLevel.MEDIUM, "Natural", Material.WOOD,
             ResistanceLevel.LOW, ResistanceLevel.LOW, ResistanceLevel.LOW, ResistanceLevel.LOW, ResistanceLevel.MEDIUM},
            {"Mineral Fiber Ceiling", 90, BudgetLevel.LOW, ResistanceLevel.MEDIUM, ClimateSuitability.ALL, MaintenanceLevel.LOW, "Minimal", Material.OTHER,
             ResistanceLevel.MEDIUM, ResistanceLevel.MEDIUM, ResistanceLevel.MEDIUM, ResistanceLevel.LOW, ResistanceLevel.HIGH},
            {"Glass Ceiling Panel", 500, BudgetLevel.HIGH, ResistanceLevel.MEDIUM, ClimateSuitability.TEMPERATE, MaintenanceLevel.MEDIUM, "Modern", Material.GLASS,
             ResistanceLevel.HIGH, ResistanceLevel.HIGH, ResistanceLevel.LOW, ResistanceLevel.LOW, ResistanceLevel.LOW},
        };
        return seedProducts(cat, brands, data);
    }

    // â”€â”€ Accessories Products â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    private int seedAccessoriesProducts(Category cat, List<Brand> brands) {
        Object[][] data = {
            {"Stainless Steel Screws Pack", 15, BudgetLevel.LOW, ResistanceLevel.HIGH, ClimateSuitability.ALL, MaintenanceLevel.LOW, "Industrial", Material.STEEL,
             ResistanceLevel.HIGH, ResistanceLevel.HIGH, ResistanceLevel.MEDIUM, ResistanceLevel.LOW, ResistanceLevel.LOW},
            {"Silicone Sealant Tube", 12, BudgetLevel.LOW, ResistanceLevel.MEDIUM, ClimateSuitability.ALL, MaintenanceLevel.LOW, "Modern", Material.OTHER,
             ResistanceLevel.HIGH, ResistanceLevel.HIGH, ResistanceLevel.MEDIUM, ResistanceLevel.LOW, ResistanceLevel.LOW},
            {"Decorative Wall Hook Set", 25, BudgetLevel.LOW, ResistanceLevel.LOW, ClimateSuitability.ALL, MaintenanceLevel.LOW, "Modern", Material.STEEL,
             ResistanceLevel.MEDIUM, ResistanceLevel.MEDIUM, ResistanceLevel.LOW, ResistanceLevel.LOW, ResistanceLevel.LOW},
            {"Premium Door Handle", 80, BudgetLevel.MEDIUM, ResistanceLevel.MEDIUM, ClimateSuitability.ALL, MaintenanceLevel.LOW, "Modern", Material.STEEL,
             ResistanceLevel.MEDIUM, ResistanceLevel.HIGH, ResistanceLevel.LOW, ResistanceLevel.LOW, ResistanceLevel.LOW},
            {"Edge Trim Profile", 18, BudgetLevel.LOW, ResistanceLevel.MEDIUM, ClimateSuitability.ALL, MaintenanceLevel.LOW, "Minimal", Material.ALUMINUM,
             ResistanceLevel.MEDIUM, ResistanceLevel.HIGH, ResistanceLevel.MEDIUM, ResistanceLevel.LOW, ResistanceLevel.LOW},
            {"Heavy Duty Wall Anchors", 20, BudgetLevel.LOW, ResistanceLevel.HIGH, ClimateSuitability.ALL, MaintenanceLevel.LOW, "Industrial", Material.STEEL,
             ResistanceLevel.HIGH, ResistanceLevel.HIGH, ResistanceLevel.MEDIUM, ResistanceLevel.LOW, ResistanceLevel.LOW},
            {"Brass Cabinet Knobs", 45, BudgetLevel.MEDIUM, ResistanceLevel.MEDIUM, ClimateSuitability.ALL, MaintenanceLevel.MEDIUM, "Traditional", Material.OTHER,
             ResistanceLevel.MEDIUM, ResistanceLevel.MEDIUM, ResistanceLevel.LOW, ResistanceLevel.LOW, ResistanceLevel.LOW},
            {"Outdoor Waterproof Tape", 10, BudgetLevel.LOW, ResistanceLevel.LOW, ClimateSuitability.ALL, MaintenanceLevel.LOW, "Industrial", Material.OTHER,
             ResistanceLevel.HIGH, ResistanceLevel.HIGH, ResistanceLevel.MEDIUM, ResistanceLevel.LOW, ResistanceLevel.LOW},
            {"Designer Light Switch Plate", 35, BudgetLevel.MEDIUM, ResistanceLevel.MEDIUM, ClimateSuitability.ALL, MaintenanceLevel.LOW, "Modern", Material.PVC,
             ResistanceLevel.MEDIUM, ResistanceLevel.MEDIUM, ResistanceLevel.LOW, ResistanceLevel.LOW, ResistanceLevel.LOW},
            {"Premium Grout Mix", 30, BudgetLevel.MEDIUM, ResistanceLevel.MEDIUM, ClimateSuitability.ALL, MaintenanceLevel.LOW, "Minimal", Material.OTHER,
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
                    .durabilityRating((ResistanceLevel) d[3])
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

    // ── 6 CONDITIONAL_MATCH Rules (flat answer-attribute mappings) ─────────

    private void seedSampleRules() {
        if (ruleRepository.count() > 0) {
            // Check if existing rules use the new flat mapping model
            boolean needsMigration = ruleRepository.findAll().stream()
                    .anyMatch(r -> r.getRuleType() == RuleType.CONDITIONAL_MATCH
                            && (r.getMappings() == null || r.getMappings().isEmpty()));
            if (needsMigration) {
                log.info("DataSeeder: Detected old-format rules — clearing and re-seeding with flat mapping model.");
                ruleRepository.deleteAll();
            } else {
                log.info("DataSeeder: Rules already exist – skipping.");
                return;
            }
        }

        // ─── 1. BUDGET (HIGH priority, weight=25) ───
        Rule budget = makeRule("Budget Match", "Matches product budget level to user preference", RulePriority.HIGH, 5.0);
        leveled(budget, "budget", "economy", "budgetLevel", "LOW");
        leveled(budget, "budget", "mid",     "budgetLevel", "MEDIUM");
        leveled(budget, "budget", "mid-range", "budgetLevel", "MEDIUM");
        leveled(budget, "budget", "premium", "budgetLevel", "HIGH");
        ruleRepository.save(budget);

        // ─── 2. ENVIRONMENT (HIGH priority, weight=25) ───
        Rule env = makeRule("Environment Match", "Scores environmental suitability based on location/climate", RulePriority.HIGH, 5.0);
        leveled(env, "location", "coastal",  "corrosionResistance", "HIGH", 6.0);
        leveled(env, "location", "heavy rain", "waterResistance", "HIGH", 6.0);
        leveled(env, "location", "hot/dry",  "heatResistance", "HIGH", 6.0);
        fixed(env, "location", "urban/normal", 7.0);
        leveled(env, "environment", "humid",  "waterResistance", "HIGH", 6.0);
        leveled(env, "environment", "dry",    "heatResistance", "HIGH", 6.0);
        fixed(env, "environment", "normal", 7.0);
        leveled(env, "usage_environment", "outdoor", "waterResistance", "HIGH", 6.0);
        leveled(env, "usage_environment", "outdoor", "corrosionResistance", "HIGH", 6.0);
        fixed(env, "usage_environment", "indoor", 7.0);
        ruleRepository.save(env);

        // ─── 3. PERFORMANCE (HIGH priority, weight=25) ───
        Rule perf = makeRule("Performance Match", "Scores product based on performance needs", RulePriority.HIGH, 5.0);
        leveled(perf, "concern", "keep cost low", "budgetLevel", "LOW", 5.0);
        leveled(perf, "concern", "keep house cool", "heatResistance", "HIGH", 6.0);
        leveled(perf, "concern", "long-lasting", "durabilityRating", "HIGH", 6.0);
        leveled(perf, "concern", "reduce noise", "noiseReduction", "HIGH", 6.0);
        leveled(perf, "priority", "long-lasting", "durabilityRating", "HIGH", 6.0);
        leveled(perf, "priority", "durability", "durabilityRating", "HIGH", 6.0);
        leveled(perf, "priority", "protection", "durabilityRating", "HIGH", 6.0);
        leveled(perf, "priority", "easy to clean", "waterResistance", "HIGH", 6.0);
        leveled(perf, "priority", "easy cleaning", "waterResistance", "HIGH", 6.0);
        leveled(perf, "priority", "affordable", "budgetLevel", "LOW", 5.0); // budget uses 5.0
        leveled(perf, "priority", "cost", "budgetLevel", "LOW", 5.0);
        leveled(perf, "priority", "budget", "budgetLevel", "LOW", 5.0);
        fixed(perf, "priority", "compatibility", 7.0);
        fixed(perf, "priority", "appearance", 7.0);
        fixed(perf, "priority", "decoration", 7.0);
        leveled(perf, "goal", "heat reduction", "heatResistance", "HIGH", 6.0);
        leveled(perf, "goal", "sound insulation", "noiseReduction", "HIGH", 6.0);
        fixed(perf, "goal", "appearance", 7.0);
        fixed(perf, "goal", "hide wiring", 7.0);
        leveled(perf, "slip_resistance", "yes", "slipResistance", "HIGH", 6.0);
        fixed(perf, "slip_resistance", "no", 7.0);
        ruleRepository.save(perf);

        // ─── 4. STYLE (MEDIUM priority, weight=15) ───
        Rule style = makeRule("Style Match", "Matches product style to user preference", RulePriority.MEDIUM, 5.0);
        categorical(style, "style", "modern", "style", "MODERN,MINIMAL,INDUSTRIAL");
        categorical(style, "style", "minimal", "style", "MINIMAL,MODERN,INDUSTRIAL");
        categorical(style, "style", "industrial", "style", "INDUSTRIAL,MODERN,MINIMAL");
        categorical(style, "style", "traditional", "style", "TRADITIONAL,RUSTIC");
        categorical(style, "style", "rustic", "style", "RUSTIC,TRADITIONAL");
        categorical(style, "style", "natural", "style", "NATURAL,WOODEN,MARBLE,TEXTURED");
        categorical(style, "style", "wooden look", "style", "WOODEN,NATURAL,MARBLE,TEXTURED");
        categorical(style, "style", "wooden finish", "style", "WOODEN,NATURAL,MARBLE,TEXTURED");
        categorical(style, "style", "marble look", "style", "MARBLE,NATURAL,WOODEN,TEXTURED");
        categorical(style, "style", "textured", "style", "TEXTURED,NATURAL,WOODEN,MARBLE");
        ruleRepository.save(style);

        // ─── 5. MAINTENANCE (LOW priority, weight=10) ───
        Rule maint = makeRule("Maintenance Match", "Matches maintenance level preference", RulePriority.LOW, 5.0);
        leveled(maint, "maintenance", "low",    "maintenanceLevel", "LOW");
        leveled(maint, "maintenance", "medium", "maintenanceLevel", "MEDIUM");
        leveled(maint, "maintenance", "high",   "maintenanceLevel", "HIGH");
        ruleRepository.save(maint);

        // ─── 6. USAGE (LOW priority, weight=10) ───
        Rule usage = makeRule("Usage Match", "Scores product based on usage context", RulePriority.LOW, 7.0);
        leveled(usage, "flooring_usage", "bathroom/wet area", "waterResistance", "HIGH", 6.0);
        leveled(usage, "flooring_usage", "bathroom/wet area", "slipResistance", "HIGH", 6.0);
        leveled(usage, "flooring_usage", "outdoor", "waterResistance", "HIGH", 6.0);
        leveled(usage, "flooring_usage", "outdoor", "heatResistance", "HIGH", 6.0);
        leveled(usage, "flooring_usage", "commercial", "durabilityRating", "HIGH", 6.0);
        fixed(usage, "flooring_usage", "living/bedroom", 7.0);
        leveled(usage, "traffic", "high", "durabilityRating", "HIGH", 6.0);
        leveled(usage, "traffic", "medium", "durabilityRating", "MEDIUM", 6.0);
        fixed(usage, "traffic", "low", 7.0);
        leveled(usage, "wall_usage", "kitchen", "waterResistance", "HIGH", 6.0);
        leveled(usage, "wall_usage", "kitchen", "heatResistance", "HIGH", 6.0);
        leveled(usage, "wall_usage", "bathroom", "waterResistance", "HIGH", 6.0);
        fixed(usage, "wall_usage", "living room", 7.0);
        fixed(usage, "wall_usage", "bedroom", 7.0);
        leveled(usage, "accessory_type", "installation", "durabilityRating", "MEDIUM", 6.0);
        fixed(usage, "accessory_type", "finishing", 7.0);
        fixed(usage, "accessory_type", "decorative", 6.0);
        leveled(usage, "usage_duration", "long-term", "durabilityRating", "HIGH", 6.0);
        fixed(usage, "usage_duration", "one-time", 7.0);
        leveled(usage, "room_type", "kitchen", "heatResistance", "HIGH", 6.0);
        leveled(usage, "room_type", "office", "noiseReduction", "HIGH", 6.0);
        fixed(usage, "room_type", "living room", 7.0);
        fixed(usage, "room_type", "bedroom", 7.0);
        ruleRepository.save(usage);

        log.info("DataSeeder: Seeded 6 CONDITIONAL_MATCH rules (flat mapping model).");
    }

    // ── Rule helper methods ─────────────────────────────────────────────────

    private Rule makeRule(String name, String desc, RulePriority priority, Double defaultScore) {
        Rule r = new Rule();
        r.setName(name);
        r.setDescription(desc);
        r.setRuleType(RuleType.CONDITIONAL_MATCH);
        r.setRuleStatus(RuleStatus.ACTIVE);
        r.setRulePriority(priority);
        r.setDefaultScore(defaultScore);
        return r;
    }

    private void leveled(Rule rule, String answerKey, String answerValue,
                         String productAttribute, String idealLevel) {
        leveled(rule, answerKey, answerValue, productAttribute, idealLevel, 5.0);
    }

    private void leveled(Rule rule, String answerKey, String answerValue,
                         String productAttribute, String idealLevel, Double dev1Score) {
        AnswerAttributeMapping m = new AnswerAttributeMapping();
        m.setAnswerKey(answerKey);
        m.setAnswerValue(answerValue);
        m.setProductAttribute(productAttribute);
        m.setScoringMode(ScoringMode.LEVELED);
        m.setIdealLevel(idealLevel);
        m.setExactMatchScore(10.0);
        m.setDeviation1Score(dev1Score != null ? dev1Score : 5.0);
        m.setDeviation2Score(2.0);
        m.setNoDataScore(3.0);
        rule.addMapping(m);
    }

    private void categorical(Rule rule, String answerKey, String answerValue,
                             String productAttribute, String idealLevel) {
        AnswerAttributeMapping m = new AnswerAttributeMapping();
        m.setAnswerKey(answerKey);
        m.setAnswerValue(answerValue);
        m.setProductAttribute(productAttribute);
        m.setScoringMode(ScoringMode.CATEGORICAL);
        m.setIdealLevel(idealLevel);
        m.setMatchScore(10.0);
        m.setNoMatchScore(2.0);
        m.setNoDataScore(3.0);
        rule.addMapping(m);
    }

    private void fixed(Rule rule, String answerKey, String answerValue, Double score) {
        AnswerAttributeMapping m = new AnswerAttributeMapping();
        m.setAnswerKey(answerKey);
        m.setAnswerValue(answerValue);
        m.setScoringMode(ScoringMode.FIXED);
        m.setFixedScore(score);
        m.setNoDataScore(3.0);
        rule.addMapping(m);
    }
}