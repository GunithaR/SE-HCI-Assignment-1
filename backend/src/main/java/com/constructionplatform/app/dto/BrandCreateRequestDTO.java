package com.constructionplatform.app.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/** Request body for {@code POST /api/admin/brands} — creates a new brand. */
public class BrandCreateRequestDTO {

    @NotBlank(message = "Brand name is required")
    @Size(max = 150, message = "Brand name must not exceed 150 characters")
    private String name;

    @Size(max = 2000, message = "Description must not exceed 2000 characters")
    private String description;

    // ── Getters ───────────────────────────────────────────────────────────────

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    // ── Setters ───────────────────────────────────────────────────────────────

    public void setName(String name) {
        this.name = name;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
