# 📸 Photo Album - Cloud-Based Photo Sharing & Management

אפליקציית ניהול תמונות המאפשרת שיתוף קל של תמונות משפחתיות דרך Telegram עם ניתוח AI של פנים וסטטיסטיקות מתקדמות.

---

## 🎯 סקירה כללית

**Photo Album** היא מערכת מלאה לאחסון וניהול של תמונות משפחתיות. משתמשים שולחים תמונות דרך Telegram Bot, המערכת שומרת אותן בקלאוד (Cloudinary), מנתחת פנים, וממיין אותן לאלבומים עם תגיות.

### ✨ תכונות:
- 📤 Telegram Bot Integration - שלח תמונות דרך Telegram
- 🏗️ Album Management - ארגן תמונות בקטגוריות
- 🎭 Face Recognition - זיהוי פנים באמצעות AI
- 📊 Statistics Dashboard - ניתוח נתונים על השימוש
- ☁️ Cloud Storage - Cloudinary
- 🐳 Docker Support - הרצה קלה בכל סביבה

---

## 🏗️ ארכיטקטורה

```
┌──────────────────────────────────────────────────┐
│          Frontend (React + Vite)                 │
│            http://localhost:5173                 │
└───────────┬──────────────────────────────────────┘
            │ (REST API)
┌───────────▼──────────────────────────────────────┐
│   Backend Server (Node.js + Express)             │
│      http://localhost:3000                       │
│  ┌─────────────────────────────────────────┐    │
│  │ /api/photos    - Photo management       │    │
│  │ /api/albums    - Album management       │    │
│  │ /api/stats     - Statistics & analytics │    │
│  └─────────────────────────────────────────┘    │
└───────┬────────────────────────────────┬────────┘
        │                                │
   (MongoDB)                     (HTTP POST)
        │                                │
┌───────▼────────┐         ┌────────────▼────────┐
│   MongoDB      │         │  Face-Service API   │
│  localhost:    │         │   (Python/FastAPI)  │
│    27017       │         │  localhost:8000     │
└────────────────┘         └─────────────────────┘
```

### Components:
| Component | Tech | תפקיד |
|-----------|------|-------|
| **Frontend** | React 18 + Vite | ממשק משתמש |
| **Backend** | Node.js + Express | API ו-DB management |
| **Database** | MongoDB 7 | אחסון תמונות ומטא-דאטה |
| **Face Recognition** | Python + FastAPI + dlib | זיהוי פנים |
| **Storage** | Cloudinary | אחסון תמונות בקלאוד |
| **Bot** | Telegram Bot API | ממשק משתמשים |

---

## 🚀 Quick Start

### 📋 Requirements:
- Docker & Docker Compose (קל ביותר)
- **או:** Node.js 20 + Python 3.10 + MongoDB

### 🐳 Docker (מומלץ):
```bash
cp server/.env.example server/.env
nano server/.env  # Update credentials

docker-compose up --build
# גש ל: http://localhost:5173
```

### 💻 Local Development:
```bash
# Terminal 1: MongoDB
mongod

# Terminal 2: Face-Service (Python)
cd face-service && pip install -r requirements.txt
python -m uvicorn main:app --host localhost --port 8000

# Terminal 3: Server (Node.js)
cd server && npm run dev

# Terminal 4: Client (React)
cd client && npm run dev
```

---

## 📚 Documentation

- **[DOCKER.md](./DOCKER.md)** - הרצה עם Docker Compose (קל ביותר)
- **[LOCAL.md](./LOCAL.md)** - הרצה מקומית עם Node.js + Python

---

## 🔧 Configuration

**File:** `server/.env`

ראה [`server/.env.example`](server/.env.example) לעקבות מלא. דוגמה:

```env
TELEGRAM_TOKEN=your_bot_token
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
MONGO_URI=mongodb://localhost:27017/Albums
MONGO_TLS=false
PORT=3000
```

---

## 🧪 API Testing

### מ-Terminal בקלות:

```bash
# Photos
curl http://localhost:3000/api/photos
curl -X POST http://localhost:3000/api/photos \
  -H "Content-Type: application/json" \
  -d '{"url":"https://...","albumName":"Family","sender":"user@example.com"}'

# Statistics
curl http://localhost:3000/api/stats | jq '.'

# Face Recognition
curl -X POST http://localhost:8000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com/image.jpg"}'
```

ראה **[DOCKER.md](./DOCKER.md)** ו-**[LOCAL.md](./LOCAL.md)** למידע מלא.

---

## 🎯 End-to-End Flow

1. **משתמש שולח תמונה דרך Telegram**
2. **Server משמר את התמונה ב-Cloudinary ובـ MongoDB**
3. **Face-Service מנתח את התמונה (זיהוי פנים, EXIF data)**
4. **Client מציג את התמונות בממשק ויזואלי**
5. **Statistics endpoint מספק דוחות ניתוחים**

---

## 🛠️ Tech Stack

- **Frontend:** React 18, Vite, Axios
- **Backend:** Node.js 20, Express, MongoDB driver
- **Face Recognition:** Python 3.10, FastAPI, dlib, face_recognition
- **Cloud:** Cloudinary, Telegram Bot API
- **DevOps:** Docker, Docker Compose, Nginx

---

## 📝 Project Structure

```
Hackathon-Project/
├── client/              # React frontend (Vite)
├── server/              # Node.js backend (Express)
├── face-service/        # Python face recognition API
├── docker-compose.yml   # 4-service orchestration
├── Dockerfile           # Server image
├── README.md           # This file
├── DOCKER.md           # Docker guide
└── LOCAL.md            # Local development guide
```

---

## ✅ Verification Checklist

- [ ] Docker running (see DOCKER.md)
- [ ] All 4 services up: client, server, mongo, face-service
- [ ] http://localhost:5173 accessible
- [ ] `curl http://localhost:3000/api/photos` returns JSON
- [ ] `curl http://localhost:3000/api/stats` returns stats
- [ ] `http://localhost:8000/docs` shows Face-Service API

---

Made with ❤️ for photo sharing
