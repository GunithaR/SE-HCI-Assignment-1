package com.constructionplatform.app.service;

import com.constructionplatform.app.dto.AuthResponse;
import com.constructionplatform.app.dto.LoginRequest;
import com.constructionplatform.app.dto.RegisterRequest;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}
