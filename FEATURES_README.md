# Krishi Connect — Feature-by-Feature README

This document provides a practical, detailed breakdown of each product feature in the current repository, including route, purpose, key UI modules, data dependencies, and extension notes.

---

## 1) Authentication (Login / Signup)

### Routes
- `/login`
- `/signup`

### What it does
- Supports role-based login flows for farmer and government users.
- Persists user session to `localStorage` through `AuthContext`.

### Components and files
- `client/src/pages/Login.jsx`
- `client/src/pages/SignUp.jsx`
- `client/src/context/AuthContext.jsx`
- `client/src/components/common/ProtectedRoute.jsx`

### Current behavior notes
- Uses mock auth logic (simulated API delay and local user storage).
- Redirects users by role after login.

---

## 2) Dashboard (Farmer)

### Route
- `/dashboard` (also `/`)

### What it does
- Shows field summaries, quick actions, crop recommendations, and yield snapshots.
- Acts as the primary operational landing page for farmers.

### Components and files
- `client/src/pages/Dashboard.jsx`
- `client/src/components/layout/Layout.jsx`
- `client/src/components/layout/Sidebar.jsx`

### UX notes
- Quick links point to field creation, lifecycle, crop prediction, and yield tools.
- Uses card-based layout for easy visual scanning.

---

## 3) Government Dashboard

### Route
- `/government-dashboard`

### What it does
- Government-specific portal surface for policy and administration workflows.

### Components and files
- `client/src/pages/GovernmentDashboard.jsx`

---

## 4) Field Management

### Routes
- `/create-field`
- `/fields`
- `/field-detail/:id`
- `/field-list` (alias redirect to `/fields`)

### What it does
- Create, browse, and inspect field-level records.
- Integrates with shared app state via `AppContext`.

### Components and files
- `client/src/pages/CreateField.jsx`
- `client/src/pages/Fields.jsx`
- `client/src/pages/FieldDetail.jsx`
- `client/src/context/AppContext.jsx`

---

## 5) Crop Lifecycle Tracking

### Route
- `/crop-lifecycle`

### What it does
- Tracks crop growth phases and lifecycle progress.
- Supports operational planning across crop stages.

### Components and files
- `client/src/pages/CropLifecycle.jsx`
- Supporting crop components under `client/src/components/crop/`

---

## 6) Crop Prediction

### Route
- `/crop-prediction`

### What it does
- Provides crop recommendation/prediction workflows for planning decisions.

### Components and files
- `client/src/pages/CropPrediction.jsx`
- `models/` and Flask services for future/extended integrations

---

## 7) Yield Prediction

### Route
- `/yield-prediction`

### What it does
- Shows predicted yield outputs and confidence-oriented metrics.

### Components and files
- `client/src/pages/YieldPrediction.jsx`

---

## 8) Climate Analysis

### Route
- `/climate`

### What it does
- Combines weather, vegetation, soil, and water analysis modules.

### Components and files
- `client/src/pages/ClimateAnalysis.jsx`
- `client/src/components/climate/WeatherAnalysis.jsx`
- `client/src/components/climate/VegetationAnalysis.jsx`
- `client/src/components/climate/SoilLandAnalysis.jsx`
- `client/src/components/climate/WaterIrrigationAnalysis.jsx`

---

## 9) Water + Irrigation

### Routes
- `/water-management`
- `/irrigation` (alias)
- `/irrigation-management`

### What it does
- Handles water planning and detailed irrigation workflows.

### Components and files
- `client/src/pages/WaterManagement.jsx`
- `client/src/pages/IrrigationManagement.jsx`
- `client/src/components/irrigation/*`

---

## 10) Climate Damage Claim

### Route
- `/climate-damage-claim`

### What it does
- Allows claim submission for climate-related field losses.

### Components and files
- `client/src/pages/ClimateDamageClaim.jsx`
- Server routes/services: `server/routes/climateClaims.js`, `server/services/climateClaimService.js`

---

## 11) Financial Aid Center

### Route
- `/financial-aid`

### What it does
- Provides access to scheme support, eligibility guidance, and aid resources.

### Components and files
- `client/src/pages/FinancialAid.jsx`
- `client/src/components/financial-aid/*`

---

## 12) AI Assistant

### Route
- `/ai-assistant`

### What it does
- Conversational assistant experience for farming guidance.

### Components and files
- `client/src/pages/AIAssistant.jsx`
- `client/src/pages/AIAssistant.css`

---

## 13) Reports Center

### Route
- `/reports`

### What it does
- Central report launcher for lifecycle, climate, yield, and irrigation analytics.

### Components and files
- `client/src/pages/Reports.jsx`

---

## 14) User Profile

### Route
- `/profile`

### What it does
- Displays current user account details and role summary.

### Components and files
- `client/src/pages/Profile.jsx`

---

## 15) Internationalization (i18n)

### What it does
- Provides multilingual support through i18next.
- Language can be switched from the top header button.

### Components and files
- `client/src/components/common/LanguageSwitcher.jsx`
- `client/src/components/common/LanguageSwitcher.css`
- `client/src/i18n/i18n.js`
- Locale files: `client/src/i18n/locales/*/common.json`

---

## 16) Backend Feature Surfaces (Node + Flask)

### Node server responsibilities
- Role-based auth and API endpoints for fields, crops, dashboard, claims, schemes.

### Flask service responsibilities
- Crop lifecycle and irrigation model-backed predictions.

### Key files
- `server/server.js`
- `server/routes/*.js`
- `flaskserver/app.py`
- `models/predict_crop_cycle.py`

---

## Future enhancement checklist (recommended)

- Replace mock auth in frontend with backend token flow.
- Add API integration status matrix per feature.
- Add end-to-end tests for role-based route access.
- Add feature-level error and empty states uniformly.
- Add analytics export (CSV/PDF) to Reports Center.
