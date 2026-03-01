package com.constructionplatform.app.service;

import com.constructionplatform.app.dto.AdminUserCreateRequestDTO;
import com.constructionplatform.app.dto.AuthResponse;
import com.constructionplatform.app.entity.Role;
import com.constructionplatform.app.entity.User;
import com.constructionplatform.app.repository.UserRepository;
import com.constructionplatform.app.security.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Use-case layer for Admin user management.
 *
 * <p>
 * Allows an existing ADMIN to create additional ADMIN accounts.
 * Duplicate email addresses are rejected with an
 * {@link IllegalArgumentException}
 * which the
 * {@link com.constructionplatform.app.exception.GlobalExceptionHandler}
 * converts into an HTTP 409 Conflict response.
 */
@Service
public class AdminUserService {

    private static final Logger log = LoggerFactory.getLogger(AdminUserService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;

    public AdminUserService(UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil,
            UserDetailsService userDetailsService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    /**
     * Creates a new ADMIN account.
     *
     * @param request validated DTO containing email and password
     * @return an {@link AuthResponse} with the JWT token for the new admin
     * @throws IllegalArgumentException if the email is already registered
     */
    @Transactional
    public AuthResponse createAdminUser(AdminUserCreateRequestDTO request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException(
                    "An account with email '" + request.getEmail() + "' already exists.");
        }

        User newAdmin = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(Role.ADMIN)
                .build();

        userRepository.save(newAdmin);
        log.info("AdminUserService: New ADMIN account created → email=[{}]", newAdmin.getEmail());

        // Return a ready-to-use JWT so the new admin can authenticate immediately
        UserDetails userDetails = userDetailsService.loadUserByUsername(newAdmin.getEmail());
        String token = jwtUtil.generateToken(userDetails, Role.ADMIN.name());

        return AuthResponse.builder()
                .token(token)
                .email(newAdmin.getEmail())
                .role(Role.ADMIN.name())
                .expiresIn(jwtUtil.getExpirationMs())
                .build();
    }
}
