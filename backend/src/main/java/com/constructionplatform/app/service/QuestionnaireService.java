package com.constructionplatform.app.service;

import com.constructionplatform.app.dto.recommendation.QuestionDTO;
import com.constructionplatform.app.dto.recommendation.QuestionDTO.OptionDTO;
import com.constructionplatform.app.dto.recommendation.QuestionSetDTO;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * Returns category-specific question sets for the guided recommendation wizard.
 * Questions are defined in code for simplicity and extensibility.
 */
@Service
public class QuestionnaireService {

    private static final Map<String, QuestionSetDTO> QUESTION_SETS = new LinkedHashMap<>();

    static {
        QUESTION_SETS.put("Roofing Solution", buildRoofingQuestions());
        QUESTION_SETS.put("Flooring Solution", buildFlooringQuestions());
        QUESTION_SETS.put("Wall Solution", buildWallQuestions());
        QUESTION_SETS.put("Ceiling Solution", buildCeilingQuestions());
        QUESTION_SETS.put("Accessories", buildAccessoriesQuestions());
    }

    public QuestionSetDTO getQuestions(String category) {
        // Try exact match first
        QuestionSetDTO qs = QUESTION_SETS.get(category);
        if (qs != null) return qs;

        // Try case-insensitive partial match
        for (Map.Entry<String, QuestionSetDTO> entry : QUESTION_SETS.entrySet()) {
            if (entry.getKey().toLowerCase().contains(category.toLowerCase())
                    || category.toLowerCase().contains(entry.getKey().toLowerCase().replace(" solution", ""))) {
                return entry.getValue();
            }
        }

        return null;
    }

    public List<String> getAvailableCategories() {
        return new ArrayList<>(QUESTION_SETS.keySet());
    }

    // ── Roofing ──────────────────────────────────────────────────────────────

    private static QuestionSetDTO buildRoofingQuestions() {
        List<QuestionDTO> questions = List.of(
                new QuestionDTO("location",
                        "Where is your house located?",
                        "Different locations demand different roofing materials for optimal protection.",
                        List.of(
                                new OptionDTO("coastal", "🌊 Coastal Area", "Saltwater exposure, high humidity"),
                                new OptionDTO("heavy rain", "🌧️ Heavy Rain Area", "Frequent heavy downpours"),
                                new OptionDTO("hot/dry", "☀️ Hot/Dry Area", "Intense sun, minimal rain"),
                                new OptionDTO("urban/normal", "🏙️ Urban/Normal", "Standard weather conditions")
                        )),
                new QuestionDTO("concern",
                        "What is your main concern?",
                        "We'll prioritize products that best address your primary requirement.",
                        List.of(
                                new OptionDTO("keep cost low", "💰 Keep Cost Low", "Budget-friendly materials"),
                                new OptionDTO("keep house cool", "❄️ Keep House Cool", "Heat-reflective roofing"),
                                new OptionDTO("long-lasting", "🛡️ Long-Lasting", "Maximum durability and lifespan"),
                                new OptionDTO("reduce noise", "🔇 Reduce Noise", "Sound-dampening properties")
                        )),
                new QuestionDTO("maintenance",
                        "Maintenance preference?",
                        "How much effort are you willing to invest in roof upkeep?",
                        List.of(
                                new OptionDTO("low", "✨ Very Low", "Minimal upkeep needed"),
                                new OptionDTO("medium", "🔧 Medium", "Periodic inspections and cleaning"),
                                new OptionDTO("high", "🚿 High", "Regular treatment and care")
                        )),
                new QuestionDTO("style",
                        "Style preference?",
                        "Match your roof to your home's architectural vision.",
                        List.of(
                                new OptionDTO("modern", "🏢 Modern", "Sleek, clean lines"),
                                new OptionDTO("traditional", "🏡 Traditional", "Classic, timeless look"),
                                new OptionDTO("natural", "🌿 Natural", "Earthy, organic feel"),
                                new OptionDTO("industrial", "🏭 Industrial", "Raw, functional aesthetic")
                        )),
                new QuestionDTO("budget",
                        "Budget?",
                        "This helps us recommend materials within your financial comfort zone.",
                        List.of(
                                new OptionDTO("economy", "💵 Economy", "Cost-effective solutions"),
                                new OptionDTO("mid-range", "💎 Mid-Range", "Balance of quality and price"),
                                new OptionDTO("premium", "👑 Premium", "Top-tier, no compromises")
                        ))
        );
        return new QuestionSetDTO("Roofing Solution", questions);
    }

    // ── Flooring ─────────────────────────────────────────────────────────────

