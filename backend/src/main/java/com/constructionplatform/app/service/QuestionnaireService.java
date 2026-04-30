package com.constructionplatform.app.service;

import com.constructionplatform.app.dto.recommendation.QuestionSetDTO;
import java.util.List;

public interface QuestionnaireService {
    QuestionSetDTO getQuestions(String category);
    List<String> getAvailableCategories();
}
