package com.constructionplatform.app.enums;

public enum OperandSource {
    USER_INPUT,
    PRODUCT;

    /**
     * Backward-compatible alias: the legacy value "INPUT" maps to USER_INPUT.
     * Jackson will deserialise "INPUT" to USER_INPUT via this custom factory.
     */
    @com.fasterxml.jackson.annotation.JsonCreator
    public static OperandSource fromString(String value) {
        if (value == null) return null;
        if ("INPUT".equalsIgnoreCase(value)) return USER_INPUT;
        return OperandSource.valueOf(value.toUpperCase());
    }
}
