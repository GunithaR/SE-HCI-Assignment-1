# Multi-Brand House Construction Recommendation Platform

A full-stack web application that helps users choose the right materials and brands for house construction.

---

## 📁 Project Structure

```
construction-platform/          ← GitHub Repo Root
│
├── backend/                    ← Spring Boot REST API (Java 21 + Maven)
│   ├── src/
│   │   └── main/
│   │       ├── java/           ← All Java source code
│   │       └── resources/
│   │           ├── application.yml          ← Config (edit DB credentials here)
│   │           └── application.yml.example  ← Template reference
│   ├── pom.xml
│   └── .gitignore
│
├── frontend/                   ← React + Vite SPA
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── services/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── .gitignore
│
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started (Collaborators)

### Prerequisites

| Tool | Version |
|------|---------|
| Java | 21+ |
| Maven | 3.9+ |
| Node.js | 18+ |
| MySQL | 8+ |

---

### ⚙️ Step 1 – Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/construction-platform.git
cd construction-platform
```

---

### 🗄️ Step 2 – Set Up the Database

Open MySQL and make sure it's running. The app will auto-create the database on first run.

> Default config uses **username: `root` / password: `root`**. If your MySQL has different credentials, edit `backend/src/main/resources/application.yml`.

---

### ⚙️ Step 3 – Run the Backend

```bash
cd backend
mvn spring-boot:run
```

Backend starts at **http://localhost:8080**

---

### 🖥️ Step 4 – Run the Frontend

Open a **new terminal**:

```bash
cd frontend
npm install
npm run dev
```

Frontend starts at **http://localhost:5173**

---

## 🔑 Default Admin Login

| Field | Value |
|-------|-------|
| Email | `admin@platform.com` |
| Password | `Admin@1234` |

---

## 🛠️ Tech Stack

### Backend
- **Spring Boot 3.4** — REST API
- **Spring Security + JWT** — Authentication
- **Spring Data JPA + Hibernate** — ORM
- **MySQL 8** — Database
- **Maven** — Build tool

### Frontend
- **React 18** — UI framework
- **Vite** — Build tool & dev server
- **React Router** — Client-side routing
