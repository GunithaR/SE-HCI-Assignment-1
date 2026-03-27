package com.constructionplatform.app.dto;

import com.constructionplatform.app.entity.Category;

/** Read-only view of a {@link Category} returned by the public catalog API. */
public class CategoryDTO {

    private Long id;
    private String name;
    private String description;

    public CategoryDTO() {
    }

    /** Convenience factory — maps directly from a {@link Category} entity. */
    public static CategoryDTO from(Category category) {
        CategoryDTO dto = new CategoryDTO();
        dto.id = category.getId();
        dto.name = category.getName();
        dto.description = category.getDescription();
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
