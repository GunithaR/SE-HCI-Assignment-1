package com.constructionplatform.app.engine;

public class InputProfile {

    private String budget;
    private String climate;
    private String style;
    private String durabilityPreference;
    private String maintenancePreference;
    private String houseType;

    public InputProfile() {
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
