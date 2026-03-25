# 💻 הרצה מקומית (Development)

## דרישות מוקדמות

- Node.js 20+
- Python 3.10+ (עם dlib עבור face-service)
- MongoDB רץ על `localhost:27017`
- Telegram Token ו-Cloudinary credentials

## הגדרה

```bash
# 1. Prepare .env
cp server/.env.example server/.env
nano server/.env  # עדכן TELEGRAM_TOKEN ו-Cloudinary

# 2. שים לב: MONGO_URI צריך להיות: mongodb://localhost:27017/Albums
```

## הרצה - 4 טרמינלים

**טרמינל 1 - MongoDB:**
```bash
mongod  # או: brew services start mongodb-community
```

**טרמינל 2 - Face-Service (Python):**
```bash
cd face-service
pip install -r requirements.txt
python -m uvicorn main:app --host localhost --port 8000 --reload
```

**טרמינל 3 - Server (Node.js):**
```bash
cd server && npm run dev
```

**טרמינל 4 - Client (React):**
```bash
cd client && npm run dev
```

**גישה:**
- 🌐 http://localhost:5173
- 🔌 API: http://localhost:3000
- 🎭 Face-Service: http://localhost:8000/docs

## API Endpoints - בדיקות מהטרמינל

### Photos
```bash
curl http://localhost:3000/api/photos
curl -X POST http://localhost:3000/api/photos \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com/photo.jpg","albumName":"Family","sender":"user@example.com","tags":["nature"]}'
```

### Albums
```bash
curl http://localhost:3000/api/albums
curl -X POST http://localhost:3000/api/albums \
  -H "Content-Type: application/json" \
  -d '{"name":"Family","description":"Family photos"}'
```

### Statistics
```bash
curl http://localhost:3000/api/stats | jq '.'
```

### Face-Service (זיהוי פנים)
```bash
curl -X POST http://localhost:8000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com/image.jpg"}'
```

### MongoDB
```bash
mongosh mongodb://localhost:27017/Albums
show collections
db.photos.find().pretty()
```

## Troubleshooting

```bash
# dlib installation issues (Face Service)?
brew install cmake  # macOS
sudo apt-get install build-essential cmake python3-dev  # Ubuntu
pip install -r requirements.txt

# Port issues?
# Change PORT in server/.env or Vite will auto-select

# MongoDB not connecting?
ps aux | grep mongod
brew services restart mongodb-community

# Module not found?
rm -rf node_modules package-lock.json && npm install
```

---

## 🎯 End-to-End Example - סרט מלא

### שלב 1: הפעל את כל ה-Services

**טרמינל 1 - MongoDB (אם לא רץ):**
```bash
mongod
# או
brew services start mongodb-community
```

**טרמינל 2 - Face-Service:**
```bash
cd face-service
python -m uvicorn main:app --host localhost --port 8000 --reload
```

**טרמינל 3 - Server:**
```bash
cd server
npm run dev
```

**טרמינל 4 - Client:**
```bash
cd client
npm run dev
```

### שלב 2: אתחל אלבום חדש
```bash
curl -X POST http://localhost:3000/api/albums \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Weekend Photos",
    "description": "Photos from the weekend trip"
  }'
```

### שלב 3: העלה תמונה עם metadata
```bash
curl -X POST http://localhost:3000/api/photos \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Hopetoun_falls.jpg/1280px-Hopetoun_falls.jpg",
    "albumName": "Weekend Photos",
    "sender": "alice@example.com",
    "tags": ["nature", "mountains", "scenic"]
  }'
```

### שלב 4: נתח תמונה עם Face-Service
```bash
curl -X POST http://localhost:8000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Hopetoun_falls.jpg/1280px-Hopetoun_falls.jpg"
  }'
```

**תגובה צפויה:**
```json
{
  "metadata": {"DateTime": "2024-03-25T10:30:00"},
  "faces_detected": 0,
  "faces": []
}
```

### שלב 5: בדוק סטטיסטיקות
```bash
curl http://localhost:3000/api/stats | jq '.'
```

**תגובה:**
```json
{
  "total": 1,
  "topSenders": [{"sender": "alice@example.com", "count": 1}],
  "byAlbum": [{"_id": "Weekend Photos", "count": 1}],
  "byDay": [{"_id": "2024-03-25", "count": 1}],
  "topTags": [{"_id": "nature", "count": 1}, {"_id": "mountains", "count": 1}]
}
```

### שלב 6: צפה בנתונים ב-MongoDB
```bash
# בטרמינל חדש:
mongosh

# בתוך mongosh:
use Albums
db.photos.find().pretty()
db.albums.find().pretty()
db.photos.countDocuments()
```

### שלב 7: פתח את ה-UI בדפדפן
```
http://localhost:5173
```

---

## ✅ זרימה מלאה הושלמה!
1. ✅ MongoDB רץ locally
2. ✅ Face-Service מנתח תמונות
3. ✅ Server מקבל בקשות ודרוג מידע
4. ✅ סטטיסטיקות זמינות
5. ✅ Client מציג את הממשק בדפדפן

---

---

**Features:**
- ✅ Server auto-reload (nodemon)
- ✅ Client hot reload (Vite HMR)
- ✅ API proxy (CORS-free)
