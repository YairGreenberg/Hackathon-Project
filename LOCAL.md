# Local Development Guide

Running the application on your local machine for development.

## Prerequisites

- Node.js 20+
- Python 3.10+
- MongoDB running on localhost:27017
- Telegram Bot Token from @BotFather
- Cloudinary API credentials

## Setup

```bash
# Prepare environment configuration
cp server/.env.example server/.env
nano server/.env  # Update TELEGRAM_TOKEN and Cloudinary credentials

# Note: MONGO_URI must be: mongodb://localhost:27017/Albums
```

## Running the Application

Use 4 separate terminal windows:

**Terminal 1 - MongoDB:**
```bash
mongod  # or: brew services start mongodb-community
```

**Terminal 2 - Face-Service (Python):**
```bash
cd face-service
pip install -r requirements.txt
python -m uvicorn main:app --host localhost --port 8000 --reload
```

**Terminal 3 - Backend Server (Node.js):**
```bash
cd server && npm run dev
```

**Terminal 4 - Frontend Client (React):**
```bash
cd client && npm run dev
```

## Service Endpoints

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- Face-Service API Docs: http://localhost:8000/docs
- MongoDB: localhost:27017

## Troubleshooting

```bash
# Python/dlib installation issues
brew install cmake  # macOS
sudo apt-get install build-essential cmake python3-dev  # Ubuntu
pip install -r requirements.txt

# Port conflicts
# Change PORT in server/.env or Vite will auto-select

# MongoDB connection issues
ps aux | grep mongod
brew services restart mongodb-community

# Module resolution
rm -rf node_modules package-lock.json && npm install
```

## Development Features

- Server auto-reload: nodemon enabled
- Client hot reload: Vite HMR enabled
- API proxy: Vite proxy eliminates CORS issues

## API Testing

See [README.md](./README.md) for complete API testing examples with curl commands.

## End-to-End Workflow

Complete end-to-end example available in [README.md](./README.md#end-to-end-flow).
