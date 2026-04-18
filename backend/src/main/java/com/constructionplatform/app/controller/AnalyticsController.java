package com.constructionplatform.app.controller;

import com.constructionplatform.app.entity.SiteVisit;
import com.constructionplatform.app.repository.SiteVisitRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public/analytics")
public class AnalyticsController {

    private final SiteVisitRepository siteVisitRepository;

    public AnalyticsController(SiteVisitRepository siteVisitRepository) {
        this.siteVisitRepository = siteVisitRepository;
    }

    @PostMapping("/visit")
    public ResponseEntity<Void> recordVisit() {
        SiteVisit visit = new SiteVisit();
        siteVisitRepository.save(visit);
        return ResponseEntity.ok().build();
    }
}
