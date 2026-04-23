# Multi-Brand House Construction Recommendation Platform

A full-stack web application that helps users choose the right construction materials and brands, featuring role-based access control, a **hybrid AI + rule-based recommendation engine**, product image management, and an admin rule management dashboard.

---

## 📁 Project Structure

```
construction-platform/
│
├── backend/                          ← Spring Boot REST API (Java 21 + Maven)
│   ├── src/main/java/com/constructionplatform/app/
│   │   ├── config/
│   │   │   ├── DataSeeder.java       ← Seeds default admin on first run
│   │   │   ├── SecurityConfig.java   ← JWT filter chain, CORS, role rules
│   │   │   └── WebConfig.java        ← Serves /uploads/** as static files
│   │   ├── controller/
│   │   │   ├── AdminController.java  ← Protected admin endpoints
│   │   │   ├── AuthController.java   ← /api/auth/register + /api/auth/login
│   │   │   ├── PublicCatalogController.java
│   │   │   ├── RecommendationController.java      ← Recommendation endpoints (NEW)
│   │   │   └── RecommendationDebugController.java  ← Debug endpoints (NEW)
│   │   ├── dto/
│   │   │   └── recommendation/
│   │   │       ├── HybridRecommendationResponseDTO.java  ← Combined response (NEW)
│   │   │       ├── RecommendationInsightDTO.java          ← AI insight items (NEW)
│   │   │       ├── RecommendationRequestDTO.java          ← Wizard input (NEW)
│   │   │       └── RecommendationResponseDTO.java         ← Per-product scores (NEW)
│   │   ├── engine/
│   │   │   ├── ConditionMatcher.java      ← Evaluates rule conditions (NEW)
│   │   │   ├── AdjustedProductScore.java  ← Score + rule adjustments (NEW)
│   │   │   ├── RecommendationEngine.java  ← Strategy orchestrator (NEW)
│   │   │   ├── RulePostProcessor.java     ← Post-processing rules (NEW)
│   │   │   └── strategy/
│   │   │       ├── RecommendationStrategy.java  ← Strategy interface (NEW)
│   │   │       ├── BudgetStrategy.java           ← Budget scoring (NEW)
│   │   │       ├── MaintenanceStrategy.java      ← Maintenance scoring (NEW)
│   │   │       ├── PerformanceStrategy.java      ← Performance scoring (NEW)
│   │   │       ├── StyleStrategy.java             ← Style scoring (NEW)
│   │   │       └── UsageStrategy.java             ← Usage scoring (NEW)
│   │   ├── entity/
│   │   │   ├── Product.java
│   │   │   ├── Brand.java
│   │   │   ├── Category.java
│   │   │   ├── Role.java             ← ADMIN | SUB_ADMIN | CUSTOMER
│   │   │   ├── User.java
│   │   │   ├── Rule.java             ← Rule entity (NEW)
│   │   │   └── RuleCondition.java    ← Condition entity (NEW)
│   │   ├── service/
│   │   │   ├── AdminUserService.java
│   │   │   ├── FileStorageService.java
│   │   │   ├── ProductService.java
│   │   │   ├── RecommendationService.java               ← Hybrid pipeline (NEW)
│   │   │   ├── AnswerNormalizationService.java           ← AI normalizer (NEW)
│   │   │   ├── ExplanationAIService.java                 ← AI explanations (NEW)
│   │   │   ├── RecommendationAugmentationService.java    ← AI insights (NEW)
│   │   │   └── RecommendationInsightValidator.java       ← Insight validator (NEW)
│   │   └── security/                 ← JWT utilities + filters
│   └── src/main/resources/
│       └── application.yml           ← DB + Gemini AI config
│
├── frontend/                         ← React + Vite SPA
│   └── src/
│       ├── components/
│       │   ├── AssistantWidget.jsx   ← AI assistant chat widget
│       │   ├── Navbar.jsx
│       │   └── ProtectedRoute.jsx
│       ├── context/
│       │   └── AuthContext.jsx
│       ├── pages/
│       │   ├── AdminDashboard.jsx
│       │   ├── Catalog.jsx
│       │   ├── Home.jsx
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── Results.jsx           ← Score breakdown, rule vis, AI explanations (UPDATED)
│       │   └── Wizard.jsx
│       └── services/
│           ├── apiClient.js          ← 60s timeout for AI pipeline (UPDATED)
│           ├── authService.js
│           └── catalogService.js
│
├── uploads/                          ← Created at runtime, stores product images
├── .gitignore
└── README.md
```

---

## ✨ Features

### Public
- Browse products filtered by category with search
- View product images, pricing, attributes, and budget level
- AI assistant widget for material recommendations
- User registration and login

