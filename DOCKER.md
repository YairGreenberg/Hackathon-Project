# הרצה עם Docker

## דרישות מוקדמות

- **Docker** מותקן
- **Docker Compose** מותקן

```bash
# בדוק גרסאות
docker --version
docker-compose --version
```

---

## הגדרה ראשונית

### 1️⃣ הגדר Credentials

```bash
# העתק את ה-example ל-.env
cp server/.env.example server/.env

# עדכן את ה-credentials בקובץ זה
nano server/.env

# עדכן:
# - TELEGRAM_TOKEN
# - CLOUDINARY_API_KEY/SECRET
# - משאר הערכים
```

**שים לב:** `MONGO_URI` צריך להישאר:
```
MONGO_URI=mongodb://mongo:27017/Albums
```

(שם הקונטיינר: `mongo`)

---

## הרצה

### 🚀 הפעל את כל ה-Stack

```bash
docker-compose up --build
```

**Output צפוי:**
```
✅ client-1 | listening on port 5173
✅ server-1 | 🚀 Server running on port 3000
✅ mongo-1  | Waiting for connections
```

### 🛑 עצור את כל הקונטיינרים

```bash
docker-compose down
```

### 🗑️ מחק volumes (reset DB)

```bash
docker-compose down -v
```

---

## גישה לאפליקציה

```
http://localhost:5173
```

**API Server:** `http://localhost:3000`
**MongoDB:** `localhost:27017`

---

## קבצים חשובים

| ملف | מטרה |
|------|--------|
| `docker-compose.yml` | הגדרת כל 4 השירותים |
| `Dockerfile` | בנייה של server image |
| `client/Dockerfile` | בנייה של client image |
| `face-service/Dockerfile` | בנייה של face-service image |
| `client/nginx.conf` | Nginx config ל-proxy |
| `data/mongodb/` | MongoDB persistent volume |

---

## Face Service API

**Endpoint:**
```
POST http://face-service:8000/api/analyze
```

**בקשה:**
```json
{
  "url": "https://example.com/image.jpg"
}
```

**תשובה:**
```json
{
  "metadata": {
    "Model": "Canon EOS",
    "DateTime": "2024-03-25T10:30:00"
  },
  "faces_detected": 2,
  "faces": [
    {
      "boundingBox": {
        "top": 50,
        "right": 150,
        "bottom": 200,
        "left": 100
      },
      "encoding": [0.1234, -0.5678, ...]
    }
  ]
}
```

---

## Statistics API

**Endpoint:**
```
GET http://localhost:3000/api/stats
```

**תשובה:**
```json
{
  "total": 42,
  "topSenders": [
    { "sender": "user@example.com", "count": 8 },
    { "sender": "john@example.com", "count": 6 }
  ],
  "byAlbum": [
    { "_id": "Family", "count": 20 },
    { "_id": "Work", "count": 15 },
    { "_id": "Travel", "count": 7 }
  ],
  "byDay": [
    { "_id": "2024-03-25", "count": 5 },
    { "_id": "2024-03-24", "count": 3 }
  ],
  "topTags": [
    { "_id": "nature", "count": 12 },
    { "_id": "sunset", "count": 8 },
    { "_id": "friends", "count": 6 }
  ]
}
```

**מה הנתונים:**
- `total` - סך כל התמונות בבסיס הנתונים
- `topSenders` - 5 המשתמשים עם הכי תמונות
- `byAlbum` - כמה תמונות בכל אלבום
- `byDay` - כמה תמונות בכל יום (7 ימים אחרונים)
- `topTags` - 10 התגיות הנפוצות ביותר

---

## Architecture

```
┌───────────────────────────────────────────────────────────┐
│          Docker Network (app-network)                     │
├───────────────────────────────────────────────────────────┤
│                                                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │   Client     │  │    Server    │  │Face Service  │   │
│  │(Nginx 5173)  │◄─┤  (Node 3000) │─►│  (Python     │   │
│  └──────────────┘  └──────┬───────┘  │   8000)      │   │
│                           │           └──────────────┘   │
│                    ┌──────▼───────┐                       │
│                    │  MongoDB     │                       │
│                    │  (27017)     │                       │
│                    └──────────────┘                       │
│                                                           │
└───────────────────────────────────────────────────────────┘
         ▲
         │ (localhost:5173)
      Browser
```

**Face Service Role:**
- 📸 מקבל URLs של תמונות מה-Server
- 🔍 מנתח פנים ומטא-דטה EXIF
- 📤 מחזיר face encodings וקואורדינטות
- Endpoint: `POST /api/analyze`

---

## Troubleshooting

### ❌ "Port already in use"

```bash
# בדוק איזה process משתמש בport
lsof -i :5173
lsof -i :3000
lsof -i :27017

# עצור את ה-container
docker-compose down

# או שנה את ה-port ב-docker-compose.yml
```

### ❌ "MongoDB won't start"

```bash
# בדוק את הלוגים
docker-compose logs mongo

# reset את ה-volume
docker-compose down -v
docker-compose up --build
```

### ❌ "Can't reach API from client"

- וודא ש-`server` קונטיינר רץ בתוך network
- בדוק ש-nginx.conf מכוונת נכון:
  ```nginx
  proxy_pass http://server:3000;
  ```

### ❌ "Build failed"

```bash
# בנה מחדש בלי cache
docker-compose build --no-cache

# או reset הכל
docker system prune -a
docker-compose up --build
```

---

## Logging

### צפה בלוגים של שרת מסוים

```bash
# Server logs
docker-compose logs server -f

# Client logs
docker-compose logs client -f

# MongoDB logs
docker-compose logs mongo -f

# הכל
docker-compose logs -f
```

---

## Development vs Production

| | Local | Docker |
|---|---|---|
| **MongoDB** | `localhost:27017` | `mongo:27017` |
| **Server** | `localhost:3000` | `http://server:3000` |
| **Client** | `localhost:5173` | `localhost:5173` |
| **Hot Reload** | ✅ Nodemon + Vite | ✅ Containers |
| **Use Case** | Development | Testing/Production |

---

## Volume Persistence

MongoDB data שמור ב:
```
./data/mongodb/
```

זה persistent בין restarts:
```bash
docker-compose down
docker-compose up  # data עדיין שם
```

---

## Resources

- [Docker Docs](https://docs.docker.com/)
- [Docker Compose Docs](https://docs.docker.com/compose/)
- [Nginx Docs](https://nginx.org/en/docs/)
- [MongoDB Docker Image](https://hub.docker.com/_/mongo)
