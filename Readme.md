# Krishi Connect

Krishi Connect is a multi-part smart agriculture platform that combines a modern React frontend, a Node.js/Express API, a Flask-based machine-learning service, and pre-trained crop lifecycle models to help farmers manage fields, monitor crop stages, understand climate risk, plan irrigation, and explore financial support workflows.

At a high level, the repository is organized around four major layers:

- **`client/`**: a Vite + React application that provides the user interface for farmers and government users.
- **`server/`**: a Node.js + Express + PostgreSQL backend that handles authentication, fields, crops, dashboards, government schemes, and climate claim workflows.
- **`flaskserver/`**: a Python Flask service used for ML-backed crop lifecycle prediction and MongoDB-backed supporting services.
- **`models/`**: training and inference assets for crop stage duration and irrigation prediction.

This repository is best understood as an integrated agricultural platform rather than a single isolated app. Some areas are fully connected to APIs, while other areas still use placeholder/demo data in the UI and are clearly positioned for future backend integration.

---

## Table of Contents

1. [What the Platform Does](#what-the-platform-does)
2. [Who It Is For](#who-it-is-for)
3. [Core Capabilities](#core-capabilities)
4. [System Architecture](#system-architecture)
5. [Repository Structure](#repository-structure)
6. [Frontend Application](#frontend-application)
7. [Node.js API Server](#nodejs-api-server)
8. [Flask ML Service](#flask-ml-service)
9. [Machine Learning Models](#machine-learning-models)
10. [Data Flow Across the System](#data-flow-across-the-system)
11. [Authentication and Roles](#authentication-and-roles)
12. [Main User Journeys](#main-user-journeys)
13. [Installation and Local Development](#installation-and-local-development)
14. [Environment Variables](#environment-variables)
15. [Available Scripts](#available-scripts)
16. [API Overview](#api-overview)
17. [Current Implementation Notes](#current-implementation-notes)
18. [Troubleshooting](#troubleshooting)
19. [Suggested Next Improvements](#suggested-next-improvements)
20. [License](#license)

---

## What the Platform Does

Krishi Connect is designed to support digital agriculture workflows such as:

- creating and selecting farm fields,
- viewing farmer dashboards,
- tracking crop lifecycle information,
- generating crop and irrigation predictions,
- analyzing climate and resource conditions,
- filing climate damage claims,
- reviewing agricultural schemes and support options, and
- separating farmer and government experiences through role-aware routes.

The frontend exposes these workflows through dedicated pages such as dashboard, climate analysis, crop lifecycle, crop prediction, yield prediction, irrigation/water management, financial aid, AI assistant, field creation, and climate damage claims.

The backend side of the repository is split intentionally:

- the **Node server** handles production-style business API concerns like users, JWT auth, role-aware routing, PostgreSQL persistence, and REST endpoints,
- while the **Flask service** focuses on prediction-oriented and data-science-adjacent workflows, including loading trained `.pkl` models and generating crop timelines plus irrigation schedules.

---

## Who It Is For

Krishi Connect appears to target at least two distinct user groups:

### 1. Farmers
Farmers are the primary operational users of the product. Their workflows include:

- registering and logging in,
- creating and viewing fields,
- selecting active fields,
- checking dashboards,
- monitoring crop growth and lifecycle progress,
- using prediction tools,
- planning irrigation and water management,
- exploring financial aid,
- and submitting climate-related damage claims.

### 2. Government or administrative users
Government users have a separate dashboard path and are positioned to:

- review policy-facing information,
- view analytics at a broader level,
- inspect climate claim workflows,
- and access agricultural scheme information relevant to farmer support.

---

## Core Capabilities

## Frontend-facing capabilities

- Farmer dashboard with quick actions and summary cards.
- Government dashboard routing.
- Protected route handling for authenticated and role-specific pages.
- Field selection stored in shared app context.
- Crop lifecycle interface for adding and listing crop records.
- Climate damage claim form with scheme selection and document/photo upload UX.
- Crop prediction, yield prediction, irrigation, financial aid, AI assistant, and climate analysis pages.
- Shared layout with sidebar, mobile responsiveness, and persistent navigation shell.

## Backend/API capabilities

- JWT-style authentication architecture.
- Role-aware access patterns for farmer and government use cases.
- PostgreSQL-backed entities including users, fields, crops, irrigation records, fertilizer applications, claims, and schemes.
- Health routes and API overview routes.
- Rate limiting, CORS handling, request logging, compression, and Helmet-based security headers.

## ML/prediction capabilities

- Loading pre-trained duration and irrigation models from disk.
- Generating stage-by-stage crop timelines.
- Computing predicted harvest date and total duration.
- Producing weekly irrigation schedules.
- Generating synthetic seasonal weather and soil values when live integrations are not present.

---

## System Architecture

```text
┌────────────────────────────────────────────────────────────────────┐
│                           React Frontend                           │
│                      (client/ - Vite + React)                      │
└───────────────┬───────────────────────────────┬────────────────────┘
                │                               │
                │ REST / UI integration         │ REST / prediction integration
                │                               │
        ┌───────▼────────┐              ┌───────▼────────┐
        │ Node API Server │              │ Flask ML Server │
        │ server/         │              │ flaskserver/    │
        │ Express + PG    │              │ Flask + MongoDB │
        └───────┬────────┘              └───────┬─────────┘
                │                               │
                │ PostgreSQL                    │ Model files / MongoDB services
                │                               │
        ┌───────▼────────┐              ┌───────▼────────────────────┐
        │ Relational Data │              │ Trained models + services  │
        │ users/fields/   │              │ duration/irrigation PKLs   │
        │ crops/claims    │              │ weather/soil derived input │
        └────────────────┘              └────────────────────────────┘
```

This split architecture lets the project evolve in stages:

- a web application for user interaction,
- a structured API for business logic and durable relational records,
- and a separate prediction-focused service for ML-enhanced features.

---

## Repository Structure

```text
Krishi___Connect/
├── Readme.md
├── client/                     # React + Vite frontend
├── server/                     # Node.js + Express + PostgreSQL backend
├── flaskserver/                # Flask + MongoDB + ML integration backend
├── models/                     # Training, inference, and trained model assets
├── test_integration.py         # Python integration test helper
└── CROP_INTEGRATION_README.md  # Crop lifecycle integration notes
```

### Important directories in more detail

#### `client/`
Contains the UI application, routing, contexts, pages, reusable components, CSS, and frontend-side services.

#### `server/`
Contains the main production-style API server, middleware, route handlers, configuration, initialization logic, and service layer code.

#### `flaskserver/`
Contains the Python service that loads trained models, exposes prediction logic, initializes MongoDB services, and supports crop lifecycle/yield workflows.

#### `models/`
Contains training data, training scripts, visualization artifacts, and the serialized model files used by the Flask service.

---

## Frontend Application

The frontend is built with **React**, **Vite**, **React Router**, **TailwindCSS**, **Font Awesome**, and chart-related dependencies.

### Frontend technology stack

- React 19
- Vite 7
- React Router DOM 7
- TailwindCSS 4
- Chart.js + react-chartjs-2
- Font Awesome + React Icons
- ESLint for linting

### Frontend route model

The application uses public and protected routes.

#### Public routes
- `/login`
- `/signup`

#### Protected authenticated routes
- `/`
- `/ai-assistant`

#### Farmer-specific routes
- `/dashboard`
- `/climate`
- `/farm-console`
- `/crop-management`
- `/crop-planning`
- `/crop-health`
- `/financial-aid`
- `/climate-damage-claim`
- `/water-management`
- `/irrigation`
- `/create-field`
- `/fields`
- `/field-list`
- `/field/:id` and other field-detail-oriented routes depending on page usage
- `/crop-lifecycle`
- `/crop-prediction`
- `/yield-prediction`

#### Government-specific routes
- `/government-dashboard`

### Layout and shared shell

The frontend wraps most authenticated pages in a reusable `Layout` component that provides:

- responsive sidebar behavior,
- mobile open/close state,
- page transition animation behavior,
- a persistent navigation shell,
- and a floating chatbot button.

### Contexts

#### `AuthContext`
The authentication context currently stores user data in `localStorage`, exposes `login`, `signup`, and `logout`, and derives helpful flags such as:

- `isAuthenticated`
- `isFarmer`
- `isGovernment`

At the moment, this context uses a simulated/mock login/signup flow rather than calling the real backend directly.

#### `AppContext`
The app context manages shared field and analytics state, including:

- selected field,
- selected location,
- fetched field list,
- loading state,
- analytics buckets (`weather`, `vegetation`, `soil`, `water`),
- and refresh/update helpers.

It also triggers a coordinate update helper when the selected field changes.

### Representative frontend feature areas

#### Dashboard
The dashboard presents quick actions for field creation, crop lifecycle, crop prediction, and yield prediction, along with cards for recent fields, AI recommendations, and yield summaries.

#### Crop lifecycle
The crop lifecycle page lets users:

- select a field,
- add a crop,
- inspect crop records,
- and view basic lifecycle milestones such as sowing date and expected harvest date.

#### Climate damage claim workflow
The climate claim page includes:

- personal details,
- incident details,
- crop and weather metadata,
- scheme lookup/selection,
- file upload UX for photos/documents,
- severity categorization,
- and simulated submission state management.

---

## Node.js API Server

The `server/` directory contains the main Express backend intended for structured application data and business workflows.

### Backend technology stack

- Node.js
- Express
- PostgreSQL (`pg`)
- JWT (`jsonwebtoken`)
- bcrypt (`bcryptjs`)
- Joi / validators
- Helmet
- CORS
- compression
- express-rate-limit
- Winston logging
- Jest + Supertest for testing dependencies

### Backend responsibilities

The Express server is responsible for:

- booting the API service,
- connecting to PostgreSQL,
- checking and initializing database state,
- mounting authentication and business routes,
- exposing health information,
- logging requests,
- and handling errors consistently.

### Middleware included

- `helmet` for security headers
- `compression` for response compression
- rate limiting for `/api/*`
- CORS with configurable allowed origins
- JSON and URL-encoded body parsers
- request/response timing logs
- centralized 404 and error handlers

### Route groups

- `/health`
- `/api/auth`
- `/api/fields`
- `/api/crops`
- `/api/climate-damage-claims`
- `/api/dashboard`
- `/api/government-schemes`
- `/`
- `/api`

### Example entities handled by the Node server

- users
- fields
- crops
- irrigation records
- fertilizer applications
- climate damage claims
- government schemes

### Security posture

The server includes multiple first-layer protections:

- password hashing,
- JWT-based auth flow structure,
- CORS restrictions,
- request throttling,
- input validation,
- parameterized SQL usage through the PostgreSQL layer,
- and standard secure headers.

---

## Flask ML Service

The `flaskserver/` directory provides prediction-oriented backend behavior.

### Responsibilities of the Flask service

- initialize MongoDB-backed services,
- load trained crop lifecycle models from `models/trained_models`,
- generate weather and soil inputs when direct data is unavailable,
- predict stage durations,
- predict irrigation requirements,
- assemble timeline output,
- and return structured lifecycle prediction results for frontend consumption.

### Main prediction behavior

The prediction flow works conceptually like this:

1. Accept crop type and sowing date.
2. Generate or receive weather and soil features.
3. Create a feature vector that matches the trained model columns.
4. Activate the selected crop one-hot feature.
5. Run duration prediction for each growth stage.
6. Run irrigation prediction for each growth stage.
7. Build a timeline with stage start/end dates.
8. Build a weekly irrigation schedule.
9. Return crop, sow date, harvest date, total duration, timeline, and irrigation schedule.

### Why a separate Flask service exists

This separation makes sense because ML workloads often have different dependencies and operational needs than a CRUD-oriented business API. Python is a natural fit for model loading with `joblib`, data manipulation with `pandas`, and scientific utilities with `numpy`.

---

## Machine Learning Models

The `models/` directory contains the artifacts used to support crop lifecycle prediction.

### Included assets

- training data CSVs,
- training scripts,
- prediction scripts,
- generated visualizations,
- serialized duration models,
- serialized irrigation models,
- feature column metadata.

### Trained model artifacts

Examples of the shipped trained artifacts include:

- `duration_Vegetative_model.pkl`
- `duration_Reproductive_model.pkl`
- `duration_Maturity_model.pkl`
- `irrigation_Vegetative_model.pkl`
- `irrigation_Reproductive_model.pkl`
- `irrigation_Maturity_model.pkl`
- `feature_columns.pkl`

### What the models predict

The model package is focused on two prediction classes:

1. **Stage duration prediction**
   - How many days each growth stage is expected to last.

2. **Irrigation requirement prediction**
   - Approximate irrigation need associated with each stage.

### Inputs used by prediction logic

The prediction code prepares a feature set including values such as:

- year,
- sowing month,
- temperature,
- rainfall,
- humidity,
- soil moisture,
- and crop-specific one-hot encoded columns.

---

## Data Flow Across the System

Because this repository contains multiple services, it helps to think in terms of flows rather than a single linear request path.

### Flow 1: UI authentication and role gating
1. User opens the frontend.
2. User signs up or logs in.
3. User data is stored in browser `localStorage` by the auth context.
4. Protected routes check whether the user is authenticated.
5. Farmer-only and government-only pages are gated by user type.

### Flow 2: Field-aware UI state
1. The app context loads field data via frontend services.
2. Field list is stored in shared context.
3. The selected field becomes globally available to pages/components.
4. A coordinate update helper runs when the selected field changes.

### Flow 3: Business API usage
1. Frontend sends requests to the Express API.
2. Express validates, authenticates, and routes the request.
3. Service layer logic interacts with PostgreSQL.
4. Response is returned to the client.

### Flow 4: Crop lifecycle prediction
1. User submits crop type and sowing date.
2. Frontend calls Flask prediction endpoint.
3. Flask loads model artifacts.
4. Flask generates weather/soil context if needed.
5. Models predict stage durations and irrigation needs.
6. Timeline and schedule are returned to the frontend.

### Flow 5: Climate claim submission
1. Farmer completes the claim form.
2. Documents/photos are attached in the UI.
3. Scheme is selected from available climate-support options.
4. Submission is currently simulated in the frontend workflow.
5. The architecture supports migration to API-backed persistence in the Node server.

---

## Authentication and Roles

The application supports role-driven UX decisions.

### Defined user types
- `farmer`
- `government`

### What role information affects
- which dashboard a user is allowed to access,
- which routes are visible/available,
- and which navigation and workflows are relevant.

### Current state of authentication
There are two layers to keep in mind:

- The **frontend auth context** currently simulates login/signup behavior and persists the result locally.
- The **Node backend** includes a more realistic authentication architecture with JWT, password hashing, and auth middleware.

This means the project is partly in transition between a demo-friendly frontend auth flow and a fuller production backend auth implementation.

---

## Main User Journeys

## Farmer journey

A representative farmer flow could look like this:

1. Sign up as a farmer.
2. Log in and land on the farmer dashboard.
3. Create a field or choose an existing field.
4. Navigate to crop lifecycle to add crop details.
5. Open crop prediction/yield prediction tools.
6. Review irrigation or water management suggestions.
7. Explore financial aid options.
8. Submit a climate damage claim when needed.

## Government journey

A representative government/admin flow could look like this:

1. Sign in as a government user.
2. Access the government dashboard.
3. Review analytics and oversight-related content.
4. Inspect scheme-related or claim-related information.
5. Use the backend reporting surface for support and policy administration.

---

## Installation and Local Development

There is more than one runnable part in this repository. In most development setups, you will run the frontend and at least one backend service in parallel.

## Prerequisites

### For the frontend and Node backend
- Node.js 16+ recommended
- npm 8+ recommended

### For the Flask service and model layer
- Python 3.10+ recommended
- `pip`

### For data stores
- PostgreSQL for the Node server
- MongoDB for Flask-backed Mongo services if you are using those parts

---

## Setup Option A: Frontend + Node API

### 1. Install frontend dependencies
```bash
cd client
npm install
```

### 2. Install Node backend dependencies
```bash
cd ../server
npm install
```

### 3. Configure backend environment
Create a `.env` file in `server/` with values such as:

```env
NODE_ENV=development
PORT=5002
HOST=localhost
DB_HOST=localhost
DB_PORT=5432
DB_NAME=krishi_connect
DB_USER=your_username
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 4. Initialize PostgreSQL schema
```bash
cd server
npm run init-db
```

### 5. Start the Node API
```bash
npm run dev
```

### 6. Start the frontend
In another terminal:
```bash
cd client
npm run dev
```

### 7. Open the app
- Frontend: `http://localhost:5173`
- Node API: `http://localhost:5002`
- API overview: `http://localhost:5002/api`
- Health check: `http://localhost:5002/health`

---

## Setup Option B: Frontend + Flask ML Service

Use this option when you want to focus on crop lifecycle prediction features.

### 1. Install Python dependencies
```bash
cd flaskserver
pip install -r requirement.txt
```

### 2. Start the Flask service
```bash
python app.py
```

### 3. Start the frontend
In another terminal:
```bash
cd client
npm install
npm run dev
```

### 4. Verify model files exist
Ensure that the following directory contains the trained files:

```bash
models/trained_models/
```

---

## Setup Option C: Full local stack

For a fuller local environment:

1. Start PostgreSQL.
2. Start MongoDB.
3. Run the Node server.
4. Run the Flask service.
5. Run the frontend.
6. Point each frontend service/config entry to the correct backend endpoints.

This gives you the most complete picture of the repository’s intended architecture.

---

## Environment Variables

## Node server

Typical values used by the Express server include:

```env
NODE_ENV=development
PORT=5002
HOST=localhost
DB_HOST=localhost
DB_PORT=5432
DB_NAME=krishi_connect
DB_USER=your_username
DB_PASSWORD=your_password
JWT_SECRET=replace_me
BCRYPT_ROUNDS=12
ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Flask service

The exact Python environment depends on your MongoDB and runtime setup, but you should expect configuration for:

- MongoDB connection details,
- Flask host/port,
- model file locations,
- and any service-level feature flags.

If you are productizing the Flask service, consider creating a dedicated `.env` and loading it explicitly.

---

## Available Scripts

## In `client/`

```bash
npm run dev      # start Vite development server
npm run build    # create production build
npm run lint     # lint frontend files
npm run preview  # preview built frontend
```

## In `server/`

```bash
npm start        # start Node server
npm run dev      # start Node server with nodemon
npm run init-db  # initialize database
npm test         # run Jest tests
npm run test:watch
```

## In `flaskserver/`

Typical execution is direct:

```bash
python app.py
```

## In repository root

```bash
python test_integration.py
```

---

## API Overview

## Node API root routes

### `GET /`
Returns a server summary with available endpoint groups.

### `GET /api`
Returns API metadata and a categorized endpoint map.

### `GET /health`
Health and service status route group.

## Major Node endpoint families

### Authentication
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/profile`
- `PUT /api/auth/profile`
- `POST /api/auth/logout`

### Fields
- `GET /api/fields`
- `POST /api/fields`
- `GET /api/fields/:id`
- `PUT /api/fields/:id`
- `DELETE /api/fields/:id`

### Crops
- `GET /api/crops`
- `POST /api/crops`
- `GET /api/crops/:id`
- `POST /api/crops/:id/irrigation`
- `POST /api/crops/:id/fertilizer`

### Climate damage claims
- `GET /api/climate-damage-claims`
- `POST /api/climate-damage-claims`
- `GET /api/climate-damage-claims/:id`
- review/admin routes under the same group

### Dashboards
- `GET /api/dashboard/farmer`
- `GET /api/dashboard/government`
- `GET /api/dashboard/analytics`

### Government schemes
- `GET /api/government-schemes`
- `GET /api/government-schemes/:code`

## Flask prediction endpoint

The crop integration documentation describes a prediction route:

### `POST /predict-crop-cycle`
Expected request body:

```json
{
  "crop_type": "Maize",
  "sowing_date": "2025-12-01"
}
```

Expected response shape includes:

- crop,
- sow date,
- harvest date,
- total duration,
- timeline array,
- irrigation schedule array,
- and generated weather/soil metadata.

---

## Current Implementation Notes

This repository is feature-rich, but not every layer is fully wired end-to-end yet. That is normal for projects evolving across prototype, demo, and productionization phases.

### Important practical observations

- The frontend auth flow is currently mocked in context rather than fully API-backed.
- Some dashboard content uses static sample data.
- The climate damage claim page currently simulates submission rather than persisting through a live backend call.
- The Flask service can generate weather and soil data synthetically, which is useful for demos and ML testing.
- The Node server is structured more like a production backend and is the right place for long-term persistence of operational data.
- The repository contains both PostgreSQL and MongoDB usage, so developers should be deliberate about which storage system supports which workflow.

### Best interpretation of the current state

Krishi Connect already demonstrates a strong product vision and a substantial architecture footprint. It is especially useful as:

- a capstone/full-stack agriculture project,
- an extensible smart farming platform starter,
- a proof-of-concept for ML-enhanced agricultural planning,
- or a foundation for a more production-grade agritech system.

---

## Troubleshooting

## Frontend does not start
- Run `npm install` inside `client/`.
- Confirm your Node version is compatible.
- Check for missing environment-specific configuration in frontend service files.

## Node API cannot connect to PostgreSQL
- Make sure PostgreSQL is running.
- Verify `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, and `DB_PASSWORD`.
- Confirm the database exists before running `npm run init-db`.

## Flask service cannot load models
- Check that `models/trained_models/` exists.
- Verify `.pkl` files are present.
- Confirm Python dependencies such as `joblib`, `pandas`, and `numpy` are installed.

## CORS errors in development
- Ensure the frontend origin is listed in `ALLOWED_ORIGINS` for the Node server.
- If the Flask service is being called directly from the browser, confirm Flask CORS settings permit your frontend origin.

## Prediction request fails for a crop
- The crop must exist in the trained feature columns.
- If not, retrain models or update the feature column set to include the new crop.

---

## Suggested Next Improvements

If you plan to continue developing Krishi Connect, these are high-impact next steps:

### Product improvements
- fully connect frontend auth to the Node API,
- persist climate claim submissions through the backend,
- unify field and crop CRUD across all pages,
- add live weather and remote sensing integrations,
- and connect AI assistant workflows to real agronomic guidance services.

### Engineering improvements
- add a root-level docker-compose setup for frontend + Node + Flask + DBs,
- create shared API contracts or OpenAPI specs,
- add consistent `.env.example` files for each service,
- improve test coverage across routes and prediction endpoints,
- and centralize config handling.

### ML improvements
- replace synthetic weather/soil generation with real data providers,
- version model artifacts explicitly,
- document training pipelines in more detail,
- and evaluate model accuracy per crop and region.

---

## License

The `server/package.json` declares an MIT license for the Node server. If you intend to distribute the entire repository as a single project, you may want to add a dedicated top-level `LICENSE` file so the licensing position is unambiguous across all folders.

---

## Quick Start Summary

If you only want the shortest path to seeing something run:

### Frontend
```bash
cd client
npm install
npm run dev
```

### Node backend
```bash
cd server
npm install
npm run init-db
npm run dev
```

### Flask ML backend
```bash
cd flaskserver
pip install -r requirement.txt
python app.py
```

Then open the frontend and begin with login, dashboard navigation, field selection, crop lifecycle, and prediction-oriented features.
