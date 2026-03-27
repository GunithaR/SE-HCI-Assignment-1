package com.constructionplatform.app.engine;

import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

/**
 * Maps user-friendly wizard answers to system-level attribute values.
 * Example: "Economy" → budget = "LOW"
 */
@Component
public class UserInputMapper {

    private static final Map<String, Map<String, String>> ANSWER_MAPPINGS = new HashMap<>();

    static {
        // Budget mappings
        Map<String, String> budgetMap = new HashMap<>();
        budgetMap.put("Economy", "LOW");
        budgetMap.put("economy", "LOW");
        budgetMap.put("Mid-Range", "MEDIUM");
        budgetMap.put("mid-range", "MEDIUM");
        budgetMap.put("Premium", "HIGH");
        budgetMap.put("premium", "HIGH");
        ANSWER_MAPPINGS.put("budget", budgetMap);

        // Climate / environment mappings
        Map<String, String> climateMap = new HashMap<>();
        climateMap.put("Coastal Area", "COASTAL");
        climateMap.put("coastal area", "COASTAL");
        climateMap.put("Hot & Dry", "HOT_DRY");
        climateMap.put("hot & dry", "HOT_DRY");
        climateMap.put("Rainy & Humid", "TROPICAL");
        climateMap.put("rainy & humid", "TROPICAL");
        climateMap.put("Cold Climate", "COLD");
        climateMap.put("cold climate", "COLD");
        climateMap.put("General / Mixed", "ALL");
        climateMap.put("general / mixed", "ALL");
        ANSWER_MAPPINGS.put("climate", climateMap);
        ANSWER_MAPPINGS.put("location", climateMap);
        ANSWER_MAPPINGS.put("environment", climateMap);

        // Maintenance mappings
        Map<String, String> maintenanceMap = new HashMap<>();
        maintenanceMap.put("Very Low Maintenance", "LOW");
        maintenanceMap.put("very low maintenance", "LOW");
        maintenanceMap.put("Moderate Maintenance", "MEDIUM");
        maintenanceMap.put("moderate maintenance", "MEDIUM");
        maintenanceMap.put("High Maintenance OK", "HIGH");
        maintenanceMap.put("high maintenance ok", "HIGH");
        ANSWER_MAPPINGS.put("maintenancePreference", maintenanceMap);
        ANSWER_MAPPINGS.put("maintenance", maintenanceMap);

        // Style mappings
        Map<String, String> styleMap = new HashMap<>();
        styleMap.put("Modern", "Modern");
        styleMap.put("Traditional", "Traditional");
        styleMap.put("Rustic", "Rustic");
        styleMap.put("Industrial", "Industrial");
        styleMap.put("Minimalist", "Minimalist");
        styleMap.put("Contemporary", "Contemporary");
        styleMap.put("No Preference", "ANY");
        ANSWER_MAPPINGS.put("style", styleMap);

        // Durability mappings
        Map<String, String> durabilityMap = new HashMap<>();
        durabilityMap.put("Standard (5-10 yrs)", "5");
        durabilityMap.put("Long-lasting (15+ yrs)", "8");
        durabilityMap.put("Maximum Durability", "10");
        ANSWER_MAPPINGS.put("durabilityPreference", durabilityMap);
    }

    /**
     * Map a user-friendly answer to its system-level attribute value.
     * If no mapping exists, returns the original value (pass-through).
     */
    public String mapAnswer(String attributeName, String userAnswer) {
        if (attributeName == null || userAnswer == null) {
            return userAnswer;
        }
        Map<String, String> attrMap = ANSWER_MAPPINGS.get(attributeName);
        if (attrMap != null && attrMap.containsKey(userAnswer)) {
            return attrMap.get(userAnswer);
        }
        return userAnswer; // pass-through if no mapping found
    }

    /**
     * Map an entire InputProfile's user-friendly values to system values.
     */
    public InputProfile mapProfile(InputProfile raw) {
        if (raw == null) return null;
        InputProfile mapped = new InputProfile();
        mapped.setBudget(mapAnswer("budget", raw.getBudget()));
        mapped.setClimate(mapAnswer("climate", raw.getClimate()));
        mapped.setStyle(mapAnswer("style", raw.getStyle()));
        mapped.setDurabilityPreference(mapAnswer("durabilityPreference", raw.getDurabilityPreference()));
        mapped.setMaintenancePreference(mapAnswer("maintenancePreference", raw.getMaintenancePreference()));
        mapped.setHouseType(raw.getHouseType()); // pass-through
        return mapped;
    }
}