### Customer
- Guided material selection wizard with dynamic questions
- **Hybrid AI + Rule-based** personalised product recommendations
- Score breakdown per strategy (Budget, Style, Performance, Maintenance, Usage)
- AI-generated explanations for each product recommendation
- AI-generated contextual insights and trade-off analysis
- Product comparison with side-by-side attribute tables
- Rule-based score adjustments and product exclusions (visually indicated)

### Sub-Admin
- Full product catalog management (create, edit, delete)
- Brand and category management
- Upload/replace product images
- Rule management (add/edit/deactivate scoring rules)

### Admin (Full)
- Everything Sub-Admin can do
- Create Sub-Admin accounts

---

## 🧠 Hybrid Recommendation Architecture

The recommendation engine uses a **3-step hybrid pipeline**:

```
User Answers → [1. AI Normalize] → [2. Strategy Scoring] → [3. Rule Post-Processing] → Results
                    ↓                      ↓                        ↓
              Gemini 2.5 Flash      5 Strategy engines        Rule engine applies
              maps free-text to     score each product        ADD_SCORE, DEDUCT_SCORE,
              system enums          0-10 per dimension        and FILTER_OUT rules
```

### Step 1 — AI Answer Normalization
`AnswerNormalizationService` uses **Google Gemini** to map raw user input (e.g., "I want something cheap") to system enums (e.g., `LOW`). Falls back to deterministic identity mapping on failure.

### Step 2 — Strategy Scoring
Five `RecommendationStrategy` implementations score each product independently:

| Strategy | Evaluates |
|----------|-----------|
| `BudgetStrategy` | Price alignment with budget preference |
| `StyleStrategy` | Visual/aesthetic match |
| `PerformanceStrategy` | Durability and slip resistance |
| `MaintenanceStrategy` | Maintenance level preference |
| `UsageStrategy` | Suitability for intended area/traffic |

### Step 3 — Rule Post-Processing
`RulePostProcessor` applies admin-configured rules via the `ConditionMatcher`:
- **ADD_SCORE** — Bonus points for products meeting conditions
- **DEDUCT_SCORE** — Penalty for products meeting conditions
- **FILTER_OUT** — Exclude product entirely (shown grayed out in UI)

### AI Augmentation Layer
After scoring, two additional Gemini calls enhance the response:
- **Batch Explanations** — A single Gemini call generates AI explanations for all 5 products simultaneously
- **Contextual Insights** — AI generates trade-off analysis and tips for the Additional Insights card

> All AI calls include retry with backoff for 429 rate limiting. Deterministic fallbacks ensure the system works without AI.

---

## 🔧 AI Configuration

The platform uses **Google Gemini API** (free tier). Configure in `application.yml`:

```yaml
ai:
  gemini:
    api-key: "YOUR_GEMINI_API_KEY"
    url: https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent
```

### Free Tier Limits
| Model | Daily Requests | RPM |
|-------|---------------|-----|
| gemini-2.5-flash-lite | ~500 | 15 |
| gemini-2.5-flash | 20 | 10 |
| gemini-2.0-flash | 1,500 | 15 |

> Each wizard run makes **3 Gemini calls** (normalize + batch explain + augment) with 2-second delays between calls.

---

## 🆕 What Was Built / Updated

### Hybrid Recommendation Engine
| Component | Description |
|-----------|-------------|
| `RecommendationEngine` | Orchestrates strategy-based scoring |
| `RecommendationStrategy` (×5) | Budget, Style, Performance, Maintenance, Usage scoring |
| `RulePostProcessor` | Applies admin rules as post-processing adjustments |
| `ConditionMatcher` | Evaluates rule conditions against answers & product attributes |
| `AdjustedProductScore` | Holds final score with rule adjustment metadata |
| `AnswerNormalizationService` | AI-powered answer normalization (Gemini + fallback) |
| `ExplanationAIService` | AI explanation generation per product |
| `RecommendationAugmentationService` | AI contextual insights with validation |
| `RecommendationInsightValidator` | Sanitises AI insights against ranked results |

### Frontend Results Page (`Results.jsx`)
| Feature | Description |
|---------|-------------|
| Score Breakdown | Animated bars per strategy dimension (Budget, Style, etc.) |
| Rule Adjustments | Shows applied rule names and score delta (±pts) |
| Excluded Products | Grayed-out cards with "⛔ Excluded by Rule" badge |
| AI Explanations | Server-generated explanations displayed per card |
| Additional Insights | AI-generated trade-off analysis and tips |
| Product Comparison | Side-by-side attribute table with AI narrative |

### Debug Endpoints
| Endpoint | Purpose |
|----------|---------|
| `POST /api/public/debug/normalize` | Inspect raw vs AI-normalized answers |
| `POST /api/public/debug/rule-impact` | Compare strategy-only vs rule-adjusted scores |

