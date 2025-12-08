# -------------------------------------------------------
# 1. FRONTEND BUILD (Angular)
# -------------------------------------------------------
FROM node:18 AS frontend-build

WORKDIR /app/frontend

# Copy package files first for better layer caching
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm ci

COPY frontend/ .

RUN npm run build -- --configuration production


# -------------------------------------------------------
# 2. BACKEND BUILD (NestJS)
# -------------------------------------------------------
FROM node:18 AS backend-build

WORKDIR /app/backend

COPY backend/package.json backend/package-lock.json* ./
RUN npm ci

COPY backend/ .

RUN npm run build


# -------------------------------------------------------
# 3. RUNTIME IMAGE
# -------------------------------------------------------
FROM node:18-slim

WORKDIR /app

# Copy backend build output and runtime dependencies
COPY --from=backend-build /app/backend/dist ./backend/dist
COPY --from=backend-build /app/backend/node_modules ./backend/node_modules

COPY --from=frontend-build /app/frontend/dist ./frontend/dist

EXPOSE 3000

CMD ["node", "backend/dist/main.js"]
