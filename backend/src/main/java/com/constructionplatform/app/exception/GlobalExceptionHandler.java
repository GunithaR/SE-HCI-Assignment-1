package com.constructionplatform.app.exception;

import com.constructionplatform.app.dto.ApiErrorResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.dao.DataIntegrityViolationException;

import java.util.Map;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    /** 400 — Jakarta Validation failures: returns a field → message map. */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationErrors(MethodArgumentNotValidException ex) {
        Map<String, String> errors = ex.getBindingResult().getFieldErrors().stream()
                .collect(Collectors.toMap(
                        FieldError::getField,
                        err -> err.getDefaultMessage() != null ? err.getDefaultMessage() : "Invalid value",
                        (a, b) -> a));
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
    }

    /** 404 — Requested Product / Category / Brand was not found. */
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleResourceNotFound(ResourceNotFoundException ex) {
        return buildError(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    /** 401 — Bad username or password on login. */
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiErrorResponse> handleBadCredentials(BadCredentialsException ex) {
        return buildError(HttpStatus.UNAUTHORIZED, "Invalid email or password.");
    }

    /** 400 — Malformed JSON or invalid message format. */
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiErrorResponse> handleHttpMessageNotReadable(HttpMessageNotReadableException ex) {
        String message = "Invalid request payload. ";
        if (ex.getCause() != null) {
            message += ex.getCause().getMessage();
        } else {
            message += ex.getMessage();
        }
        return buildError(HttpStatus.BAD_REQUEST, message);
    }

    /** Preserve status code from ResponseStatusException. */
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ApiErrorResponse> handleResponseStatusException(ResponseStatusException ex) {
        HttpStatus status = HttpStatus.valueOf(ex.getStatusCode().value());
        return buildError(status, ex.getReason() != null ? ex.getReason() : "Request error");
    }

    /** 400 — User input validation errors (not database constraints). */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiErrorResponse> handleIllegalArgument(IllegalArgumentException ex) {
        return buildError(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    /** 403 — Caller lacks the required role. */
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiErrorResponse> handleAccessDenied(AccessDeniedException ex) {
        return buildError(HttpStatus.FORBIDDEN, "You do not have permission to access this resource.");
    }

    /** 400 — Invalid Rule definitions. */
    @ExceptionHandler(InvalidRuleException.class)
    public ResponseEntity<ApiErrorResponse> handleInvalidRule(InvalidRuleException ex) {
        return buildError(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    /** 409 — Database constraints violated (e.g. unique rule name). */
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiErrorResponse> handleDataIntegrityViolation(DataIntegrityViolationException ex) {
        return buildError(HttpStatus.CONFLICT, "A record with this unique value already exists (e.g. duplicate name).");
    }

    /** 500 — Catch-all for any unexpected exception. */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleGenericException(Exception ex) {
        log.error("Unhandled exception", ex);
        return buildError(HttpStatus.INTERNAL_SERVER_ERROR,
                "An unexpected error occurred. Please try again later.");
    }

    private ResponseEntity<ApiErrorResponse> buildError(HttpStatus status, String message) {
        return ResponseEntity.status(status).body(new ApiErrorResponse(status, message));
    }
}
