package com.constructionplatform.app.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class SupabaseConfig {

    private final String url;
    private final String key;
    private final String bucket;

    public SupabaseConfig(
            @Value("${supabase.url:}") String url,
            @Value("${supabase.key:}") String key,
            @Value("${supabase.bucket:products}") String bucket) {
        this.url = url;
        this.key = key;
        this.bucket = bucket;
    }

    @Bean(name = "supabaseRestTemplate")
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    public String getUrl() {
        return url;
    }

    public String getKey() {
        return key;
    }

    public String getBucket() {
        return bucket;
    }
}
