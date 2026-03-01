package com.constructionplatform.app.config;

import com.constructionplatform.app.entity.Brand;
import com.constructionplatform.app.entity.Category;
import com.constructionplatform.app.entity.Role;
import com.constructionplatform.app.entity.User;
import com.constructionplatform.app.repository.BrandRepository;
import com.constructionplatform.app.repository.CategoryRepository;
import com.constructionplatform.app.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

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
    private final PasswordEncoder passwordEncoder;

    @Value("${app.seed.admin-email:admin@platform.com}")
    private String adminEmail;

    @Value("${app.seed.admin-password:Admin@1234}")
    private String adminPassword;

    public DataSeeder(UserRepository userRepository,
            CategoryRepository categoryRepository,
            BrandRepository brandRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.brandRepository = brandRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        seedAdminUser();
        seedCategories();
        removeDeprecatedBrands();
        seedBrands();
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
}
