# הרצה מקומית (Development)

## דרישות מוקדמות

- **Node.js 20+**
- **MongoDB מותקן ורץ** על `localhost:27017`
  ```bash
  # בדוק אם MongoDB פעיל
  mongosh --version

  # אם צריך להתחיל MongoDB
  brew services start mongodb-community
  # או
  mongod
  ```

## הגדרה ראשונית

### 1️⃣ הורד Dependencies

```bash
npm install
```

### 2️⃣ הגדר Credentials

```bash
# העתק את ה-example ל-.env
cp server/.env.example server/.env

# עדכן את ה-credentials
# TELEGRAM_TOKEN - מ-@BotFather
# CLOUDINARY_API_KEY/SECRET - מ-cloudinary.com
```

### 3️⃣ בדוק ש-MongoDB פעיל

```bash
# בטרמינל נפרד
mongod

# או עם Homebrew
brew services start mongodb-community
```

---

## הרצה

### אפשרות 1️⃣ - בטרמינל אחד (אם מותקן npm-run-all)

```bash
npm install npm-run-all --save-dev
npm run dev
```

### אפשרות 2️⃣ - בשלושה טרמינלים (מומלץ - עם Face Service)

**טרמינל 1 - Face Service (Python):**
```bash
cd face-service
pip install -r requirements.txt
python -m uvicorn main:app --host localhost --port 8000 --reload
```

**טרמינל 2 - Server (Node.js):**
```bash
cd server
npm run dev
```

**טרמינל 3 - Client (React):**
```bash
cd client
npm run dev
```

### דרישות נוספות

**Face Service דורש:**
- Python 3.10+
- [dlib](https://github.com/davisking/dlib) - requires C++ build tools
- [face_recognition](https://github.com/ageitgey/face_recognition) library

**התקנה (macOS):**
```bash
brew install cmake
cd face-service
pip install -r requirements.txt
```

**התקנה (Ubuntu/Debian):**
```bash
sudo apt-get install build-essential cmake python3-dev
cd face-service
pip install -r requirements.txt
```

### 🚀 גישה לאפליקציה

```
http://localhost:5173
```

**API Server:** `http://localhost:3000`

---

## 🧪 בדיקת API Endpoints מהטרמינל

### 📸 Photos Endpoints

**Get all photos:**
```bash
curl http://localhost:3000/api/photos
```

**Create new photo:**
```bash
curl -X POST http://localhost:3000/api/photos \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com/photo.jpg",
    "albumName": "Family",
    "sender": "user@example.com",
    "tags": ["nature", "sunset"]
  }'
```

---

### 📁 Albums Endpoints

**Get all albums:**
```bash
curl http://localhost:3000/api/albums
```

**Create new album:**
```bash
curl -X POST http://localhost:3000/api/albums \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Vacation 2024",
    "description": "Summer trip photos"
  }'
```

---

### 📊 Statistics Endpoint

**Get statistics:**
```bash
curl http://localhost:3000/api/stats
```

**Response example:**
```json
{
  "total": 42,
  "topSenders": [{"sender": "user@example.com", "count": 8}],
  "byAlbum": [{"_id": "Family", "count": 20}],
  "byDay": [{"_id": "2024-03-25", "count": 5}],
  "topTags": [{"_id": "nature", "count": 12}]
}
```

---

### 🎭 Face-Service Endpoints (Local Python)

**Analyze image for faces:**
```bash
curl -X POST http://localhost:8000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com/image.jpg"
  }'
```

**Response example:**
```json
{
  "metadata": {"Model": "Canon EOS", "DateTime": "2024-03-25T10:30:00"},
  "faces_detected": 2,
  "faces": [
    {
      "boundingBox": {"top": 50, "right": 150, "bottom": 200, "left": 100},
      "encoding": [0.1234, -0.5678, ...]
    }
  ]
}
```

**View Face-Service Swagger UI:**
```bash
open http://localhost:8000/docs
```

---

### 🗄️ MongoDB Direct Access

**Connect to MongoDB:**
```bash
mongosh --connection mongodb://localhost:27017/Albums
```

**View collections:**
```javascript
show collections
```

**Query photos:**
```javascript
db.photos.find().pretty()
```

**Count total photos:**
```javascript
db.photos.countDocuments()
```

---

## Statistics API

**Endpoint:**
```
GET http://localhost:3000/api/stats
```

מחזיר ניתוח מלא של התמונות ברשת:
- Top 5 senders (משתמשים עם הכי תמונות)
- תמונות לפי אלבום
- תמונות לפי יום (7 ימים אחרונים)
- Top 10 תגיות
- סך הכל תמונות

---

## Troubleshooting

### ❌ Face Service - "ModuleNotFoundError: No module named 'dlib'"

```bash
# התקן build tools תחילה
# macOS:
brew install cmake

# Ubuntu/Debian:
sudo apt-get install build-essential cmake python3-dev

# אח"כ התקן מחדש
pip install --upgrade pip
pip install -r requirements.txt
```

### ❌ Face Service - "Connection refused on port 8000"

```bash
# בדוק אם Python רץ
lsof -i :8000

# או הרץ עם לוג יותר מסבבר
python -m uvicorn main:app --host localhost --port 8000 --reload
```

### ❌ MongoDB לא מתחבר

```bash
# בדוק שהוא רץ
ps aux | grep mongod

# או בדוק ב-mongosh
mongosh

# אם צריך להתחיל מחדש
brew services restart mongodb-community
```

### ❌ Port 3000 already in use

```bash
# שנה את ה-PORT ב-server/.env
PORT=3001
```

### ❌ Port 5173 already in use

```bash
# Vite יבחור port אחר אוטומטית
# או שנה את הportבclient/vite.config.js
```

### ❌ "Cannot find module"

```bash
# נקה node_modules והתקן מחדש
rm -rf node_modules package-lock.json
npm install
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

## פיתוח

- **Server Auto-Reload**: nodemon פעיל
- **Client Hot Reload**: Vite HMR פעיל
- **API Proxy**: Vite proxy מנקה את CORS issues

---

## עצירה

```bash
# Ctrl + C בשני הטרמינלים
```

---

## משאבים

- [MongoDB Docs](https://docs.mongodb.com/)
- [Node.js Docs](https://nodejs.org/docs/)
- [Vite Docs](https://vitejs.dev/)
- [Express.js Docs](https://expressjs.com/)
