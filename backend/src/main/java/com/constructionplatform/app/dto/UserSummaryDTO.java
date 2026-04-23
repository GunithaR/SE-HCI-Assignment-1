package com.constructionplatform.app.dto;

import java.time.LocalDateTime;

/**
 * Lightweight DTO for the admin user-listing endpoint.
 */
public class UserSummaryDTO {

    private String id;
    private String email;
    private String role;
    private LocalDateTime createdAt;

    public UserSummaryDTO() {}

    public UserSummaryDTO(String id, String email, String role, LocalDateTime createdAt) {
        this.id = id;
        this.email = email;
        this.role = role;
        this.createdAt = createdAt;
    }

    public String getId()              { return id; }
    public void   setId(String id)     { this.id = id; }

    public String getEmail()           { return email; }
    public void   setEmail(String e)   { this.email = e; }

    public String getRole()            { return role; }
    public void   setRole(String r)    { this.role = r; }

    public LocalDateTime getCreatedAt()          { return createdAt; }
    public void          setCreatedAt(LocalDateTime ca) { this.createdAt = ca; }
}
