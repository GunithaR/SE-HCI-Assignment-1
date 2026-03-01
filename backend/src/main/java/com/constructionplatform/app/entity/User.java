package com.constructionplatform.app.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Represents an authenticated system user.
 * NOTE: Manual getters/setters/builder used instead of Lombok for Java 24/25
 * compatibility
 * (Lombok's javac integration does not support Java 23+ TypeTag API changes).
 */
@Entity
@Table(name = "users")
public class User {

    @Id
    @Column(name = "id", updatable = false, nullable = false, length = 36)
    private String id;

    @Column(name = "email", nullable = false, unique = true, length = 255)
    private String email;

    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false, length = 20)
    private Role role;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /** Auto-assign a random UUID string before the first INSERT. */
    @PrePersist
    protected void prePersist() {
        if (this.id == null) {
            this.id = UUID.randomUUID().toString();
        }
    }

    // ── Constructors ──────────────────────────────────────────────────────────

    public User() {
    }

    private User(Builder b) {
        this.email = b.email;
        this.passwordHash = b.passwordHash;
        this.role = b.role;
    }

    // ── Getters ───────────────────────────────────────────────────────────────

    public String getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public Role getRole() {
        return role;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    // ── Setters ───────────────────────────────────────────────────────────────

    public void setId(String id) {
        this.id = id;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPasswordHash(String ph) {
        this.passwordHash = ph;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public void setCreatedAt(LocalDateTime ca) {
        this.createdAt = ca;
    }

    // ── Builder ───────────────────────────────────────────────────────────────

    public static Builder builder() {
        return new Builder();
    }

    public static final class Builder {
        private String email;
        private String passwordHash;
        private Role role;

        public Builder email(String email) {
            this.email = email;
            return this;
        }

        public Builder passwordHash(String ph) {
            this.passwordHash = ph;
            return this;
        }

        public Builder role(Role role) {
            this.role = role;
            return this;
        }

        public User build() {
            return new User(this);
        }
    }
}
