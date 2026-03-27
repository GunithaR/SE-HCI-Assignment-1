package com.constructionplatform.app.dto;

/** Unified authentication response DTO. */
public class AuthResponse {

    private String token;
    private String email;
    private String role;
    private long expiresIn;

    public AuthResponse() {
    }

    private AuthResponse(Builder b) {
        this.token = b.token;
        this.email = b.email;
        this.role = b.role;
        this.expiresIn = b.expiresIn;
    }

    public String getToken() {
        return token;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }

    public long getExpiresIn() {
        return expiresIn;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public void setExpiresIn(long expiresIn) {
        this.expiresIn = expiresIn;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static final class Builder {
        private String token;
        private String email;
        private String role;
        private long expiresIn;

        public Builder token(String t) {
            this.token = t;
            return this;
        }

        public Builder email(String e) {
            this.email = e;
            return this;
        }

        public Builder role(String r) {
            this.role = r;
            return this;
        }

        public Builder expiresIn(long ms) {
            this.expiresIn = ms;
            return this;
        }

        public AuthResponse build() {
            return new AuthResponse(this);
        }
    }
}
