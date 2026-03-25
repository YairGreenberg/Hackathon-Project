from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import requests
import face_recognition
from io import BytesIO
from PIL import Image, ExifTags

app = FastAPI()


# הגדרת המבנה של הבקשה שהשרת מצפה לקבל (URL של תמונה)
class ImageRequest(BaseModel):
    url: str


@app.post("/api/analyze")
async def analyze_image(request: ImageRequest):
    try:
        # 1. הורדת התמונה מה-URL לתוך זיכרון ה-RAM (ללא שמירה על הדיסק)
        response = requests.get(request.url)
        response.raise_for_status()
        image_bytes = BytesIO(response.content)

        # 2. חילוץ מטא-דאטה (EXIF) בעזרת Pillow
        pil_image = Image.open(image_bytes)
        metadata = {}
        exif_data = pil_image._getexif()

        if exif_data:
            for tag, value in exif_data.items():
                if tag in ExifTags.TAGS:
                    tag_name = ExifTags.TAGS[tag]
                    # שומרים רק נתונים פשוטים שאפשר להמיר ל-JSON
                    if isinstance(value, (str, int, float)):
                        metadata[tag_name] = value

        # 3. טעינת התמונה למערך שמובן לספריית זיהוי הפנים
        image_bytes.seek(0)  # איפוס הסמן של הקובץ בזיכרון
        image_array = face_recognition.load_image_file(image_bytes)

        # 4. זיהוי מיקומי הפרצופים ויצירת ה"חתימה המתמטית" לכל פרצוף
        face_locations = face_recognition.face_locations(image_array)
        face_encodings = face_recognition.face_encodings(image_array, face_locations)

        faces_data = []
        # מעבר על כל הפרצופים שזוהו בתמונה
        for location, encoding in zip(face_locations, face_encodings):
            top, right, bottom, left = location  # קואורדינטות הריבוע סביב הפנים
            faces_data.append({
                "boundingBox": {
                    "top": top,
                    "right": right,
                    "bottom": bottom,
                    "left": left
                },
                # המרת וקטור המספרים (Numpy Array) לרשימה רגילה כדי שנוכל לשלוח כ-JSON
                "encoding": encoding.tolist()
            })

        # 5. החזרת התשובה ל-Node.js
        return {
            "metadata": metadata,
            "faces_detected": len(faces_data),
            "faces": faces_data
        }

    except Exception as e:
        # במקרה של שגיאה (למשל URL לא תקין), נחזיר שגיאת 500
        raise HTTPException(status_code=500, detail=str(e))