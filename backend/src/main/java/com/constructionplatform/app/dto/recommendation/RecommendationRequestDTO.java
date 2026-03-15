package com.constructionplatform.app.dto.recommendation;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class RecommendationRequestDTO {

    @NotBlank(message = "Budget is required")
    private String budget;

    @NotBlank(message = "Climate is required")
    private String climate;

    private String style;

    @NotBlank(message = "Durability preference is required")
    private String durabilityPreference;

    @NotBlank(message = "Maintenance preference is required")
    private String maintenancePreference;

    private String houseType;

    public RecommendationRequestDTO() {
    }

    public String getBudget() {
        return budget;
    }

    public void setBudget(String budget) {
        this.budget = budget;
    }

    public String getClimate() {
        return climate;
    }

    public void setClimate(String climate) {
        this.climate = climate;
    }

    public String getStyle() {
        return style;
    }

    public void setStyle(String style) {
        this.style = style;
    }

    public String getDurabilityPreference() {
        return durabilityPreference;
    }

    public void setDurabilityPreference(String durabilityPreference) {
        this.durabilityPreference = durabilityPreference;
    }

    public String getMaintenancePreference() {
        return maintenancePreference;
    }

    public void setMaintenancePreference(String maintenancePreference) {
        this.maintenancePreference = maintenancePreference;
    }

    public String getHouseType() {
        return houseType;
    }

    public void setHouseType(String houseType) {
        this.houseType = houseType;
    }
}
