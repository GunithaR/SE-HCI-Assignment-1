package com.constructionplatform.app.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Paths;

/**
 * Registers a static-resource handler so that uploaded product images
 * stored under {@code uploads/products/} on disk are accessible at
 * {@code /uploads/**} without authentication.
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Serve /uploads/** from the "uploads/" folder next to the running jar
        String uploadsRoot = Paths.get("uploads").toAbsolutePath().normalize() + "/";
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + uploadsRoot);
    }
}
