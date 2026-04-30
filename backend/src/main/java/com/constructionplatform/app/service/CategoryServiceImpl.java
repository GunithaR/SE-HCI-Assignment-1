package com.constructionplatform.app.service;

import com.constructionplatform.app.dto.CategoryDTO;
import com.constructionplatform.app.repository.CategoryRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class CategoryServiceImpl implements CategoryService {

    private static final Logger log = LoggerFactory.getLogger(CategoryServiceImpl.class);

    private final CategoryRepository categoryRepository;

    public CategoryServiceImpl(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public List<CategoryDTO> findAll() {
        List<CategoryDTO> categories = categoryRepository.findAll()
                .stream()
                .map(CategoryDTO::from)
                .collect(Collectors.toList());
        log.debug("CategoryService.findAll: returning {} categories", categories.size());
        return categories;
    }
}
