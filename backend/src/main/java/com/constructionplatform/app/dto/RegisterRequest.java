package com.constructionplatform.app.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/** DTO for POST /api/auth/register. */
public class RegisterRequest {

    @NotBlank(message = "Email must not be blank")
    @Email(message = "Email must be a valid email address")
    private String email;

    @NotBlank(message = "Password must not be blank")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    /**
     * Clients must explicitly request ADMIN; defaults to CUSTOMER in the service
     * layer.
     */
    @Pattern(regexp = "ADMIN|CUSTOMER", message = "Role must be either ADMIN or CUSTOMER")
    private String role;

    public RegisterRequest() {
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public String getRole() {
        return role;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
