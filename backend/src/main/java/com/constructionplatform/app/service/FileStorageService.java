package com.constructionplatform.app.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

/**
 * Handles storing and deleting product image files on the local filesystem.
 *
 * <p>Files are saved to {@code app.upload.dir} (default: {@code uploads/products})
 * and served publicly at {@code /uploads/**} via Spring's resource handler.</p>
 */
@Service
public class FileStorageService {

    private static final Logger log = LoggerFactory.getLogger(FileStorageService.class);

    private final Path uploadDir;

    public FileStorageService(@Value("${app.upload.dir:uploads/products}") String uploadDirPath) {
        this.uploadDir = Paths.get(uploadDirPath).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.uploadDir);
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory: " + this.uploadDir, e);
        }
    }

    /**
     * Saves the given file to disk and returns the public URL path (e.g.
     * {@code /uploads/products/abc123_photo.jpg}).
     *
     * @param file the uploaded multipart file
     * @return relative public URL path usable by the frontend
     * @throws RuntimeException on I/O failure
     */
    public String store(MultipartFile file) {
        String originalName = StringUtils.cleanPath(
                file.getOriginalFilename() != null ? file.getOriginalFilename() : "image");
        // Strip directory traversal attempts
        if (originalName.contains("..")) {
            throw new RuntimeException("Invalid file name: " + originalName);
        }
        // Preserve extension, prefix with UUID to avoid collisions
        String ext = "";
        int dot = originalName.lastIndexOf('.');
        if (dot >= 0) {
            ext = originalName.substring(dot); // e.g. ".jpg"
        }
        String storedName = UUID.randomUUID().toString() + ext;
        Path target = this.uploadDir.resolve(storedName);

        try {
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file " + storedName, e);
        }

        log.info("FileStorageService: Stored image → {}", target);
        // Return the public URL path
        return "/uploads/products/" + storedName;
    }

    /**
     * Deletes a previously stored file given its public URL path.
     * Silently ignores missing files.
     *
     * @param publicPath public URL path returned by {@link #store}
     */
    public void delete(String publicPath) {
        if (publicPath == null || publicPath.isBlank()) return;
        // Convert "/uploads/products/abc.jpg" → just the filename
        String filename = Paths.get(publicPath).getFileName().toString();
        Path file = this.uploadDir.resolve(filename);
        try {
            Files.deleteIfExists(file);
            log.info("FileStorageService: Deleted image → {}", file);
        } catch (IOException e) {
            log.warn("FileStorageService: Could not delete image {}: {}", file, e.getMessage());
        }
    }
}
