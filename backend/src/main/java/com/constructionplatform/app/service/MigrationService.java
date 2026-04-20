package com.constructionplatform.app.service;

import com.constructionplatform.app.entity.Product;
import com.constructionplatform.app.entity.ProductImage;
import com.constructionplatform.app.repository.ProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class MigrationService {

    private static final Logger log = LoggerFactory.getLogger(MigrationService.class);
    private final ProductRepository productRepository;

    public MigrationService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void migrateProductImages() {
        log.info("Starting ProductImage data migration check...");
        List<Product> products = productRepository.findAll();
        int migratedCount = 0;
        
        for (Product p : products) {
            String legacyUrl = p.getImageUrl();
            if (legacyUrl != null && !legacyUrl.trim().isEmpty()) {
                if (p.getImages() == null || p.getImages().isEmpty()) {
                    ProductImage img = new ProductImage(p, legacyUrl);
                    p.getImages().add(img);
                    productRepository.save(p);
                    migratedCount++;
                }
            }
        }
        
        if (migratedCount > 0) {
            log.info("Successfully migrated {} legacy product images to the new ProductImage system.", migratedCount);
        } else {
            log.info("No legacy product images needed migration.");
        }
    }
}
