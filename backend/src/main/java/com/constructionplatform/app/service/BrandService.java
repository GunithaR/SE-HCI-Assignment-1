package com.constructionplatform.app.service;

import com.constructionplatform.app.dto.BrandCreateRequestDTO;
import com.constructionplatform.app.dto.BrandDTO;
import com.constructionplatform.app.entity.Brand;
import com.constructionplatform.app.repository.BrandRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Use-case layer for Brand operations.
 */
@Service
@Transactional(readOnly = true)
public class BrandService {

    private static final Logger log = LoggerFactory.getLogger(BrandService.class);

    private final BrandRepository brandRepository;

    public BrandService(BrandRepository brandRepository) {
        this.brandRepository = brandRepository;
    }

    /**
     * Returns all brands as DTOs.
     * Returns an empty list if the table has no rows — callers never receive null.
     */
    public List<BrandDTO> findAll() {
        List<BrandDTO> brands = brandRepository.findAll()
                .stream()
                .map(BrandDTO::from)
                .collect(Collectors.toList());
        log.debug("BrandService.findAll: returning {} brands", brands.size());
        return brands;
    }

    /**
     * Creates a new brand. Rejects duplicate names.
     *
     * @param request validated DTO containing name + description
     * @return the persisted brand as a DTO
     * @throws IllegalArgumentException if a brand with the same name already exists
     */
    @Transactional
    public BrandDTO createBrand(BrandCreateRequestDTO request) {
        if (brandRepository.existsByName(request.getName())) {
            throw new IllegalArgumentException(
                    "A brand with name '" + request.getName() + "' already exists.");
        }
        Brand brand = Brand.builder()
                .name(request.getName())
                .description(request.getDescription())
                .build();
        Brand saved = brandRepository.save(brand);
        log.info("BrandService: Created brand id=[{}] name=[{}]", saved.getId(), saved.getName());
        return BrandDTO.from(saved);
    }
}
