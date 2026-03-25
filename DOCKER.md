# Docker Deployment Guide

Quick and easy deployment of the entire 4-service application stack.

## Prerequisites

- Docker and Docker Compose installed
- Telegram Bot Token from @BotFather
- Cloudinary API credentials

## Setup

```bash
# Prepare environment configuration
cp server/.env.example server/.env
nano server/.env  # Update TELEGRAM_TOKEN and Cloudinary credentials

# Note: MONGO_URI must remain: mongodb://mongo:27017/Albums
```

## Running the Application

```bash
# Start all 4 services
docker-compose up --build

# In another terminal, to stop
docker-compose down
```

## Service Endpoints

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- Face-Service API Docs: http://localhost:8000/docs
- MongoDB: localhost:27017

## Troubleshooting

```bash
# Port conflicts
docker-compose down

# MongoDB issues
docker-compose logs mongo
docker-compose down -v && docker-compose up --build

# Build failures
docker-compose build --no-cache

# View logs
docker-compose logs -f server
```

## Data Persistence

MongoDB data is stored in `./data/mongodb/` and persists across restarts.

## API Testing

See [README.md](./README.md) for complete API testing examples with curl commands.

## End-to-End Workflow

Complete end-to-end example available in [README.md](./README.md#end-to-end-flow).