    private static QuestionSetDTO buildFlooringQuestions() {
        List<QuestionDTO> questions = List.of(
                new QuestionDTO("flooring_usage",
                        "Where will the flooring be used?",
                        "Different areas have different requirements for moisture, durability, and slip resistance.",
                        List.of(
                                new OptionDTO("living/bedroom", "🛋️ Living/Bedroom", "General living spaces"),
                                new OptionDTO("bathroom/wet area", "🚿 Bathroom/Wet Area", "Moisture-prone zones"),
                                new OptionDTO("outdoor", "🌳 Outdoor", "Exposed to weather elements"),
                                new OptionDTO("commercial", "🏢 Commercial", "High-traffic business areas")
                        )),
                new QuestionDTO("traffic",
                        "Traffic level?",
                        "Higher foot traffic requires more durable flooring.",
                        List.of(
                                new OptionDTO("low", "🚶 Low", "Light use, residential bedrooms"),
                                new OptionDTO("medium", "👥 Medium", "Regular household foot traffic"),
                                new OptionDTO("high", "👟 High", "Heavy daily foot traffic")
                        )),
                new QuestionDTO("priority",
                        "Priority?",
                        "What matters most to you when choosing flooring?",
                        List.of(
                                new OptionDTO("affordable", "💰 Affordable", "Best value for budget"),
                                new OptionDTO("appearance", "🎨 Appearance", "Visual appeal comes first"),
                                new OptionDTO("long-lasting", "🛡️ Long-Lasting", "Maximum lifespan and durability"),
                                new OptionDTO("easy to clean", "✨ Easy to Clean", "Low-effort maintenance")
                        )),
                new QuestionDTO("slip_resistance",
                        "Slip resistance needed?",
                        "Essential for wet areas, families with children, or elderly residents.",
                        List.of(
                                new OptionDTO("yes", "✅ Yes", "High grip for safety"),
                                new OptionDTO("no", "❌ No", "Not a priority")
                        )),
                new QuestionDTO("style",
                        "Style?",
                        "Match the floor to your interior design vision.",
                        List.of(
                                new OptionDTO("modern", "🏢 Modern", "Sleek, contemporary look"),
                                new OptionDTO("wooden look", "🪵 Wooden Look", "Warm wood-grain finish"),
                                new OptionDTO("marble look", "💎 Marble Look", "Elegant stone finish"),
                                new OptionDTO("rustic", "🏚️ Rustic", "Raw, natural character")
                        ))
        );
        return new QuestionSetDTO("Flooring Solution", questions);
    }

    // ── Wall Solutions ───────────────────────────────────────────────────────

    private static QuestionSetDTO buildWallQuestions() {
        List<QuestionDTO> questions = List.of(
                new QuestionDTO("wall_usage",
                        "Usage area?",
                        "Wall solutions vary based on room conditions and requirements.",
                        List.of(
                                new OptionDTO("living room", "🛋️ Living Room", "Main family/gathering space"),
                                new OptionDTO("bedroom", "🛏️ Bedroom", "Private, comfort-focused area"),
                                new OptionDTO("kitchen", "🍳 Kitchen", "Heat, moisture, and grease exposure"),
                                new OptionDTO("bathroom", "🚿 Bathroom", "High moisture environment")
                        )),
                new QuestionDTO("priority",
                        "Priority?",
                        "What's most important for your walls?",
                        List.of(
                                new OptionDTO("decoration", "🎨 Decoration", "Visual appeal and aesthetics"),
                                new OptionDTO("protection", "🛡️ Protection", "Durability and wall integrity"),
                                new OptionDTO("easy cleaning", "✨ Easy Cleaning", "Wipe-clean, low maintenance"),
                                new OptionDTO("budget", "💰 Budget", "Cost-effective solution")
                        )),
                new QuestionDTO("environment",
                        "Environment?",
                        "The moisture level affects which wall treatments work best.",
                        List.of(
                                new OptionDTO("humid", "💧 Humid", "High moisture, condensation risk"),
                                new OptionDTO("dry", "☀️ Dry", "Low humidity, warm air"),
                                new OptionDTO("normal", "🌤️ Normal", "Moderate humidity levels")
                        )),
                new QuestionDTO("style",
                        "Style?",
                        "Match the wall finish to your design theme.",
                        List.of(
                                new OptionDTO("modern", "🏢 Modern", "Clean, sleek finishes"),
                                new OptionDTO("wooden finish", "🪵 Wooden Finish", "Warm wood-panel look"),
                                new OptionDTO("textured", "🧱 Textured", "3D or raised patterns"),
                                new OptionDTO("minimal", "⬜ Minimal", "Simple, understated elegance")
                        )),
                new QuestionDTO("budget",
                        "Budget?",
                        "This helps us find wall solutions within your budget range.",
                        List.of(
                                new OptionDTO("economy", "💵 Economy", "Cost-effective options"),
                                new OptionDTO("mid", "💎 Mid", "Balance of quality and price"),
                                new OptionDTO("premium", "👑 Premium", "Luxury materials and finishes")
                        ))
        );
        return new QuestionSetDTO("Wall Solution", questions);
    }

