# House of EdTech

A modern, full-stack educational note-taking and knowledge management platform powered by AI. House of EdTech enables students and educators to create, organize, and summarize notes using LLMs (Groq / OpenAI API), secured with robust JWT authentication and MongoDB data isolation.

---

## Table of Contents

- [Overview](#overview)
- [Monorepo Architecture](#monorepo-architecture)
- [Backend Logic & System Design](#backend-logic--system-design)
  - [Architectural Pattern](#architectural-pattern)
  - [Authentication & Authorization](#authentication--authorization)
  - [Notes Management & Access Control](#notes-management--access-control)
  - [AI Agent & Summary Generation](#ai-agent--summary-generation)
  - [Request Validation Pipeline](#request-validation-pipeline)
  - [Data Models & Schemas](#data-models--schemas)
- [API Reference](#api-reference)
  - [Health & Base](#health--base)
  - [Authentication Endpoints](#authentication-endpoints)
  - [Notes Endpoints](#notes-endpoints)
  - [AI Agent Endpoints](#ai-agent-endpoints)
  - [User Endpoints](#user-endpoints)
- [Environment Variables](#environment-variables)
- [Local Development & Setup](#local-development--setup)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [Database Seeding](#database-seeding)

---

## Overview

House of EdTech is composed of:
- **Backend:** Node.js, Express 5.x, MongoDB (Mongoose), JWT, Yup validation, and Groq Cloud AI SDK.
- **Frontend:** Next.js 16 (App Router), React 19, Tailwind CSS v4, and TypeScript.

---

## Monorepo Architecture

```
houseofedtech/
├── backend/                      # Express REST API & AI Service
│   ├── src/
│   │   ├── agent/                # AI client configuration (Groq SDK)
│   │   ├── config/               # Centralized environment config
│   │   ├── controllers/          # HTTP request handlers & response orchestration
│   │   ├── db/                   # MongoDB connection & seed scripts
│   │   ├── middlewares/          # Auth verification & Yup schema validation
│   │   ├── models/               # Mongoose schemas (User, Note)
│   │   ├── routes/               # Express modular route definitions
│   │   ├── services/             # Core business & database logic
│   │   ├── validations/          # Yup request validation schemas
│   │   ├── app.js                # Express app setup, CORS, JSON middleware
│   │   └── index.js              # Server entry point & DB bootstrap
│   └── package.json
├── frontend/                     # Next.js 16 Web Application
│   ├── app/                      # App router layout and pages
│   └── package.json
└── README.md
```

---

## Backend Logic & System Design

### Architectural Pattern
The backend is structured around the **Layered Architecture (Controller-Service-Repository/Model)** design pattern:
1. **Routing Layer (`src/routes/`)**: Defines HTTP verbs, paths, and binds middleware pipelines (validation, authentication).
2. **Middleware Layer (`src/middlewares/`)**: Intercepts requests for authentication state, token extraction, and payload validation.
3. **Controller Layer (`src/controllers/`)**: Handles HTTP requests, maps params and body, catches exceptions, and formats standard HTTP response codes via `http-status-codes`.
4. **Service Layer (`src/services/`)**: Encapsulates core business logic, database operations via Mongoose models, and AI agent execution.
5. **Persistence Layer (`src/models/` & `src/db/`)**: Data schemas and database lifecycle management with MongoDB.

---

### Authentication & Authorization

- **Password Security**: Passwords are encrypted using `bcrypt` with a cost factor of `10` salt rounds during user registration.
- **Token Generation**: Generates JSON Web Tokens (JWT) containing `{ _id: user._id }` valid for 1 hour.
- **Dual Token Extraction**: The `auth` middleware checks for an active session token in two locations:
  1. `Cookie` header (`token=<jwt>`).
  2. `Authorization` header (`Bearer <jwt>`).
- **Context Injection**: Once verified against `JWT_SECRET`, the user document (excluding the password field) is retrieved from MongoDB and bound to `req.user` for downstream access in all protected routes.
- **Cookie Security**: Auth cookies are marked `httpOnly: true`, and automatically enforce `secure: true` and `sameSite: "none"` in production environments.

---

### Notes Management & Access Control

- **Tenant Data Isolation**: Every note is associated with its creator via `createdBy: req.user.id`.
- **Strict Ownership Verification**: For individual note operations (`GET /:id`, `PATCH /:id`, `DELETE /:id`), the system fetches the note and strictly validates that `note.createdBy === req.user.id`. If a user attempts to view, mutate, or delete another user's note, the request is rejected with `403 Forbidden`.
- **Filtering & Querying**:
  - `tags`: Filter notes matching any tag via `$in` (`?tags=math,science`).
  - `isPinned`: Filter pinned notes (`?isPinned=true` or `?isPinned=false`).
  - `isArchived`: Filter archived notes (`?isArchived=true` or `?isArchived=false`).
- **Population**: Note queries automatically populate creator metadata (`name`, `email`).
- **Large Content Support**: Notes support extensive rich text/markdown content up to 400,000 characters.

---

### AI Agent & Summary Generation

- **Groq Integration**: Utilizes the official `openai` SDK routed through Groq's high-speed endpoint (`https://api.groq.com/openai/v1`).
- **Contextual Processing**: Sends user-supplied prompts or note bodies to the configured LLM (`AI_MODEL`, defaulting to `openai/gpt-oss-20b` or custom models).
- **Structured System Prompting**: Configured by default with a system context prompt instructing the LLM to output clean JSON summaries with key learning takeaways:
  ```json
  {
    "summary": "<summary of the content>",
    "keyPoints": ["<key point 1>", "<key point 2>", "..."]
  }
  ```

---

### Request Validation Pipeline

All incoming mutations are pre-validated before reaching controller logic via Yup schemas (`src/validations/`):
- **Sign Up (`signupSchema`)**: Requires `name`, valid `email`, and `password` of min 6 characters.
- **Login (`loginSchema`)**: Requires valid `email` and `password` of min 6 characters.
- **Create Note (`createNoteSchema`)**: Requires trimmed `title`, `content`, optional `summary`, and optional array of string `tags`.
- **Update Note (`updateNoteSchema`)**: Allows optional partial updates of `title`, `summary`, `content`, `tags`, `isPinned`, and `isArchived`.

Invalid payloads are rejected immediately with a `400 Bad Request` containing an array of human-readable validation errors.

---

### Data Models & Schemas

#### User Schema (`User`)
| Field | Type | Attributes | Description |
|---|---|---|---|
| `name` | String | Required, Trimmed | Full name of user |
| `email` | String | Required, Trimmed, Unique | User email address |
| `password` | String | Required | Bcrypt-hashed password |
| `createdAt` | Date | Auto (timestamps) | Creation timestamp |
| `updatedAt` | Date | Auto (timestamps) | Last update timestamp |

#### Note Schema (`Note`)
| Field | Type | Attributes | Description |
|---|---|---|---|
| `title` | String | Required, Trimmed | Title of the note |
| `summary` | String | Optional, Trimmed | AI-generated or manual summary |
| `content` | String | Required, Max 400,000 chars | Body content / markdown |
| `tags` | Array of Strings | Default `[]` | Categorization tags |
| `isPinned` | Boolean | Default `false` | Pin status |
| `isArchived` | Boolean | Default `false` | Archive status |
| `createdBy` | ObjectId (User) | Required, Ref `User` | Owner reference |
| `createdAt` | Date | Auto (timestamps) | Creation timestamp |
| `updatedAt` | Date | Auto (timestamps) | Last update timestamp |

---

## API Reference

### Health & Base
- `GET /` — Returns welcome message (`{ message: "Welcome to House of EdTech-Backend" }`).
- `GET /health` — Health check endpoint (`{ message: "Health is good" }`).

---

### Authentication Endpoints (`/auth`)

#### 1. Register User
- **Route:** `POST /auth/register`
- **Auth Required:** No
- **Request Body:**
  ```json
  {
    "name": "Alex Johnson",
    "email": "alex@example.com",
    "password": "securepassword123"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "name": "Alex Johnson",
    "email": "alex@example.com",
    "createdAt": "2026-09-25T10:00:00.000Z",
    "updatedAt": "2026-09-25T10:00:00.000Z"
  }
  ```

#### 2. Login User
- **Route:** `POST /auth/login`
- **Auth Required:** No
- **Request Body:**
  ```json
  {
    "email": "alex@example.com",
    "password": "securepassword123"
  }
  ```
- **Response (200 OK):**
  - Sets `token` HTTP-only cookie.
  ```json
  {
    "user": {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "name": "Alex Johnson",
      "email": "alex@example.com"
    }
  }
  ```

#### 3. Current User Profile
- **Route:** `GET /auth/me`
- **Auth Required:** Yes (`Bearer <token>` or cookie)
- **Response (200 OK):**
  ```json
  {
    "user": {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "name": "Alex Johnson",
      "email": "alex@example.com"
    }
  }
  ```

#### 4. Logout
- **Route:** `POST /auth/logout`
- **Auth Required:** Yes
- **Response (200 OK):** Clears authentication cookie.

---

### Notes Endpoints (`/notes`)
*All notes endpoints require authentication.*

#### 1. List Notes
- **Route:** `GET /notes`
- **Query Parameters (optional):**
  - `tags`: Comma-separated list (e.g. `?tags=physics,exam`)
  - `isPinned`: `true` or `false`
  - `isArchived`: `true` or `false`
- **Response (200 OK):** Array of note objects.

#### 2. Get Single Note
- **Route:** `GET /notes/:id`
- **Response (200 OK):** Note object populated with `createdBy` name and email.
- **Errors:** `404 Not Found` if not found; `403 Forbidden` if not note owner.

#### 3. Create Note
- **Route:** `POST /notes`
- **Request Body:**
  ```json
  {
    "title": "Quantum Mechanics Introduction",
    "summary": "Key principles of wave-particle duality.",
    "content": "Detailed notes on Schrodinger equation...",
    "tags": ["physics", "quantum", "lecture-1"]
  }
  ```
- **Response (201 Created):** Created note object.

#### 4. Update Note
- **Route:** `PATCH /notes/:id`
- **Request Body:** Any subset of note fields:
  ```json
  {
    "title": "Quantum Mechanics - Revised",
    "isPinned": true
  }
  ```
- **Response (200 OK):** Updated note object.

#### 5. Delete Note
- **Route:** `DELETE /notes/:id`
- **Response (200 OK):** `{ "message": "Note deleted successfully" }`

---

### AI Agent Endpoints (`/agent`)
*Requires authentication.*

#### 1. Generate Context / Summary
- **Route:** `POST /agent/generate`
- **Request Body:**
  ```json
  {
    "prompt": "Summarize the key takeaways of photosynthesis for high school biology."
  }
  ```
- **Response (200 OK):**
  ```json
  "{\n  \"summary\": \"Photosynthesis is the biological process by which plants convert sunlight into chemical energy.\",\n  \"keyPoints\": [\n    \"Chlorophyll absorbs light energy in the chloroplasts.\",\n    \"Light-dependent reactions produce ATP and NADPH.\",\n    \"Calvin cycle fixes CO2 into glucose.\"\n  ]\n}"
  ```

---

### User Endpoints (`/user`)
*Requires authentication.*

#### 1. List Users
- **Route:** `GET /user/list`
- **Response (200 OK):** Array of registered users.

---

## Environment Variables

Create a `.env` file in the `backend/` directory with the following variables:

```env
# Server
PORT=8080
NODE_ENV=development

# Database
DATABASE_URL=mongodb+srv://<user>:<password>@cluster0.mongodb.net/houseofedtech

# CORS
CORS_ORIGIN=http://localhost:3000

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here

# AI Agent (Groq Cloud)
GROQ_API_KEY=gsk_your_groq_api_key_here
AI_MODEL=openai/gpt-oss-20b
AI_CONTEXT="You are a helpful assistant that that make notes summary from the given content. You should return the notes summary only in JSON format with the following structure: { \"summary\": \"<summary of the content>\", \"keyPoints\": [\"<key point 1>\", \"<key point 2>\", ...] }"
```

---

## Local Development & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [pnpm](https://pnpm.io/) package manager
- A MongoDB cluster instance or local MongoDB server
- A [Groq API Key](https://console.groq.com)

### Backend Setup

```bash
# 1. Navigate to backend directory
cd backend

# 2. Install dependencies
pnpm install

# 3. Configure environment variables
cp .env.example .env # or create .env using the template above

# 4. Start backend in development mode (with nodemon)
pnpm dev

# Or start in production mode
pnpm start
```
The backend will run at `http://localhost:8080`.

### Database Seeding
To populate a test user in the database:
```bash
node src/db/seed.js
```
*Creates a test user: `test@example.com` / `password123`.*

### Frontend Setup

```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install dependencies
pnpm install

# 3. Start Next.js development server
pnpm dev
```
The frontend will run at `http://localhost:3000`.
