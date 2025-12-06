# -------------------------------------------------------
# 1. FRONTEND BUILD (Angular)
# -------------------------------------------------------
FROM node:18 AS frontend-build

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ .

RUN npm run build --prod


# -------------------------------------------------------
# 2. BACKEND BUILD (NestJS)
# -------------------------------------------------------
FROM node:18 AS backend-build

WORKDIR /app/backend

COPY backend/package*.json ./
RUN npm install

COPY backend/ .

RUN npm run build


# -------------------------------------------------------
# 3. RUNTIME IMAGE
# -------------------------------------------------------
FROM node:18

WORKDIR /app

# Copy backend build output
COPY --from=backend-build /app/backend/node_modules ./backend/node_modules
COPY --from=backend-build /app/backend/dist ./backend/dist

# Copy Angular build output — copy the whole frontend workspace
# so /app/frontend/dist/frontend exists (matches AppModule)
COPY --from=frontend-build /app/frontend ./frontend

# Copy SQLite database if exists (or create on first run)
COPY backend/database.sqlite ./backend/database.sqlite

# Expose the port Nest actually listens on
EXPOSE 3000

CMD ["node", "backend/dist/main.js"]
