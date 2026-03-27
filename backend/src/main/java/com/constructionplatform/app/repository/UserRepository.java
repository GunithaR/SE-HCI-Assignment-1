package com.constructionplatform.app.repository;

import com.constructionplatform.app.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository for {@link User}.
 * PK is a String (UUID canonical form) to ensure MySQL VARCHAR compatibility.
 */
@Repository
public interface UserRepository extends JpaRepository<User, String> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);
}
