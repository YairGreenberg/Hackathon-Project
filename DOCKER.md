# 🐳 הרצה עם Docker

ההדרך הקל ביותר להרצה של כל הפרויקט בבת אחת.

## דרישות מוקדמות

- Docker ו-Docker Compose מותקנים
- Telegram Token ו-Cloudinary credentials

## הגדרה

```bash
# 1. הכן את ה-credentials
cp server/.env.example server/.env
nano server/.env  # עדכן TELEGRAM_TOKEN ו-Cloudinary info

# שים לב: MONGO_URI חייב להישאר: mongodb://mongo:27017/Albums
```

## הפעלה

```bash
# הפעל את כל 4 ה-Services
docker-compose up --build

# בחלון אחר כדי להפסיק
docker-compose down
```

**גישה:**
- 🌐 Client: http://localhost:5173
- 🔌 API: http://localhost:3000
- 🎭 Face-Service Docs: http://localhost:8000/docs
- 🗄️ MongoDB: localhost:27017

## MongoDB Direct Access
```bash
mongosh "mongodb://localhost:27017/Albums"

# בתוך mongosh:
show collections
db.photos.find().pretty()
db.photos.countDocuments()
```

---

## API Endpoints - בדיקות מהטרמינל

### Photos
```bash
# Get all
curl http://localhost:3000/api/photos

# Create
curl -X POST http://localhost:3000/api/photos \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com/photo.jpg","albumName":"Family","sender":"user@example.com","tags":["nature"]}'
```

### Albums
```bash
# Get all
curl http://localhost:3000/api/albums

# Create
curl -X POST http://localhost:3000/api/albums \
  -H "Content-Type: application/json" \
  -d '{"name":"Family","description":"Family photos"}'
```

### Statistics
```bash
curl http://localhost:3000/api/stats | jq '.'
```
**תשובה:** `total`, `topSenders`, `byAlbum`, `byDay`, `topTags`

### Face-Service (זיהוי פנים)
```bash
curl -X POST http://localhost:8000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com/image.jpg"}'
```
**Docs:** http://localhost:8000/docs

---

## Troubleshooting

```bash
# Port already in use?
docker-compose down

# MongoDB issues?
docker-compose logs mongo
docker-compose down -v && docker-compose up --build

# Build failed?
docker-compose build --no-cache

# View logs
docker-compose logs -f
docker-compose logs server -f
```

---

## 🎯 End-to-End Example - סרט מלא

### שלב 1: הפעל את כל ה-Stack
```bash
docker-compose up --build
```

### שלב 2: אתחל אלבום חדש
```bash
curl -X POST http://localhost:3000/api/albums \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Family Vacation",
    "description": "Summer 2024 photos"
  }'
```

### שלב 3: העלה תמונה
```bash
curl -X POST http://localhost:3000/api/photos \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Hopetoun_falls.jpg/1280px-Hopetoun_falls.jpg",
    "albumName": "Family Vacation",
    "sender": "john@example.com",
    "tags": ["nature", "waterfall", "landscape"]
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

**תגובה:**
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
  "topSenders": [{"sender": "john@example.com", "count": 1}],
  "byAlbum": [{"_id": "Family Vacation", "count": 1}],
  "byDay": [{"_id": "2024-03-25", "count": 1}],
  "topTags": [{"_id": "nature", "count": 1}, {"_id": "waterfall", "count": 1}, {"_id": "landscape", "count": 1}]
}
```

### שלב 6: צפה בתמונות ב-DB
```bash
# בחלון טרמינל חדש:
mongosh "mongodb://localhost:27017/Albums"

# בתוך mongosh:
db.photos.find().pretty()
```

### שלב 7: פתח את ה-UI בדפדפן
```
http://localhost:5173
```

---

## ✅ זה הכל! זרימה מלאה:
1. ✅ אתחול אלבום
2. ✅ עלאת תמונה עם metadata
3. ✅ ניתוח תמונה (זיהוי פנים)
4. ✅ הצגת סטטיסטיקות
5. ✅ צפייה בממשק ויזואלי

---

## Data Persistence

MongoDB data שמור ב-`./data/mongodb/` (persistent בין restarts)
