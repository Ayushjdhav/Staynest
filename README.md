# 🏡 StayNest • Find your next stay, with confidence.

[![CI Pipeline](https://github.com/Ayushjdhav/Wanderlust/actions/workflows/ci.yml/badge.svg)](https://github.com/Ayushjdhav/Wanderlust/actions)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Node.js](https://img.shields.io/badge/Node.js-v22+-green.svg)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-v5.0-lightgrey.svg)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)](https://www.mongodb.com/)
[![Swagger](https://img.shields.io/badge/OpenAPI-3.0_Swagger-brightgreen.svg)](http://localhost:8080/api-docs)

> **StayNest** (*"Find your next stay, with confidence."*) is a modern, reliable, AI-powered accommodation platform designed with a clean, welcoming, and accessible interface that connects travelers with verified worldwide stays and intelligent trip planning.

---

## ✨ Key Features

### 🏨 Modern Accommodation Platform
- **Verified Property Listings**: Curated stays with verified host badges, high-resolution photo galleries, comprehensive amenities checklist, guest capacity, bedrooms, cancellation policies, and transparent house rules.
- **Discovery-First Explorer**: Intuitive property search without forced dates/guest counts, combined with dynamic modal filters (Price range, Property type, Amenities).
- **Interactive Map Discovery**: MapLibre GL powered discovery map with custom price badges, clustering, and responsive popups.
- **Real-Time Booking & Transparent Invoices**: Automatic date-blocking, double-booking prevention, and live price breakdown with taxes and fee transparency.
- **Role-Based Access Control (RBAC)**: User, Host, and Admin roles with guarded routes and seamless host onboarding.
- **Host Analytics Dashboard**: Track revenue, active properties, reservation requests, occupancy, and review scores.
- **1-Click Wishlist**: Save favorite stays with real-time AJAX heart animations.
- **In-App Notifications**: Real-time alert notifications for bookings, reviews, and host updates.

### 🤖 StayNest AI Travel Planner & Concierge (AI Differentiator)
- **Zero-Cost & Free Tier Architecture**:
  - **Google Gemini API**: Free tier integration (no credit card required) from [Google AI Studio](https://aistudio.google.com/).
  - **Smart Local Heuristic Fallback Engine**: Works 100% out of the box with zero external API dependencies!
- **Grounded Concierge**: Dedicated assistant providing accurate property answers strictly grounded in actual database listings (never hallucinating missing details).
- **Interactive Itinerary Wizard**: Day-by-day morning/afternoon/evening schedule with culinary recommendations, local insider tips, and packing lists.
- **Pluggable Architecture**: Implemented via adapter pattern (`services/ai/aiProviderInterface.js`) for seamless model switching.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Backend** | Node.js (v22), Express.js (v5), JavaScript (ES6+) |
| **Database & Caching** | MongoDB Atlas, Mongoose (v9), Redis (ioredis with LRU fallback) |
| **Authentication & RBAC** | Passport.js, Passport-Local, MongoStore Sessions |
| **Frontend & UI/UX** | EJS Mate (SSR), Bootstrap 5.3, Vanilla CSS Design System, MapLibre GL, FontAwesome 6 |
| **Media & Geo** | Cloudinary CDN, Geoapify Geocoding & Map Tiles |
| **AI Engine** | Google Gemini (1.5 Flash / 2.0 Flash) & Algorithmic RAG Engine |
| **DevOps & Testing** | Docker, Docker Compose, GitHub Actions CI, Jest, Supertest, Swagger / OpenAPI |

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v20 or higher
- **MongoDB**: MongoDB Atlas connection URI or local MongoDB

### 2. Clone and Install Dependencies
```bash
git clone https://github.com/Ayushjdhav/Wanderlust.git
cd Wanderlust
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory:
```env
PORT=8080
NODE_ENV=development
SECRET=your_super_secret_session_key

# MongoDB Connection
ATLASDB_URL=mongodb+srv://<username>:<password>@cluster0.mongodb.net/wanderlust

# Cloudinary (Free tier: https://cloudinary.com)
CLOUD_NAME=your_cloud_name
CLOUD_API_KEY=your_cloud_api_key
CLOUD_API_SECRET=your_cloud_api_secret

# Geoapify (Free tier: https://www.geoapify.com)
GEOAPIFY_API_KEY=your_geoapify_key

# Google Gemini API (100% Free: https://aistudio.google.com) - Optional
GEMINI_API_KEY=your_gemini_api_key

# Redis (Optional - In-memory cache fallback activates automatically)
REDIS_URL=redis://127.0.0.1:6379
```

### 4. Seed Sample Listing Data
```bash
node init/index.js
```

### 5. Run the Application
```bash
# Development mode with nodemon
npm run dev

# Or production start
npm start
```
Open **[http://localhost:8080](http://localhost:8080)** in your browser!

---

## 📖 API Documentation & Swagger

Interactive Swagger API docs are available at:
👉 **[http://localhost:8080/api-docs](http://localhost:8080/api-docs)**

Key REST endpoints:
- `GET /api/v1/listings`: Search & filter listings
- `GET /api/v1/listings/:id`: View listing details
- `POST /api/v1/planner/generate`: AI Travel Planner endpoint
- `GET /api/v1/health`: System health probe

---

## 🐳 Docker Deployment

Run the complete multi-container stack (App + MongoDB + Redis):
```bash
docker-compose up --build
```

---

## 🧪 Running Automated Tests

```bash
npm test
```

---

## 📜 System Architecture Document
For comprehensive architectural design diagrams, database ER schemas, and security RBAC matrices, see **[SYSTEM_DESIGN.md](file:///c:/WEB%20DEVLOPMENT/Wanderlust/SYSTEM_DESIGN.md)**.
