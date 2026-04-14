package com.constructionplatform.app.controller;

import com.constructionplatform.app.entity.ProductAttribute;
import com.constructionplatform.app.repository.ProductRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Provides metadata about product attributes for the admin rule creation UI.
 * Returns available attribute names and their possible values.
 */
@RestController
@RequestMapping("/api/admin/product-attributes")
public class ProductAttributeMetaController {

    private final ProductRepository productRepository;

    public ProductAttributeMetaController(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @GetMapping("/meta")
    public ResponseEntity<Map<String, Object>> getAttributeMetadata() {
        List<Map<String, Object>> attributes = new ArrayList<>();

        // Enum-based attributes with fixed values
        attributes.add(buildEnumAttribute("budgetLevel", "Budget Level",
                Arrays.stream(ProductAttribute.BudgetLevel.values()).map(Enum::name).toList()));
        attributes.add(buildEnumAttribute("maintenanceLevel", "Maintenance Level",
                Arrays.stream(ProductAttribute.MaintenanceLevel.values()).map(Enum::name).toList()));
        attributes.add(buildEnumAttribute("climateSuitability", "Climate Suitability",
                Arrays.stream(ProductAttribute.ClimateSuitability.values()).map(Enum::name).toList()));
        attributes.add(buildEnumAttribute("material", "Material",
                Arrays.stream(ProductAttribute.Material.values()).map(Enum::name).toList()));
        attributes.add(buildEnumAttribute("size", "Size",
                Arrays.stream(ProductAttribute.ProductSize.values()).map(Enum::name).toList()));
        attributes.add(buildEnumAttribute("waterResistance", "Water Resistance",
                Arrays.stream(ProductAttribute.ResistanceLevel.values()).map(Enum::name).toList()));
        attributes.add(buildEnumAttribute("corrosionResistance", "Corrosion Resistance",
                Arrays.stream(ProductAttribute.ResistanceLevel.values()).map(Enum::name).toList()));
        attributes.add(buildEnumAttribute("heatResistance", "Heat Resistance",
                Arrays.stream(ProductAttribute.ResistanceLevel.values()).map(Enum::name).toList()));
        attributes.add(buildEnumAttribute("slipResistance", "Slip Resistance",
                Arrays.stream(ProductAttribute.ResistanceLevel.values()).map(Enum::name).toList()));
        attributes.add(buildEnumAttribute("noiseReduction", "Noise Reduction",
                Arrays.stream(ProductAttribute.ResistanceLevel.values()).map(Enum::name).toList()));

        // Durability rating (now enum-based like resistance levels)
        attributes.add(buildEnumAttribute("durabilityRating", "Durability Rating",
                Arrays.stream(ProductAttribute.ResistanceLevel.values()).map(Enum::name).toList()));

        // Free-text attributes — fetch distinct values from DB
        List<String> styles = productRepository.findAll().stream()
                .filter(p -> p.getAttribute() != null && p.getAttribute().getStyle() != null)
                .map(p -> p.getAttribute().getStyle())
                .distinct()
                .sorted()
                .collect(Collectors.toList());
        attributes.add(buildAttribute("style", "Style", "TEXT", styles));

        List<String> usageAreas = productRepository.findAll().stream()
                .filter(p -> p.getAttribute() != null && p.getAttribute().getUsageArea() != null)
                .map(p -> p.getAttribute().getUsageArea())
                .distinct()
                .sorted()
                .collect(Collectors.toList());
        attributes.add(buildAttribute("usageArea", "Usage Area", "TEXT", usageAreas));

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("attributes", attributes);
        return ResponseEntity.ok(response);
    }

    private Map<String, Object> buildEnumAttribute(String name, String label, List<String> values) {
        return buildAttribute(name, label, "ENUM", values);
    }

    private Map<String, Object> buildAttribute(String name, String label, String type, List<String> values) {
        Map<String, Object> attr = new LinkedHashMap<>();
        attr.put("name", name);
        attr.put("label", label);
        attr.put("type", type);
        attr.put("values", values);
        return attr;
    }
}
