package com.constructionplatform.app.enums;

/**
 * Application-level roles used for Spring Security authority mapping.
 * The value stored in the DB is the enum name (e.g. "ADMIN", "CUSTOMER").
 */
public enum Role {
    ADMIN,
    SUB_ADMIN,
    CUSTOMER
}
