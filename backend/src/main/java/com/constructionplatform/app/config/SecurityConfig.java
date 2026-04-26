package com.constructionplatform.app.config;

import com.constructionplatform.app.security.JwtAuthenticationFilter;
import com.constructionplatform.app.security.UserDetailsServiceImpl;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

/**
 * Central Spring Security configuration.
 *
 * <p>
 * Route access matrix:
 * <ul>
 * <li>{@code /api/auth/**} — public (login, register)</li>
 * <li>{@code /api/public/**} — public (catalog browsing by guests)</li>
 * <li>{@code /api/admin/**} — ADMIN role required</li>
 * <li>{@code /api/user/**} — authenticated users (any role)</li>
 * <li>Everything else — authenticated</li>
 * </ul>
 *
 * <p>
 * Session management is STATELESS — JWTs replace server-side sessions.
 * </p>
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final UserDetailsServiceImpl userDetailsService;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthFilter,
            UserDetailsServiceImpl userDetailsService) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.userDetailsService = userDetailsService;
    }

    // Filter Chain
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Disable CSRF — tokens already protect against CSRF for REST APIs
                .csrf(AbstractHttpConfigurer::disable)

                // CORS — allow the React dev server (adjust in production)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // Route access rules
                .authorizeHttpRequests(auth -> auth
                        // ── Public endpoints
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/public/**").permitAll()
                        .requestMatchers("/api/chat/**").permitAll() // AI Chatbot
                        .requestMatchers("/uploads/**").permitAll() // product images
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() // pre-flight

                        // ── Admin-only endpoints (ADMIN or SUB_ADMIN) ────────────
                        // Fine-grained restrictions (e.g. creating new admins) are
                        // enforced at the method level via @PreAuthorize.
                        .requestMatchers("/api/admin/**").hasAnyRole("ADMIN", "SUB_ADMIN")

                        // ── Authenticated user endpoints ──────────────────────────
                        .requestMatchers("/api/user/**").authenticated()

                        // ── Anything else requires authentication ─────────────────
                        .anyRequest().authenticated())

                // Stateless session — no HttpSession created or used
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // Wire our custom authentication provider
                .authenticationProvider(authenticationProvider())

                // Insert JWT filter before the default username/password filter
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // Authentication Provider

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    // Password Encoder
    /**
     * BCrypt with default strength (10 rounds).
     * Declared as a {@code @Bean} so it can be injected throughout the application
     * (e.g., in {@code AuthService}) without circular dependencies.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // CORS

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        // Allow React dev server and Vercel deployments
        // Included all related websites

        config.setAllowedOriginPatterns(List.of(
                "http://localhost:5173",
                "http://localhost:3000",
                "https://lplus-sivilima.vercel.app",
                "https://se-hci-assignment-v2-git-main-gunithastcblk-2343.vercel.app",
                "https://se-hci-assignment-v2-45oh8b38x-gunithastcblk-2343s-projects.vercel.app"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
