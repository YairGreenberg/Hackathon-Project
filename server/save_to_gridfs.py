import sys
import json
import pymongo
import gridfs
import requests
from io import BytesIO
from datetime import datetime


def main():
    # קריאת הנתונים מה-Node.js
    try:
        input_data = sys.argv[1]
        data = json.loads(input_data)
    except Exception as e:
        print(json.dumps({"success": False, "error": f"Invalid input: {e}"}))
        sys.exit(1)

    # הפעם אנחנו מקבלים URL במקום נתיב לדיסק
    file_url = data.get("fileUrl")

    metadata = {
        "caption": data.get("caption", ""),
        "sender": data.get("sender", "unknown"),
        "albumName": data.get("albumName", "general"),
        "source": "telegram",
        "createdAt": datetime.utcnow()
    }

    try:
        # 1. הורדת התמונה מטלגרם ישירות לזיכרון (ללא שמירה על הדיסק!)
        response = requests.get(file_url)
        response.raise_for_status()  # מוודא שההורדה הצליחה

        # המרת התוכן הבינארי לאובייקט דמוי-קובץ בזיכרון
        image_stream = BytesIO(response.content)

        # 2. התחברות ל-MongoDB ו-GridFS
        client = pymongo.MongoClient(MONGO_URL)
        db = client["photo_album_db"]
        fs = gridfs.GridFS(db)

        # 3. חילוץ שם קובץ כלשהו מה-URL (לצורכי תצוגה בלבד ב-DB)
        filename = file_url.split('/')[-1] if '/' in file_url else "photo.jpg"

        # 4. שמירה ישירה מתוך הזיכרון ל-GridFS
        file_id = fs.put(
            image_stream,
            filename=filename,
            metadata=metadata
        )

        print(json.dumps({
            "success": True,
            "message": "Saved to GridFS directly from memory",
            "file_id": str(file_id)
        }))

    except Exception as e:
        print(json.dumps({"success": False, "error": str(e)}))
        sys.exit(1)


if __name__ == "__main__":
    main()