    // ── Ceiling ──────────────────────────────────────────────────────────────

    private static QuestionSetDTO buildCeilingQuestions() {
        List<QuestionDTO> questions = List.of(
                new QuestionDTO("goal",
                        "Main goal?",
                        "What do you primarily need from your ceiling solution?",
                        List.of(
                                new OptionDTO("appearance", "🎨 Appearance", "Beautiful ceiling design"),
                                new OptionDTO("heat reduction", "❄️ Heat Reduction", "Thermal insulation"),
                                new OptionDTO("hide wiring", "🔌 Hide Wiring", "Conceal cables and pipes"),
                                new OptionDTO("sound insulation", "🔇 Sound Insulation", "Noise dampening")
                        )),
                new QuestionDTO("room_type",
                        "Room type?",
                        "Different rooms have different ceiling requirements.",
                        List.of(
                                new OptionDTO("living room", "🛋️ Living Room", "Main living space"),
                                new OptionDTO("bedroom", "🛏️ Bedroom", "Quiet, comfortable space"),
                                new OptionDTO("kitchen", "🍳 Kitchen", "Heat and moisture exposure"),
                                new OptionDTO("office", "💼 Office", "Professional, acoustic needs")
                        )),
                new QuestionDTO("maintenance",
                        "Maintenance?",
                        "How much ceiling maintenance are you willing to do?",
                        List.of(
                                new OptionDTO("low", "✨ Low", "Install and forget"),
                                new OptionDTO("medium", "🔧 Medium", "Occasional upkeep"),
                                new OptionDTO("high", "🚿 High", "Regular care and cleaning")
                        )),
                new QuestionDTO("style",
                        "Style?",
                        "Match the ceiling to your room's design language.",
                        List.of(
                                new OptionDTO("modern", "🏢 Modern", "Sleek, contemporary design"),
                                new OptionDTO("traditional", "🏡 Classic", "Timeless, elegant patterns"),
                                new OptionDTO("minimal", "⬜ Minimal", "Clean, understated lines")
                        )),
                new QuestionDTO("budget",
                        "Budget?",
                        "Helps us match ceiling options to your spending plans.",
                        List.of(
                                new OptionDTO("economy", "💵 Economy", "Budget-friendly picks"),
                                new OptionDTO("mid", "💎 Mid", "Good quality/value balance"),
                                new OptionDTO("premium", "👑 Premium", "Top-tier materials")
                        ))
        );
        return new QuestionSetDTO("Ceiling Solution", questions);
    }

    // ── Accessories ──────────────────────────────────────────────────────────

    private static QuestionSetDTO buildAccessoriesQuestions() {
        List<QuestionDTO> questions = List.of(
                new QuestionDTO("accessory_type",
                        "Type?",
                        "What kind of accessory are you looking for?",
                        List.of(
                                new OptionDTO("installation", "🔩 Installation", "Screws, anchors, fasteners"),
                                new OptionDTO("finishing", "🖌️ Finishing", "Trim, sealants, tapes"),
                                new OptionDTO("decorative", "🎀 Decorative", "Handles, hooks, accents")
                        )),
                new QuestionDTO("priority",
                        "Priority?",
                        "What matters most when choosing accessories?",
                        List.of(
                                new OptionDTO("durability", "🛡️ Durability", "Built to last"),
                                new OptionDTO("cost", "💰 Cost", "Best bang for your buck"),
                                new OptionDTO("compatibility", "🔗 Compatibility", "Works with your components"),
                                new OptionDTO("appearance", "🎨 Appearance", "Looks great")
                        )),
                new QuestionDTO("usage_duration",
                        "Usage?",
                        "How long do you plan to use these accessories?",
                        List.of(
                                new OptionDTO("one-time", "⚡ One-Time", "Single use or temporary"),
                                new OptionDTO("long-term", "♾️ Long-Term", "Ongoing, permanent use")
                        )),
                new QuestionDTO("usage_environment",
                        "Environment?",
                        "Will the accessories be used indoors or outdoors?",
                        List.of(
                                new OptionDTO("indoor", "🏠 Indoor", "Sheltered, controlled climate"),
                                new OptionDTO("outdoor", "🌳 Outdoor", "Exposed to weather")
                        )),
                new QuestionDTO("budget",
                        "Budget?",
                        "Helps us filter accessories by your budget range.",
                        List.of(
                                new OptionDTO("economy", "💵 Economy", "Affordable basics"),
                                new OptionDTO("mid", "💎 Mid", "Quality with value"),
                                new OptionDTO("premium", "👑 Premium", "Professional-grade items")
                        ))
        );
        return new QuestionSetDTO("Accessories", questions);
    }
}
