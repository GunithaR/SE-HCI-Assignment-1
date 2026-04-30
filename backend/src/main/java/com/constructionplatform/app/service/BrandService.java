package com.constructionplatform.app.service;

import com.constructionplatform.app.dto.BrandCreateRequestDTO;
import com.constructionplatform.app.dto.BrandDTO;
import java.util.List;

public interface BrandService {
    List<BrandDTO> findAll();
    BrandDTO createBrand(BrandCreateRequestDTO request);
}
