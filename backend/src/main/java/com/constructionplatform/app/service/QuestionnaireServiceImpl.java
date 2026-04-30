package com.constructionplatform.app.service;

import com.constructionplatform.app.dto.recommendation.QuestionDTO;
import com.constructionplatform.app.dto.recommendation.QuestionDTO.OptionDTO;
import com.constructionplatform.app.dto.recommendation.QuestionSetDTO;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class QuestionnaireServiceImpl implements QuestionnaireService {

    private static final Map<String, QuestionSetDTO> QUESTION_SETS = new LinkedHashMap<>();

    static {
        QUESTION_SETS.put("Roofing Solution", buildRoofingQuestions());
        QUESTION_SETS.put("Flooring Solution", buildFlooringQuestions());
        QUESTION_SETS.put("Wall Solution", buildWallQuestions());
        QUESTION_SETS.put("Ceiling Solution", buildCeilingQuestions());
        QUESTION_SETS.put("Accessories", buildAccessoriesQuestions());
    }

    @Override
    public QuestionSetDTO getQuestions(String category) {
        QuestionSetDTO qs = QUESTION_SETS.get(category);
        if (qs != null) return qs;

        for (Map.Entry<String, QuestionSetDTO> entry : QUESTION_SETS.entrySet()) {
            if (entry.getKey().toLowerCase().contains(category.toLowerCase())
                    || category.toLowerCase().contains(entry.getKey().toLowerCase().replace(" solution", ""))) {
                return entry.getValue();
            }
        }
        return null;
    }

    @Override
    public List<String> getAvailableCategories() {
        return new ArrayList<>(QUESTION_SETS.keySet());
    }

    private static QuestionSetDTO buildRoofingQuestions() {
        List<QuestionDTO> questions = List.of(
                new QuestionDTO("location", "Where is your house located?", "Different locations demand different roofing materials.", List.of(
                        new OptionDTO("coastal", "🌊 Coastal Area", "Saltwater exposure"),
                        new OptionDTO("heavy rain", "🌧️ Heavy Rain Area", "Frequent rain"),
                        new OptionDTO("hot/dry", "☀️ Hot/Dry Area", "Intense sun"),
                        new OptionDTO("urban/normal", "🏙️ Urban/Normal", "Standard weather")
                )),
                new QuestionDTO("concern", "What is your main concern?", "Priority requirement.", List.of(
                        new OptionDTO("keep cost low", "💰 Keep Cost Low", "Budget-friendly"),
                        new OptionDTO("keep house cool", "❄️ Keep House Cool", "Heat-reflective"),
                        new OptionDTO("long-lasting", "🛡️ Long-Lasting", "Maximum durability"),
                        new OptionDTO("reduce noise", "🔇 Reduce Noise", "Sound-dampening")
                )),
                new QuestionDTO("maintenance", "Maintenance preference?", "Effort level.", List.of(
                        new OptionDTO("low", "✨ Very Low", "Minimal upkeep"),
                        new OptionDTO("medium", "🔧 Medium", "Periodic care"),
                        new OptionDTO("high", "🚿 High", "Regular treatment")
                )),
                new QuestionDTO("style", "Style preference?", "Architectural vision.", List.of(
                        new OptionDTO("modern", "🏢 Modern", "Sleek lines"),
                        new OptionDTO("traditional", "🏡 Traditional", "Classic patterns"),
                        new OptionDTO("natural", "🌿 Natural", "Organic feel"),
                        new OptionDTO("industrial", "🏭 Industrial", "Raw aesthetic")
                )),
                new QuestionDTO("budget", "Budget?", "Financial range.", List.of(
                        new OptionDTO("economy", "💵 Economy", "Cost-effective"),
                        new OptionDTO("mid-range", "💎 Mid-Range", "Quality balance"),
                        new OptionDTO("premium", "👑 Premium", "Top-tier")
                ))
        );
        return new QuestionSetDTO("Roofing Solution", questions);
    }

    private static QuestionSetDTO buildFlooringQuestions() {
        List<QuestionDTO> questions = List.of(
                new QuestionDTO("flooring_usage", "Where will it be used?", "Area requirements.", List.of(
                        new OptionDTO("living/bedroom", "🛋️ Living/Bedroom", "General spaces"),
                        new OptionDTO("bathroom/wet area", "🚿 Bathroom/Wet Area", "Moisture-prone"),
                        new OptionDTO("outdoor", "🌳 Outdoor", "Exposed elements"),
                        new OptionDTO("commercial", "🏢 Commercial", "High-traffic")
                )),
                new QuestionDTO("traffic", "Traffic level?", "Foot traffic durability.", List.of(
                        new OptionDTO("low", "🚶 Low", "Light use"),
                        new OptionDTO("medium", "👥 Medium", "Regular use"),
                        new OptionDTO("high", "👟 High", "Heavy use")
                )),
                new QuestionDTO("priority", "Priority?", "Main factor.", List.of(
                        new OptionDTO("affordable", "💰 Affordable", "Best value"),
                        new OptionDTO("appearance", "🎨 Appearance", "Visual appeal"),
                        new OptionDTO("long-lasting", "🛡️ Long-Lasting", "Max lifespan"),
                        new OptionDTO("easy to clean", "✨ Easy to Clean", "Low effort")
                )),
                new QuestionDTO("slip_resistance", "Slip resistance?", "Safety priority.", List.of(
                        new OptionDTO("yes", "✅ Yes", "High grip"),
                        new OptionDTO("no", "❌ No", "Not a priority")
                )),
                new QuestionDTO("style", "Style?", "Design vision.", List.of(
                        new OptionDTO("modern", "🏢 Modern", "Sleek look"),
                        new OptionDTO("wooden look", "🪵 Wooden Look", "Warm grain"),
                        new OptionDTO("marble look", "💎 Marble Look", "Elegant stone"),
                        new OptionDTO("rustic", "🏚️ Rustic", "Natural character")
                ))
        );
        return new QuestionSetDTO("Flooring Solution", questions);
    }

    private static QuestionSetDTO buildWallQuestions() {
        List<QuestionDTO> questions = List.of(
                new QuestionDTO("wall_usage", "Usage area?", "Room conditions.", List.of(
                        new OptionDTO("living room", "🛋️ Living Room", "Family space"),
                        new OptionDTO("bedroom", "🛏️ Bedroom", "Private area"),
                        new OptionDTO("kitchen", "🍳 Kitchen", "Heat/grease"),
                        new OptionDTO("bathroom", "🚿 Bathroom", "High moisture")
                )),
                new QuestionDTO("priority", "Priority?", "Important factor.", List.of(
                        new OptionDTO("decoration", "🎨 Decoration", "Aesthetics"),
                        new OptionDTO("protection", "🛡️ Protection", "Wall integrity"),
                        new OptionDTO("easy cleaning", "✨ Easy Cleaning", "Wipe-clean"),
                        new OptionDTO("budget", "💰 Budget", "Cost-effective")
                )),
                new QuestionDTO("environment", "Environment?", "Moisture levels.", List.of(
                        new OptionDTO("humid", "💧 Humid", "Moisture risk"),
                        new OptionDTO("dry", "☀️ Dry", "Warm air"),
                        new OptionDTO("normal", "🌤️ Normal", "Moderate")
                )),
                new QuestionDTO("style", "Style?", "Design theme.", List.of(
                        new OptionDTO("modern", "🏢 Modern", "Sleek finishes"),
                        new OptionDTO("wooden finish", "🪵 Wooden Finish", "Warm panels"),
                        new OptionDTO("textured", "🧱 Textured", "3D patterns"),
                        new OptionDTO("minimal", "⬜ Minimal", "Understated")
                )),
                new QuestionDTO("budget", "Budget?", "Financial comfort.", List.of(
                        new OptionDTO("economy", "💵 Economy", "Affordable"),
                        new OptionDTO("mid", "💎 Mid", "Quality balance"),
                        new OptionDTO("premium", "👑 Premium", "Luxury")
                ))
        );
        return new QuestionSetDTO("Wall Solution", questions);
    }

    private static QuestionSetDTO buildCeilingQuestions() {
        List<QuestionDTO> questions = List.of(
                new QuestionDTO("goal", "Main goal?", "Primary need.", List.of(
                        new OptionDTO("appearance", "🎨 Appearance", "Design focus"),
                        new OptionDTO("heat reduction", "❄️ Heat Reduction", "Insulation"),
                        new OptionDTO("hide wiring", "🔌 Hide Wiring", "Conceal cables"),
                        new OptionDTO("sound insulation", "🔇 Sound Insulation", "Dampening")
                )),
                new QuestionDTO("room_type", "Room type?", "Room requirements.", List.of(
                        new OptionDTO("living room", "🛋️ Living Room", "Main space"),
                        new OptionDTO("bedroom", "🛏️ Bedroom", "Quiet space"),
                        new OptionDTO("kitchen", "🍳 Kitchen", "Heat/moisture"),
                        new OptionDTO("office", "💼 Office", "Acoustic needs")
                )),
                new QuestionDTO("maintenance", "Maintenance?", "Upkeep effort.", List.of(
                        new OptionDTO("low", "✨ Low", "Install and forget"),
                        new OptionDTO("medium", "🔧 Medium", "Occasional care"),
                        new OptionDTO("high", "🚿 High", "Regular cleaning")
                )),
                new QuestionDTO("style", "Style?", "Design language.", List.of(
                        new OptionDTO("modern", "🏢 Modern", "Sleek design"),
                        new OptionDTO("traditional", "🏡 Classic", "Patterned"),
                        new OptionDTO("minimal", "⬜ Minimal", "Clean lines")
                )),
                new QuestionDTO("budget", "Budget?", "Spending plan.", List.of(
                        new OptionDTO("economy", "💵 Economy", "Budget picks"),
                        new OptionDTO("mid", "💎 Mid", "Value balance"),
                        new OptionDTO("premium", "👑 Premium", "Top-tier")
                ))
        );
        return new QuestionSetDTO("Ceiling Solution", questions);
    }

    private static QuestionSetDTO buildAccessoriesQuestions() {
        List<QuestionDTO> questions = List.of(
                new QuestionDTO("accessory_type", "Type?", "Category.", List.of(
                        new OptionDTO("installation", "🔩 Installation", "Fasteners"),
                        new OptionDTO("finishing", "🖌️ Finishing", "Trim/sealants"),
                        new OptionDTO("decorative", "🎀 Decorative", "Accents")
                )),
                new QuestionDTO("priority", "Priority?", "Decision factor.", List.of(
                        new OptionDTO("durability", "🛡️ Durability", "Built to last"),
                        new OptionDTO("cost", "💰 Cost", "Value for money"),
                        new OptionDTO("compatibility", "🔗 Compatibility", "Works with others"),
                        new OptionDTO("appearance", "🎨 Appearance", "Looks great")
                )),
                new QuestionDTO("usage_duration", "Usage?", "Time span.", List.of(
                        new OptionDTO("one-time", "⚡ One-Time", "Temporary"),
                        new OptionDTO("long-term", "♾️ Long-Term", "Permanent")
                )),
                new QuestionDTO("usage_environment", "Environment?", "Location.", List.of(
                        new OptionDTO("indoor", "🏠 Indoor", "Sheltered"),
                        new OptionDTO("outdoor", "🌳 Outdoor", "Exposed")
                )),
                new QuestionDTO("budget", "Budget?", "Price range.", List.of(
                        new OptionDTO("economy", "💵 Economy", "Basics"),
                        new OptionDTO("mid", "💎 Mid", "Value quality"),
                        new OptionDTO("premium", "👑 Premium", "Pro-grade")
                ))
        );
        return new QuestionSetDTO("Accessories", questions);
    }
}
