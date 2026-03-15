package com.constructionplatform.app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.jdbc.core.JdbcTemplate;

@SpringBootApplication
public class ConstructionPlatformApplication {

    public static void main(String[] args) {
        SpringApplication.run(ConstructionPlatformApplication.class, args);
    }

    @Bean
    public CommandLineRunner schemaFix(JdbcTemplate jdbcTemplate) {
        return args -> {
            try {
                jdbcTemplate.execute("ALTER TABLE rules MODIFY COLUMN combination_type VARCHAR(20)");
                System.out.println("✅ Schema fix applied: combination_type length increased to 20.");
            } catch (Exception e) {
                System.err.println("ℹ️ Schema fix not applied (might already be fixed or table missing): " + e.getMessage());
            }
        };
    }
}
