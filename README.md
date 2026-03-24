# Hackathon-Project

בוט טלגרם שמעלה תמונות ל-Cloudinary ושומר אותן במסד נתונים עם גלריה לצפייה.

---

## הרצה רגילה (בלי Docker)

```bash
cd server
npm install
npm run dev
```

---

## הרצה עם Docker

```bash
docker-compose up --build
```

לעצירה:

```bash
docker-compose down
```

---

## משתני סביבה

צור קובץ `server/.env` עם הפרטים הבאים:

```
TELEGRAM_TOKEN=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
MONGO_URI=
PORT=3000
```

---

## נתיבי API

| נתיב | מתודה | תיאור |
|------|--------|--------|
| /api/photos | GET | כל התמונות |
| /api/photos/:albumName | GET | תמונות לפי אלבום |
| /api/photos | POST | שמירת תמונה |
| /api/photos/:id | DELETE | מחיקת תמונה |
| /api/photos/:id/album | PATCH | שיוך לאלבום |
| /api/albums | GET | כל האלבומים |
| /api/albums | POST | יצירת אלבום |
| /api/albums/:id | DELETE | מחיקת אלבום |
| /api/stats | GET | סטטיסטיקות |
| /health | GET | בדיקת תקינות השרת |
