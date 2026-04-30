package com.constructionplatform.app.service;

import com.constructionplatform.app.dto.CategoryDTO;
import java.util.List;

public interface CategoryService {
    List<CategoryDTO> findAll();
}
