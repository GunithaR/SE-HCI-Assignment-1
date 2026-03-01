package com.constructionplatform.app.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Thrown when a requested resource (e.g., Product, Category) cannot be found.
 * The {@link GlobalExceptionHandler} maps this to an HTTP 404 response.
 */
@ResponseStatus(HttpStatus.NOT_FOUND)
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String resourceName, Long id) {
        super(resourceName + " with id " + id + " was not found.");
    }

    public ResourceNotFoundException(String message) {
        super(message);
    }
}
