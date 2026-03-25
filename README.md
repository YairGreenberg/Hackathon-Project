# Photo Album - Cloud-Based Photo Sharing and Management

A complete photo management system for easy sharing and storage of family photos via Telegram with AI-powered face recognition and advanced analytics.

## Overview

Photo Album is a complete system for storing and managing family photos. Users send photos via Telegram Bot, the system saves them to the cloud (Cloudinary), analyzes faces, and organizes them in albums with tags.

### Features

- Telegram Bot Integration: Send photos via Telegram
- Album Management: Organize photos into categories  
- Face Recognition: AI-powered face detection and analysis
- Statistics Dashboard: Data analytics on system usage
- Cloud Storage: Cloudinary integration
- Docker Support: Easy deployment in any environment

## Architecture

```
Frontend (React + Vite)
http://localhost:5173
        |
        | (REST API)
        v
Backend Server (Node.js + Express)
http://localhost:3000
        |
   +----+----+
   |         |
   v         v
MongoDB    Face-Service API
27017      (Python/FastAPI)
           8000
```

### Components

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Frontend | React 18 + Vite | User interface |
| Backend | Node.js + Express | API and database management |
| Database | MongoDB 7 | Photo and metadata storage |
| Face Recognition | Python + FastAPI + dlib | Face detection and analysis |
| Storage | Cloudinary | Cloud photo storage |
| Bot | Telegram Bot API | User interface |

## Quick Start

### Requirements

- Docker and Docker Compose, or
- Node.js 20 + Python 3.10 + MongoDB

### Docker Deployment (Recommended)

```bash
cp server/.env.example server/.env
nano server/.env  # Update TELEGRAM_TOKEN and Cloudinary credentials

docker-compose up --build
# Access at: http://localhost:5173
```

### Local Development

```bash
# Terminal 1: MongoDB
mongod

# Terminal 2: Face-Service
cd face-service
pip install -r requirements.txt
python -m uvicorn main:app --host localhost --port 8000

# Terminal 3: Backend
cd server && npm run dev

# Terminal 4: Frontend  
cd client && npm run dev
```

## Documentation

- [DOCKER.md](./DOCKER.md) - Deployment with Docker Compose
- [LOCAL.md](./LOCAL.md) - Local development setup

## Configuration

See `server/.env.example` for required environment variables:

```env
TELEGRAM_TOKEN=your_bot_token
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
MONGO_URI=mongodb://localhost:27017/Albums
MONGO_TLS=false
PORT=3000
```

## API Testing

### Photos

```bash
# Get all photos
curl http://localhost:3000/api/photos

# Create photo
curl -X POST http://localhost:3000/api/photos \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com/photo.jpg",
    "albumName": "Family",
    "sender": "user@example.com",
    "tags": ["nature", "sunset"]
  }'
```

### Albums

```bash
# Get all albums
curl http://localhost:3000/api/albums

# Create album
curl -X POST http://localhost:3000/api/albums \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Family Vacation",
    "description": "Summer 2024 photos"
  }'
```

### Statistics

```bash
# Get statistics
curl http://localhost:3000/api/stats | jq '.'
```

Response includes: total photos, top senders, photos by album, by day, and top tags.

### Face Recognition

```bash
# Analyze image for faces
curl -X POST http://localhost:8000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com/image.jpg"
  }'
```

View API documentation at: http://localhost:8000/docs

## End-to-End Workflow

1. Start services (Docker or local)
2. Create an album via API
3. Upload a photo with metadata
4. Analyze photo with face-service
5. Query statistics
6. View results in UI or database

## Tech Stack

- Frontend: React 18, Vite, Axios
- Backend: Node.js 20, Express, MongoDB driver
- Face Recognition: Python 3.10, FastAPI, dlib, face_recognition
- Cloud: Cloudinary, Telegram Bot API
- DevOps: Docker, Docker Compose, Nginx

## Project Structure

```
Hackathon-Project/
├── client/              # React frontend
├── server/              # Node.js backend
├── face-service/        # Python face recognition
├── docker-compose.yml   # Service orchestration
├── Dockerfile           # Server image
├── README.md           # This file
├── DOCKER.md           # Docker guide
└── LOCAL.md            # Local development guide
```

## Verification Checklist

- [ ] All services running (Docker or local)
- [ ] http://localhost:5173 accessible
- [ ] API responds: curl http://localhost:3000/api/photos
- [ ] Statistics work: curl http://localhost:3000/api/stats
- [ ] Face-Service docs: http://localhost:8000/docs

---

Made with focus on clean architecture and professional standards.
