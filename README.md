# Pickup App · Dashboard Demo

Simple fullstack demo with:

- Node.js + Express API (`backend/`)
- Static dashboard UI (`frontend/` via Nginx)
- PostgreSQL (for future use)
- Docker Compose
- Jenkins pipeline with health check on `/health`

## Local run with Docker Compose

1. Create a `.env` file from the example:

   ```bash
   cp .env.example .env
   ```

2. Edit `.env` with your own values (password etc.).

3. Start all services:

   ```bash
   docker compose up -d --build
   ```

4. Open the dashboard:

   - Frontend: http://localhost:3000
   - API health: http://localhost:4000/health
   - API services: http://localhost:4000/services

5. Stop:

   ```bash
   docker compose down
   ```

## Jenkins usage

- Put this repo in Jenkins as a Pipeline job (Multibranch or simple Pipeline with SCM).
- Jenkins will:
  1. Checkout code
  2. Generate `.env` from Jenkins credentials
  3. `docker compose build`
  4. `docker compose up -d`
  5. Poll `http://localhost:4000/health` until it gets HTTP 200

The UI dashboard automatically calls the API to show services and health info.
