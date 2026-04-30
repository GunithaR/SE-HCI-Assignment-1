package com.constructionplatform.app.service;

import com.constructionplatform.app.config.SupabaseConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Service
public class FileStorageServiceImpl implements FileStorageService {

    private static final Logger log = LoggerFactory.getLogger(FileStorageServiceImpl.class);

    private final SupabaseConfig supabaseConfig;
    private final RestTemplate restTemplate;

    public FileStorageServiceImpl(SupabaseConfig supabaseConfig, @Qualifier("supabaseRestTemplate") RestTemplate restTemplate) {
        this.supabaseConfig = supabaseConfig;
        this.restTemplate = restTemplate;
    }

    @Override
    public String store(MultipartFile file) {
        if (file.isEmpty()) {
            throw new RuntimeException("Failed to store empty file.");
        }

        String originalName = StringUtils.cleanPath(
                file.getOriginalFilename() != null ? file.getOriginalFilename() : "image");
        
        String ext = "";
        int dot = originalName.lastIndexOf('.');
        if (dot >= 0) {
            ext = originalName.substring(dot);
        }
        String storedName = UUID.randomUUID().toString() + ext;

        try {
            String bucket = supabaseConfig.getBucket();
            String baseUrl = supabaseConfig.getUrl();
            if (baseUrl.endsWith("/")) {
                baseUrl = baseUrl.substring(0, baseUrl.length() - 1);
            }

            String uploadUrl = baseUrl + "/storage/v1/object/" + bucket + "/" + storedName;

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + supabaseConfig.getKey());
            headers.set("apikey", supabaseConfig.getKey());
            String contentType = file.getContentType();
            if (contentType == null) contentType = "application/octet-stream";
            headers.setContentType(MediaType.valueOf(contentType));

            HttpEntity<byte[]> requestEntity = new HttpEntity<>(file.getBytes(), headers);

            ResponseEntity<String> response = restTemplate.postForEntity(uploadUrl, requestEntity, String.class);

            if (!response.getStatusCode().is2xxSuccessful()) {
                throw new RuntimeException("Supabase upload failed with status: " + response.getStatusCode());
            }

            log.info("FileStorageService: Uploaded image to Supabase → {}", storedName);

            return baseUrl + "/storage/v1/object/public/" + bucket + "/" + storedName;

        } catch (IOException e) {
            throw new RuntimeException("Failed to read file bytes for upload", e);
        } catch (Exception e) {
            throw new RuntimeException("Failed to upload file to Supabase: " + e.getMessage(), e);
        }
    }

    @Override
    public void delete(String publicUrl) {
        if (publicUrl == null || publicUrl.isBlank() || !publicUrl.contains("/storage/v1/object/public/")) {
            return;
        }

        try {
            String bucket = supabaseConfig.getBucket();
            String filename = publicUrl.substring(publicUrl.lastIndexOf("/") + 1);

            String baseUrl = supabaseConfig.getUrl();
            if (baseUrl.endsWith("/")) {
                baseUrl = baseUrl.substring(0, baseUrl.length() - 1);
            }

            String deleteUrl = baseUrl + "/storage/v1/object/" + bucket + "/" + filename;

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + supabaseConfig.getKey());
            headers.set("apikey", supabaseConfig.getKey());

            HttpEntity<Void> requestEntity = new HttpEntity<>(headers);

            restTemplate.exchange(deleteUrl, HttpMethod.DELETE, requestEntity, String.class);
            log.info("FileStorageService: Deleted image from Supabase → {}", filename);

        } catch (Exception e) {
            log.warn("FileStorageService: Could not delete image from Supabase {}: {}", publicUrl, e.getMessage());
        }
    }
}
