package com.constructionplatform.app.service;

import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {
    String store(MultipartFile file);
    void delete(String publicUrl);
}
