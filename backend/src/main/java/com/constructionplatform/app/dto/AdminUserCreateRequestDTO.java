package com.constructionplatform.app.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Request body for {@code POST /api/admin/users} — creates a new Admin account.
 */
public class AdminUserCreateRequestDTO {

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be a valid email address")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    // ── Getters ───────────────────────────────────────────────────────────────

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    // ── Setters ───────────────────────────────────────────────────────────────

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
