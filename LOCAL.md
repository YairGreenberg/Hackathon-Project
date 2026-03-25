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

### אפשרות 2️⃣ - בשני טרמינלים (מומלץ)

**טרמינל 1 - Server:**
```bash
cd server
npm run dev
```

**טרמינל 2 - Client:**
```bash
cd client
npm run dev
```

### 🚀 גישה לאפליקציה

```
http://localhost:5173
```

**API Server:** `http://localhost:3000`

---

## Troubleshooting

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
