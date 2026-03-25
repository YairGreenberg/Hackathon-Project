FROM python:3.10-slim

# התקנת כלי הבנייה של C++ שדרושים ל-dlib
RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# העתקת קובץ הדרישות
COPY requirements.txt .

# התקנת ספריות הפייתון
RUN pip install --no-cache-dir -r requirements.txt

# העתקת קוד השרת
COPY . .

# חשיפת הפורט של FastAPI
EXPOSE 8000

# פקודת ההרצה
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]