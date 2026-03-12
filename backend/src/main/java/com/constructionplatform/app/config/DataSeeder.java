package com.constructionplatform.app.config;

import com.constructionplatform.app.entity.Brand;
import com.constructionplatform.app.entity.Category;
import com.constructionplatform.app.entity.Product;
import com.constructionplatform.app.entity.ProductAttribute;
import com.constructionplatform.app.entity.ProductAttribute.BudgetLevel;
import com.constructionplatform.app.entity.ProductAttribute.ClimateSuitability;
import com.constructionplatform.app.entity.ProductAttribute.MaintenanceLevel;
import com.constructionplatform.app.entity.ProductAttribute.Material;
import com.constructionplatform.app.entity.ProductAttribute.ProductSize;
import com.constructionplatform.app.entity.Role;
import com.constructionplatform.app.entity.User;
import com.constructionplatform.app.repository.BrandRepository;
import com.constructionplatform.app.repository.CategoryRepository;
import com.constructionplatform.app.repository.ProductRepository;
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

    /** Current active brands — replaced the early-dev placeholders. */
    private static final List<String> BASE_BRANDS = List.of(
            "PE+",
            "SIVILIMA",
            "Gfloor",
            "AntonRoofing",
            "Other");

    /**
     * Old placeholder brands — removed on startup when no products reference them.
     */
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
    private final PasswordEncoder passwordEncoder;

    @Value("${app.seed.admin-email:admin@platform.com}")
    private String adminEmail;

    @Value("${app.seed.admin-password:Admin@1234}")
    private String adminPassword;

    public DataSeeder(UserRepository userRepository,
            CategoryRepository categoryRepository,
            BrandRepository brandRepository,
            ProductRepository productRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.brandRepository = brandRepository;
        this.productRepository = productRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        seedAdminUser();
        seedCategories();
        removeDeprecatedBrands();
        seedBrands();
        //seedDemoProducts();
    }

    // ── Private helpers ───────────────────────────────────────────────────────

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
        log.warn("DataSeeder: Change the default admin password before deploying to production!");
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

    /**
     * Removes old placeholder brands that were seeded during early development.
     * A brand is only deleted if no products currently reference it, to avoid
     * orphaning existing data.
     */
    private void removeDeprecatedBrands() {
        // Only safe to delete when no products exist (otherwise FK constraints may fail).
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

    /**
     * Seeds some demo product catalog for development.
     *
     * <p>Rule: only runs when there are no products in the database so that it never
     * overwrites or duplicates real data.</p>
     */
    /* 
    private void seedDemoProducts() {
        long existing = productRepository.count();
        if (existing > 0) {
            log.info("DataSeeder: Products already exist (count={}) — skipping demo product seeding.", existing);
            return;
        }

        List<Category> categories = categoryRepository.findAll();
        List<Brand> brands = brandRepository.findAll();
        if (categories.isEmpty() || brands.isEmpty()) {
            log.warn("DataSeeder: Cannot seed products — categories or brands are missing.");
            return;
        }

        ProductSize[] sizes = ProductSize.values();
        Material[] materials = Material.values();
        MaintenanceLevel[] maint = MaintenanceLevel.values();

        int created = 0;
        for (int c = 0; c < categories.size(); c++) {
            Category category = categories.get(c);

            for (int i = 0; i < 10; i++) {
                Brand brand = brands.get((c * 10 + i) % brands.size());

                BigDecimal price = BigDecimal.valueOf(50 + (c * 120) + (i * 15));
                BudgetLevel budget = price.compareTo(BigDecimal.valueOf(200)) < 0
                        ? BudgetLevel.LOW
                        : price.compareTo(BigDecimal.valueOf(500)) < 0 ? BudgetLevel.MEDIUM : BudgetLevel.HIGH;

                Product product = Product.builder()
                        .category(category)
                        .brand(brand)
                        .name(category.getName() + " Demo Product " + (i + 1))
                        .description("Seeded demo product for development/testing.")
                        .basePrice(price)
                        .isActive(true)
                        .build();

                ProductAttribute attr = ProductAttribute.builder()
                        .product(product)
                        .budgetLevel(budget)
                        .durabilityRating(Math.min(10, (i % 10) + 1))
                        .climateSuitability(ClimateSuitability.ALL)
                        .maintenanceLevel(maint[i % maint.length])
                        .style((i % 2 == 0) ? "Modern" : "Classic")
                        .size(sizes[i % sizes.length])
                        .material(materials[i % materials.length])
                        .build();

                product.setAttribute(attr);
                productRepository.save(product);
                created++;
            }
        }

        log.info("DataSeeder: Seeded {} demo products ({} per category).", created, 10);
    } 
        */
}
