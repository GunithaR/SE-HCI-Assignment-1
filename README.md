# Multi-Brand House Construction Recommendation Platform

A full-stack web application that helps users choose the right construction materials and brands, featuring role-based access control, AI-assisted product recommendation, and product image management.

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
│   │   │   └── WebConfig.java        ← Serves /uploads/** as static files (NEW)
│   │   ├── controller/
│   │   │   ├── AdminController.java  ← Protected admin endpoints
│   │   │   ├── AuthController.java   ← /api/auth/register + /api/auth/login
│   │   │   └── PublicCatalogController.java
│   │   ├── dto/                      ← Request/response data transfer objects
│   │   ├── entity/
│   │   │   ├── Product.java          ← imageUrl field added (NEW)
│   │   │   ├── Brand.java
│   │   │   ├── Category.java
│   │   │   ├── Role.java             ← ADMIN | SUB_ADMIN | CUSTOMER (UPDATED)
│   │   │   └── User.java
│   │   ├── service/
│   │   │   ├── AdminUserService.java ← Sub-admin creation (UPDATED)
│   │   │   ├── FileStorageService.java ← Disk-based image storage (NEW)
│   │   │   └── ProductService.java   ← Image-aware create/update (UPDATED)
│   │   └── security/                 ← JWT utilities + filters
│   └── src/main/resources/
│       └── application.yml           ← DB config + multipart upload config
│
├── frontend/                         ← React + Vite SPA
│   └── src/
│       ├── components/
│       │   ├── AssistantWidget.jsx   ← AI assistant chat widget
│       │   ├── Navbar.jsx
│       │   └── ProtectedRoute.jsx    ← AdminRoute allows ADMIN + SUB_ADMIN
│       ├── context/
│       │   └── AuthContext.jsx       ← isAdmin, isFullAdmin, isSubAdmin (UPDATED)
│       ├── pages/
│       │   ├── AdminDashboard.jsx    ← Product image upload + sub-admin modal (UPDATED)
│       │   ├── Catalog.jsx           ← Product image display (UPDATED)
│       │   ├── Home.jsx              ← Product image display (UPDATED)
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── Results.jsx
│       │   └── Wizard.jsx
│       └── services/
│           ├── apiClient.js
│           ├── authService.js
│           └── catalogService.js     ← FormData image upload (UPDATED)
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
- Guided material selection wizard
- Personalised product results

### Sub-Admin
- Full product catalog management (create, edit, delete)
- Brand and category management
- Upload/replace product images

### Admin (Full)
- Everything Sub-Admin can do
- Create Sub-Admin accounts

---

## 🆕 What Was Built / Updated

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
| `Product.java` | Added nullable `image_url VARCHAR(500)` column (Hibernate auto-creates on first run) |
| `ProductResponseDTO.java` | Added `imageUrl` field populated in `from()` factory |
| `FileStorageService.java` | **NEW** — saves files to `uploads/products/{UUID}.ext`, returns public path, deletes old files on replace |
| `WebConfig.java` | **NEW** — registers `/uploads/**` as a static resource handler pointing to the `uploads/` directory |
| `SecurityConfig.java` | Permits `/uploads/**` without authentication |
| `AdminController.java` | Create/update product endpoints use `multipart/form-data` with `@RequestPart("data")` (JSON) + optional `@RequestPart("image")` |
| `ProductService.java` | `createProduct` and `updateProduct` accept a nullable `MultipartFile`; old image deleted on replace |
| `application.yml` | Multipart enabled, max file size 10 MB, max request 12 MB |
| `catalogService.js` | `createProduct`/`updateProduct` build `FormData` with a JSON Blob part |
| `vite.config.js` | Added `/uploads` proxy to backend so images load in dev |
| `AdminDashboard.jsx` | Product form has styled image picker (hidden input inside `<label>`), live preview, remove button, "current image kept" hint for edits |
| `Home.jsx` | `ProductCard` shows 180 px cover image at the top when `imageUrl` is present |
| `Catalog.jsx` | `ProductCard` shows 180 px cover image at the top when `imageUrl` is present |

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

Copy the example config if `application.yml` is not tracked:

```bash
cp backend/src/main/resources/application.yml.example \
   backend/src/main/resources/application.yml
```

### 3 — Run the Backend

```bash
cd backend
mvn spring-boot:run
```

API available at **http://localhost:8080**

### 4 — Run the Frontend

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
- **Maven** — Build & dependency management

### Frontend
- **React 18** — UI library
- **Vite** — Dev server & bundler
- **React Router v6** — Client-side routing
- **Axios** — HTTP client

---

## 📝 Notes for Collaborators

- `application.yml` **is committed** — clone and run immediately with default credentials (`root`/`root` MySQL, `admin@platform.com`/`Admin@1234`)
- To use different MySQL credentials, edit `backend/src/main/resources/application.yml` (lines 11–12)
- `application.yml.example` is a reference template; the committed `application.yml` is the working config
- Uploaded images are stored in `uploads/products/` relative to where the backend is run — this folder is gitignored and created automatically on first image upload
- JWT tokens expire after 24 hours (configurable in `application.yml` under `jwt.expiration-ms`)
