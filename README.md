# vuln-webapp-proj

A small, intentionally vulnerable web application used as a thesis project to demonstrate common web application security vulnerabilities and mitigation techniques.

## Overview
This repository contains a full-stack demo application:
- Frontend: Angular (single-page application)
- Backend: NestJS (REST API + serves frontend)
- Database: SQLite (for demo persistence)
The app intentionally includes insecure patterns for educational purposes (do not use in production).

## Key Features
- Demonstrations of web vulnerabilities such as XSS (stored/reflected), injection patterns, and insecure configurations
- Simple UI to navigate demo pages and exercises
- Minimal backend to persist demo data and serve the frontend

## Repository layout
- `frontend/` — Angular source (run/build with `npm` / Angular CLI)
- `backend/` — NestJS backend (API + static server)
- `Dockerfile` — Multi-stage build for containerized deployment

## Development
1. Frontend (dev):
   - Open a terminal in `frontend`:
     ```powershell
     npm install
     npm start
     ```
   - Dev server runs on `http://localhost:4200` by default.

2. Backend (dev):
   - Open a terminal in `backend`:
     ```powershell
     npm install
     npm run start:dev
     ```
   - Backend runs on `http://localhost:3000` by default. In dev you typically run frontend and backend separately.

3. Build frontend for production (so backend can serve it):
   ```powershell
   cd frontend
   npm install
   npm run build
