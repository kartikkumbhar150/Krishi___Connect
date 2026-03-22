# Krishi Connect

A full-stack precision agriculture platform for field mapping, crop lifecycle planning, irrigation guidance, yield forecasting, climate analysis, and financial-support workflows.

This repository contains:

- a **React + Vite frontend** in `client/`
- a **Flask + MongoDB backend** in `flaskserver/` used by the current frontend integration
- a **Node.js + Express + PostgreSQL backend** in `server/` for an alternate API stack
- ML/model assets in `models/`

> **Important:** The current frontend configuration points to the **Flask backend** by default, so the active frontend data flow uses **MongoDB** unless you intentionally switch the frontend to another backend setup.

---

## Table of Contents

1. [What the project does](#what-the-project-does)
2. [Main features](#main-features)
3. [Architecture overview](#architecture-overview)
4. [Which database is used](#which-database-is-used)
5. [Repository structure](#repository-structure)
6. [Tech stack](#tech-stack)
7. [How the frontend talks to the backend](#how-the-frontend-talks-to-the-backend)
8. [Quick start](#quick-start)
9. [Frontend setup](#frontend-setup)
10. [Flask backend setup](#flask-backend-setup)
11. [Node/Express backend setup](#nodeexpress-backend-setup)
12. [Environment and configuration notes](#environment-and-configuration-notes)
13. [Key user flows](#key-user-flows)
14. [Important API groups](#important-api-groups)
15. [Data and persistence model](#data-and-persistence-model)
16. [Model and prediction notes](#model-and-prediction-notes)
17. [Development workflow](#development-workflow)
18. [Build and testing commands](#build-and-testing-commands)
19. [Troubleshooting](#troubleshooting)
20. [Recommended next improvements](#recommended-next-improvements)

---

## What the project does

Krishi Connect is designed to help farmers and agriculture-focused users:

- map farm fields on an interactive map
- save field boundaries and metadata
- create crop lifecycle records
- generate growth-stage and irrigation schedules
- save yield predictions
- analyze climate/soil/water conditions through dashboard views
- explore government support and financial-aid screens

The frontend is built as a dashboard-style application with multiple pages and feature modules. Some features are already connected to live backend persistence, while other sections are still partly demo-oriented or mock-driven.

---

## Main features

### 1. Field mapping
Users can draw field boundaries, store coordinates, and save field-level metadata such as crop and location.

### 2. Crop lifecycle tracking
Users can create crop lifecycle records linked to a field and review the saved lifecycle timeline and irrigation information.

### 3. Yield prediction
Users can generate and save yield predictions based on saved field/crop records and display those results inside the dashboard.

### 4. Climate and water analysis
The repository includes pages/components for weather, soil, irrigation, vegetation, and related climate-analysis views.

### 5. Financial support and scheme exploration
The frontend includes pages for schemes, subsidies, loans, notifications, and support content.

### 6. Alternate Node API stack
A separate Express backend exists with PostgreSQL support, authentication, dashboards, claims, and scheme endpoints.

---

## Architecture overview

At a high level, the repository currently supports **two backend approaches**:

### Option A: Frontend + Flask + MongoDB
This is the path currently wired into the frontend configuration.

**Flow:**
1. React frontend sends requests to the Flask server.
2. Flask persists field/crop/yield/session data in MongoDB.
3. Flask also serves prediction-related endpoints and model-backed crop schedule logic.

### Option B: Frontend + Node/Express + PostgreSQL
This is an alternate backend implementation that supports a broader REST API structure for authentication, dashboards, schemes, claims, and field/crop management.

**Flow:**
1. Frontend or external clients call the Express server.
2. Express persists structured records in PostgreSQL.
3. This stack appears to be more API-centric and enterprise-style, but it is not the default path used by the current frontend config.

---

## Which database is used

### Current frontend-connected stack
The frontend currently points to the Flask backend by default, so the **active frontend data flow uses MongoDB**.

### Databases present in the repository

- **MongoDB** is used by `flaskserver/`
- **PostgreSQL** is used by `server/`

### Practical interpretation
If you run the app exactly as the frontend is configured today, you should expect:

- frontend → Flask API → MongoDB

If you decide to switch to the Node backend instead, then you would use:

- frontend/custom client → Express API → PostgreSQL

Because both backends exist, one of the best long-term cleanup tasks for this repo would be to standardize on one backend/database path.

---

## Repository structure

```text
Krishi_Connect-main/
├── client/                     # React + Vite frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── config.js
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── flaskserver/                # Flask backend + MongoDB integration
│   ├── config/
│   ├── models/
│   ├── services/
│   ├── app.py
│   ├── app_postgresql.py
│   ├── requirement.txt
│   └── requirements_postgresql.txt
├── server/                     # Node.js + Express + PostgreSQL backend
│   ├── config/
│   ├── middleware/
│   ├── routes/
│   ├── scripts/
│   ├── services/
│   ├── server.js
│   └── package.json
├── models/                     # ML training scripts and model artifacts
├── CROP_INTEGRATION_README.md
├── test_integration.py
└── Readme.md
```

---

## Tech stack

### Frontend
- React
- Vite
- Tailwind CSS
- React Router
- Font Awesome
- Chart.js / react-chartjs-2

### Flask backend
- Flask
- Flask-CORS
- pymongo
- pandas
- numpy
- scikit-learn
- joblib
- TensorFlow-related packages listed in requirements

### Node backend
- Node.js
- Express
- pg (PostgreSQL driver)
- JWT
- bcrypt
- Joi
- Winston

### Databases
- MongoDB Atlas / MongoDB connection in Flask config
- PostgreSQL in Express config

---

## How the frontend talks to the backend

The frontend uses `client/src/config.js` to build API URLs.

By default it uses:

```env
VITE_BACKEND_URL=http://127.0.0.1:5002
```

That value is treated as the Flask backend base URL and is used for routes such as:

- `/api/status`
- `/api/fields`
- `/api/crops`
- `/api/yield-predictions`
- `/api/session`
- `/predict-crop-cycle`
- `/crop-info`

That means when you run the frontend locally without changing configuration, it expects the Flask API to be available on port `5002`.

---

## Quick start

If you want the simplest working local setup for the current frontend integration, use this path:

### Recommended path
- run the **Flask backend**
- run the **React frontend**
- ignore the Node backend unless you explicitly want to work on it

### Minimal startup order

#### Terminal 1: Flask backend
```bash
cd flaskserver
pip install -r requirement.txt
python app.py
```

#### Terminal 2: Frontend
```bash
cd client
npm install
npm run dev
```

Then open:

```text
http://localhost:5173
```

---

## Frontend setup

### Prerequisites
- Node.js 18+ recommended
- npm

### Install dependencies
```bash
cd client
npm install
```

### Start development server
```bash
npm run dev
```

### Build production bundle
```bash
npm run build
```

### Preview production build locally
```bash
npm run preview
```

### Frontend notes
- The frontend expects the backend on port `5002` by default.
- If you want to point it somewhere else, set `VITE_BACKEND_URL`.
- Some pages are strongly integrated with backend persistence; some other pages still use mock/demo patterns.

---

## Flask backend setup

### Purpose
The Flask backend is the default backend for the currently connected frontend flows.

### Main responsibilities
- connect to MongoDB
- store field maps
- store crop lifecycle records
- store yield predictions
- store session-level data
- expose crop prediction and schedule APIs

### Prerequisites
- Python 3.10+ recommended
- pip
- access to MongoDB

### Install dependencies
```bash
cd flaskserver
pip install -r requirement.txt
```

### Start the Flask server
```bash
python app.py
```

### Default Flask URL
```text
http://127.0.0.1:5002
```

### What is stored in MongoDB
The Flask stack stores documents for:
- field maps
- crop lifecycle records
- yield predictions
- user sessions

### Important note
The MongoDB connection string is currently hardcoded in the Flask config. For production-quality usage, this should be moved to environment variables immediately.

---

## Node/Express backend setup

### Purpose
The `server/` directory contains a separate backend implementation using Express and PostgreSQL.

### Main responsibilities
- authentication
- field management
- crop management
- climate damage claims
- dashboard analytics
- government scheme data

### Prerequisites
- Node.js 16+
- npm
- PostgreSQL 12+

### Install dependencies
```bash
cd server
npm install
```

### Start in development mode
```bash
npm run dev
```

### Start in production mode
```bash
npm start
```

### Initialize database schema
```bash
npm run init-db
```

### Default Node backend URL
```text
http://localhost:5002
```

### Important note
Because both Flask and Express currently default to port `5002`, you should **not** run both on the same port simultaneously without changing configuration.

---

## Environment and configuration notes

### Frontend
The frontend uses:

```env
VITE_BACKEND_URL=http://127.0.0.1:5002
```

### Flask backend
Recommended future environment variables:

```env
FLASK_ENV=development
PORT=5002
MONGODB_URI=your_mongodb_connection_string
DATABASE_NAME=vortexa_agriculture
```

### Express backend
Typical environment variables:

```env
NODE_ENV=development
PORT=5002
HOST=localhost
DB_HOST=localhost
DB_PORT=5432
DB_NAME=krishi_connect
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_secret
ALLOWED_ORIGINS=http://localhost:5173
```

### Port conflict warning
Both backends use `5002` by default. Choose one of these approaches:

- run only one backend at a time
- move one backend to a different port
- update the frontend base URL accordingly

---

## Key user flows

### 1. Create and save a field
1. Open the field mapping page.
2. Draw a polygon on the map.
3. Add field metadata such as name, location, and crop.
4. Save the field.
5. The field is persisted through the backend.

### 2. Create a crop lifecycle record
1. Navigate to Crop Lifecycle.
2. Select a field.
3. Enter crop name and sowing date.
4. Save the lifecycle.
5. The page refreshes saved lifecycle cards and timeline information.

### 3. Save a yield prediction
1. Navigate to Yield Prediction.
2. Choose a field with a saved crop lifecycle.
3. Review the generated forecast.
4. Save the forecast.
5. The prediction is stored and displayed in the dashboard.

---

## Important API groups

## Flask API groups

### Health and status
- `GET /api/status`

### Field management
- `POST /api/fields`
- `GET /api/fields`
- `GET /api/fields/:id`
- `PUT /api/fields/:id`
- `DELETE /api/fields/:id`

### Crop lifecycle
- `POST /api/crops`
- `GET /api/crops`
- `GET /api/crops/:id`
- `GET /api/crops/field/:fieldId`
- `POST /api/crops/:id/stage`
- `POST /api/crops/:id/irrigation`
- `POST /api/crops/:id/fertilizer`

### Yield prediction
- `POST /api/yield-predictions`
- `GET /api/yield-predictions`
- `GET /api/yield-predictions/:id`
- `POST /api/yield-predictions/:id/actual`

### Session
- `GET /api/session`

### Prediction and schedule endpoints
- `POST /predict-crop-cycle`
- `POST /crop-info`
- `GET /growth-stages`
- `GET /irrigation-schedule`
- `GET /fertilizer-schedule`
- `GET /water-balance-summary`

## Express API groups

### Authentication
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/profile`
- `POST /api/auth/logout`

### Fields
- `POST /api/fields`
- `GET /api/fields`
- `GET /api/fields/:id`
- `PUT /api/fields/:id`
- `DELETE /api/fields/:id`

### Crops
- `POST /api/crops`
- `GET /api/crops`
- `GET /api/crops/:id`
- `POST /api/crops/:id/irrigation`
- `POST /api/crops/:id/fertilizer`

### Other groups
- climate claims
- dashboard analytics
- government schemes
- health checks

---

## Data and persistence model

### In the Flask + MongoDB path
The important persisted entities are:

#### Field map
Typical field record data includes:
- field name
- coordinates
- area
- location
- current crop
- soil metadata
- weather metadata
- status
- created/updated timestamps

#### Crop lifecycle
Typical lifecycle data includes:
- field id
- crop name
- sowing date
- expected harvest date
- growth stages
- irrigation schedule and totals
- fertilizer history
- stage/status information

#### Yield prediction
Typical prediction data includes:
- field id
- crop lifecycle id
- crop name
- environmental inputs
- expected yield per hectare
- total yield
- confidence score
- recommendations
- risk factors
- actual result updates after harvest

### In the Express + PostgreSQL path
The relational model includes tables such as:
- users
- fields
- crops
- irrigation records
- fertilizer applications
- climate damage claims
- government schemes

---

## Model and prediction notes

The repository contains trained model assets and supporting scripts in `models/`.

These support features such as:
- crop duration stage prediction
- irrigation requirement estimation
- crop cycle timeline generation

The Flask backend also includes logic to:
- load trained model files
- derive stage durations
- calculate irrigation needs
- generate a projected harvest date

If the models are unavailable or fail to load, some prediction behavior may degrade or fall back.

---

## Development workflow

### Recommended workflow for frontend-focused work
1. Start the Flask backend.
2. Start the React frontend.
3. Work on pages/services in `client/src/`.
4. Verify data is being saved in the Flask + MongoDB flow.

### Recommended workflow for backend API work
If you are working on the Flask-connected frontend, prefer editing:
- `flaskserver/app.py`
- `flaskserver/services/`
- `flaskserver/models/`
- `client/src/services/dataService.js`

If you are working on the alternate Node API, prefer editing:
- `server/server.js`
- `server/routes/`
- `server/services/`
- `server/config/database.js`

### Important architectural caution
Because the repository contains both Flask and Express backends, always be clear about:
- which backend you are running
- which database that backend uses
- which URL the frontend is pointed at

---

## Build and testing commands

### Frontend
```bash
cd client
npm install
npm run dev
npm run build
npm run lint
```

### Flask backend
```bash
cd flaskserver
pip install -r requirement.txt
python app.py
python -m py_compile app.py models/schemas.py services/database_service.py
```

### Express backend
```bash
cd server
npm install
npm run dev
npm start
npm run init-db
npm test
```

### Root-level integration-oriented script
```bash
python test_integration.py
```

> Depending on your machine and environment, some checks may require services, environment variables, model files, or database connectivity to be available.

---

## Troubleshooting

### Frontend loads but data does not save
Check:
- the Flask server is running
- the frontend is pointed to the correct backend URL
- CORS allows `http://localhost:5173`
- the backend database connection is healthy

### Port 5002 is already in use
This usually means Flask and Express are both trying to use the same port.

Fix by:
- stopping one backend
- or changing the port of one service and updating the frontend config

### MongoDB connection fails
Check:
- internet access
- connection string validity
- MongoDB Atlas availability
- whether the IP/network is allowed

### PostgreSQL connection fails
Check:
- PostgreSQL is running
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, and `DB_PASSWORD` are correct
- the schema has been initialized

### Prediction pages show partial data
That can happen if:
- no field is saved yet
- no crop lifecycle is saved for the field
- models are not loaded
- a backend request failed

---

## Recommended next improvements

1. **Standardize on one backend stack** to remove confusion and reduce maintenance cost.
2. **Move secrets and connection strings into environment variables**.
3. **Document each API with OpenAPI/Swagger**.
4. **Add end-to-end tests** for field → crop lifecycle → yield prediction flows.
5. **Finish connecting remaining frontend pages** that still rely on static or demo data.
6. **Add Docker-based local setup** for consistent onboarding.
7. **Add seed data and sample `.env.example` files** across all app layers.
8. **Improve authentication consistency** across both backend implementations.
9. **Add CI checks** for build, lint, backend syntax, and integration tests.
10. **Write separate docs for deployment** for frontend, Flask, MongoDB, Express, and PostgreSQL.

---

## Final note

This repository already has strong foundations for a useful agriculture platform, but it currently mixes two backend approaches. For the smoothest development experience today, run the **frontend + Flask backend** path first, because that is the integration route the frontend is already configured to use.
