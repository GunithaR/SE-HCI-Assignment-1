package com.constructionplatform.app.controller;

import com.constructionplatform.app.dto.recommendation.QuestionSetDTO;
import com.constructionplatform.app.service.QuestionnaireService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Public endpoints for the dynamic questionnaire system.
 */
@RestController
@RequestMapping("/api/public/questions")
public class QuestionnaireController {

    private final QuestionnaireService questionnaireService;

    public QuestionnaireController(QuestionnaireService questionnaireService) {
        this.questionnaireService = questionnaireService;
    }

    /**
     * Returns all available category names for the wizard category selector.
     */
    @GetMapping("/categories")
    public ResponseEntity<List<String>> getCategories() {
        return ResponseEntity.ok(questionnaireService.getAvailableCategories());
    }

    /**
     * Returns the category-specific question set for the given category.
     */
    @GetMapping("/{category}")
    public ResponseEntity<QuestionSetDTO> getQuestions(@PathVariable String category) {
        QuestionSetDTO questionSet = questionnaireService.getQuestions(category);
        if (questionSet == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(questionSet);
    }
}