### Role System — `SUB_ADMIN`
- Added `SUB_ADMIN` to the `Role` enum alongside `ADMIN` and `CUSTOMER`
- `SecurityConfig` grants `/api/admin/**` access to both `ADMIN` and `SUB_ADMIN`
- The `POST /api/admin/sub-admins` endpoint is restricted to `ADMIN` only (`@PreAuthorize("hasRole('ADMIN')")`)
- Frontend `AuthContext` exposes three flags:
  - `isAdmin` — true for both ADMIN and SUB_ADMIN (controls admin route access)
  - `isFullAdmin` — true only for ADMIN (controls the "Add Sub-Admin" button)
  - `isSubAdmin` — true only for SUB_ADMIN

### Product Image Upload
| Layer | Change |
|-------|--------|
| `Product.java` | Added nullable `image_url VARCHAR(500)` column |
| `FileStorageService.java` | Saves files to `uploads/products/{UUID}.ext` |
| `WebConfig.java` | Registers `/uploads/**` as a static resource handler |
| `AdminController.java` | Create/update use `multipart/form-data` |
| `AdminDashboard.jsx` | Styled image picker with live preview |

> **Backward compatible** — existing products with no image are unaffected; all image fields are nullable.

---

## 🚀 Getting Started

### Prerequisites

| Tool | Version |
|------|---------|
| Java | 21+ |
| Maven | 3.9+ |
| Node.js | 18+ |
| MySQL | 8+ |

### 1 — Clone

```bash
git clone https://github.com/YOUR_USERNAME/construction-platform.git
cd construction-platform
```

### 2 — Configure the Database

The app auto-creates all tables on first run (`ddl-auto: update`).

> Default credentials: **`root` / `root`**. To change them edit `backend/src/main/resources/application.yml`.

### 3 — Configure Gemini AI (Optional)

Get a free API key from [Google AI Studio](https://aistudio.google.com/apikey) and set it in `application.yml`:

```yaml
ai:
  gemini:
    api-key: "YOUR_API_KEY"
```

> The recommendation engine works without AI — it falls back to deterministic scoring and explanations.

### 4 — Run the Backend

```bash
cd backend
mvn spring-boot:run
```

API available at **http://localhost:8080**

### 5 — Run the Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

App available at **http://localhost:5173**

---

## 🔑 Default Admin Credentials

| Field | Value |
|-------|-------|
| Email | `admin@platform.com` |
| Password | `Admin@1234` |

---

## 🗄️ Key API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/register` | Public | Register a new customer |
| POST | `/api/auth/login` | Public | Login, returns JWT |
| GET | `/api/public/products` | Public | List products (paginated, filterable) |
| GET | `/api/public/categories` | Public | List all categories |
| GET | `/api/public/brands` | Public | List all brands |
| GET | `/api/public/questions/{category}` | Public | Get wizard questions for category |
| POST | `/api/public/recommendations` | Public | Get ranked recommendations |
| POST | `/api/public/recommendations/hybrid` | Public | Get AI-augmented recommendations |
| POST | `/api/public/recommendations/explain` | Public | Get AI explanation for a product |
| POST | `/api/public/recommendations/compare` | Public | Compare selected products |
| POST | `/api/admin/products` | ADMIN / SUB_ADMIN | Create product (multipart) |
| PUT | `/api/admin/products/{id}` | ADMIN / SUB_ADMIN | Update product (multipart) |
| DELETE | `/api/admin/products/{id}` | ADMIN / SUB_ADMIN | Delete product |
| POST | `/api/admin/sub-admins` | ADMIN only | Create a sub-admin account |
| GET | `/uploads/**` | Public | Serve uploaded product images |

---

## 🛠️ Tech Stack

### Backend
- **Spring Boot 3.4.3** — REST API framework
- **Spring Security + JWT (JJWT 0.12.5)** — Stateless authentication
- **Spring Data JPA + Hibernate** — ORM, auto DDL
- **MySQL 8** — Relational database
- **Google Gemini API** — AI normalization, explanations, insights
- **Maven** — Build & dependency management

### Frontend
- **React 18** — UI library
- **Vite** — Dev server & bundler
- **React Router v6** — Client-side routing
- **Axios** — HTTP client (60s timeout for AI pipeline)

---

## 📝 Notes for Collaborators

- `application.yml` **is committed** — clone and run immediately with default credentials (`root`/`root` MySQL, `admin@platform.com`/`Admin@1234`)
- To use different MySQL credentials, edit `backend/src/main/resources/application.yml` (lines 11–12)
- Gemini API key is configured in `application.yml` under `ai.gemini.api-key`
- The recommendation engine works fully without AI (deterministic fallback). AI enhances explanations and insights only.
- Each wizard run makes 3 Gemini API calls — be mindful of free tier daily limits
- Uploaded images are stored in `uploads/products/` relative to where the backend is run — this folder is gitignored and created automatically on first image upload
- JWT tokens expire after 24 hours (configurable in `application.yml` under `jwt.expiration-ms`)
- The Vite proxy has a 120s timeout (`proxyTimeout`) for the AI pipeline — do not reduce this
