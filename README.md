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
- `frontend/` — Angular source (run/build with `npm` / Angular CLI `ng`)
- `backend/` — NestJS backend (API + static server)
- `Dockerfile` — Multi-stage build for containerized deployment

## Development
1. Frontend (dev):
   - Open a terminal in `frontend`:
     ```powershell
     npm install
     ng serve
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
   ng build

4. (Optional) New dev mode via new optional parameter (:seed), that seeds some database records if selected (dev):
   ```powershell
   cd backend
   npm run start:dev:seed
   ```
      ***This does also dumps the previous database file, so you can start with a new clean database and don't have to manually delete the .sqlite file every time***

# Comment feature for XSS testing

## list comments (should return [ ] initially)
   ```bash
   curl -sS http://localhost:3000/api/comments
   ```

## create a comment
   ```bash
   curl -sS -X POST http://localhost:3000/api/comments
   -H "Content-Type: application/json" \
   -d '{"username":"a","content":"b"}'
   ```
## verify created comment
   ```bash
   curl -sS http://localhost:3000/api/comments
   ```

# Seeding database (docker)

## Build docker image
   ```powershell
   docker build -t vuln-webapp:latest .
   ```
## Run docker container
   ```powershell
   docker run --rm -p 3000:3000 -e RESET_AND_SEED=true vuln-webapp:latest
   ```
we use this is so we seed pre existing database elements and pass the environment variable to the container
   