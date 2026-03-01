package com.constructionplatform.app.service;

import com.constructionplatform.app.dto.CategoryDTO;
import com.constructionplatform.app.repository.CategoryRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Use-case layer for Category operations.
 *
 * <p>
 * Currently exposes a read-only listing used by the public catalog.
 * Returns an empty list gracefully when no categories exist yet.
 */
@Service
@Transactional(readOnly = true)
public class CategoryService {

    private static final Logger log = LoggerFactory.getLogger(CategoryService.class);

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    /**
     * Returns all categories as DTOs.
     * Returns an empty list if the table has no rows — callers never receive null.
     */
    public List<CategoryDTO> findAll() {
        List<CategoryDTO> categories = categoryRepository.findAll()
                .stream()
                .map(CategoryDTO::from)
                .collect(Collectors.toList());
        log.debug("CategoryService.findAll: returning {} categories", categories.size());
        return categories;
    }
}
