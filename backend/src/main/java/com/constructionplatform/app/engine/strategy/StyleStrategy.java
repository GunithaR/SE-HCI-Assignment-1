package com.constructionplatform.app.engine.strategy;

import com.constructionplatform.app.engine.UserAnswers;
import com.constructionplatform.app.entity.Product;
import com.constructionplatform.app.entity.ProductAttribute;
import org.springframework.stereotype.Component;

/**
 * Evaluates how well a product's style matches the user's aesthetic preference.
 * Score: 10 = exact match, 5 = compatible, 2 = mismatch.
 */
@Component
public class StyleStrategy implements RecommendationStrategy {

    @Override
    public double evaluate(Product product, UserAnswers answers) {
        String styleAnswer = answers.getAnswer("style");
        if (styleAnswer == null || styleAnswer.isBlank()) {
            return 5.0; // Neutral
        }

        ProductAttribute attr = product.getAttribute();
        if (attr == null || attr.getStyle() == null || attr.getStyle().isBlank()) {
            return 3.0;
        }

        String userStyle = normalizeStyle(styleAnswer);
        String productStyle = attr.getStyle().toUpperCase();

        if (productStyle.contains(userStyle) || userStyle.contains(productStyle)) {
            return 10.0; // Exact or substring match
        }

        // Check compatible styles
        if (areCompatible(userStyle, productStyle)) {
            return 6.0;
        }

        return 2.0; // Mismatch
    }

    @Override
    public String getStrategyName() {
        return "STYLE";
    }

    private String normalizeStyle(String answer) {
        // Answers are pre-normalised by AnswerNormalizationService;
        // this is a safety net for edge cases.
        return answer.toUpperCase().trim();
    }

    private boolean areCompatible(String style1, String style2) {
        // Define compatibility groups
        if (isModernFamily(style1) && isModernFamily(style2)) return true;
        if (isTraditionalFamily(style1) && isTraditionalFamily(style2)) return true;
        if (isNaturalFamily(style1) && isNaturalFamily(style2)) return true;
        return false;
    }

    private boolean isModernFamily(String style) {
        return style.equals("MODERN") || style.equals("MINIMAL") || style.equals("INDUSTRIAL");
    }

    private boolean isTraditionalFamily(String style) {
        return style.equals("TRADITIONAL") || style.equals("CLASSIC");
    }

    private boolean isNaturalFamily(String style) {
        return style.equals("NATURAL") || style.equals("RUSTIC") || style.equals("WOODEN");
    }
}
