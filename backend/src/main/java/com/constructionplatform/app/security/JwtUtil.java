package com.constructionplatform.app.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

/**
 * Stateless JWT utility — thread-safe singleton.
 *
 * <p>All mutable state is derived from injected, effectively-final fields.
 * The {@link SecretKey} is constructed once at bean creation time; no shared
 * mutable fields exist, making every method safe for concurrent access.</p>
 *
 * <p>Uses JJWT 0.12.x fluent API (no deprecated methods).</p>
 */
@Component
public class JwtUtil {

    private final SecretKey secretKey;
    private final long expirationMs;

    public JwtUtil(
            @Value("${jwt.secret}") String base64Secret,
            @Value("${jwt.expiration-ms}") long expirationMs) {

        byte[] keyBytes = Base64.getDecoder().decode(
                base64Secret.getBytes(StandardCharsets.UTF_8));
        this.secretKey   = Keys.hmacShaKeyFor(keyBytes);
        this.expirationMs = expirationMs;
    }

    // ── Token generation ─────────────────────────────────────────────────────

    /**
     * Generates a signed JWT containing the user's email (subject) and role claim.
     *
     * @param userDetails Spring Security principal; username == email
     * @param role        Application role string (e.g. "ADMIN")
     * @return compact, URL-safe JWT string
     */
    public String generateToken(UserDetails userDetails, String role) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", role);
        return buildToken(claims, userDetails.getUsername());
    }

    private String buildToken(Map<String, Object> extraClaims, String subject) {
        long now = System.currentTimeMillis();
        return Jwts.builder()
                .claims(extraClaims)
                .subject(subject)
                .issuedAt(new Date(now))
                .expiration(new Date(now + expirationMs))
                .signWith(secretKey)
                .compact();
    }

    // ── Token validation ─────────────────────────────────────────────────────

    /**
     * Returns {@code true} iff the token is structurally valid, signed with our
     * key, not expired, and the subject matches the provided {@link UserDetails}.
     */
    public boolean isTokenValid(String token, UserDetails userDetails) {
        try {
            String subject = extractUsername(token);
            return subject.equals(userDetails.getUsername()) && !isTokenExpired(token);
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    // ── Claims extraction ────────────────────────────────────────────────────

    /** Extracts the email (subject) from the token. */
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /** Extracts the role claim embedded at token generation time. */
    public String extractRole(String token) {
        return extractClaim(token, claims -> claims.get("role", String.class));
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        return claimsResolver.apply(extractAllClaims(token));
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    /** Exposes the configured lifetime so the response DTO can convey it. */
    public long getExpirationMs() {
        return expirationMs;
    }
}
