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
