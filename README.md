# Hackathon-Project

בוט טלגרם שמעלה תמונות ל-Cloudinary ושומר אותן במסד נתונים עם גלריה לצפייה.

## הגדרות ראשוניות (Environment Variables)
לפני ההרצה, יש ליצור קובץ בשם .env בתוך תיקיית server.
שימו לב: הגדרת ה-MONGO_URI משתנה בהתאם לשיטת ההרצה שלכם!
````
TELEGRAM_TOKEN=your_token_here
CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
PORT=3000

# אם אתם מריצים עם Docker:
MONGO_URI=mongodb://mongo:27017/Albums

# אם אתם מריצים עם Node.js (על המחשב):
# MONGO_URI=mongodb://localhost:27017/Albums
# MONGO_TLS=false
````

---
### אפשרויות הרצה
בחר בשיטה המועדפת עליך:

## הרצה רגילה (Node.js)

וודא ש-MONGO_URI מכוון ל-
mongodb://localhost:27017/Albums

התקן חבילות והרץ
```bash
cd server
npm install
npm run dev
```

---

## הרצה עם Docker
שיטה זו מריצה גם את השרת וגם את מסד הנתונים (MongoDB) בתוך קונטיינרים, ללא צורך בהתקנות מקומיות.

וודא ש-MONGO_URI מכוון ל-
mongodb://mongo:27017/Albums

הרץ את הפקודה:
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

