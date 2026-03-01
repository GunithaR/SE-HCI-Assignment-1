package com.constructionplatform.app.dto;

import com.constructionplatform.app.entity.Brand;

/** Read-only view of a {@link Brand} returned by the public catalog API. */
public class BrandDTO {

    private Long id;
    private String name;
    private String description;

    public BrandDTO() {
    }

    /** Convenience factory — maps directly from a {@link Brand} entity. */
    public static BrandDTO from(Brand brand) {
        BrandDTO dto = new BrandDTO();
        dto.id = brand.getId();
        dto.name = brand.getName();
        dto.description = brand.getDescription();
        return dto;
    }

    // ── Getters ───────────────────────────────────────────────────────────────

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    // ── Setters ───────────────────────────────────────────────────────────────

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
