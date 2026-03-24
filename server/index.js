import "dotenv/config";
import express from "express";
import axios from "axios";
import cors from "cors";
import TelegramBot from "node-telegram-bot-api";
import photosRouter from "./routes/photos.js";
import albumsRouter from "./routes/albums.js";
import { uploadToCloudinary } from "./services/cloudinaryService.js";
import statsRouter from "./routes/stats.js"; // מחבר את קובץ הסטטיסטיקות לשרת

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const sender = String(msg.from?.username || msg.from?.id);

  if (msg.text === "/start") {
    return bot.sendMessage(chatId, "שלח לי תמונה ואעלה אותה לדרייב שלך!");
  }

  let fileId, fileName, mimeType;

  if (msg.photo?.length > 0) {
    const photo = msg.photo[msg.photo.length - 1];
    fileId = photo.file_id;
    fileName = `photo_${Date.now()}.jpg`;
    mimeType = "image/jpeg";
  } else if (msg.video) {
    fileId = msg.video.file_id;
    fileName = msg.video.file_name || `video_${Date.now()}.mp4`;
    mimeType = msg.video.mime_type || "video/mp4";
  } else if (msg.document) {
    fileId = msg.document.file_id;
    fileName = msg.document.file_name || `file_${Date.now()}`;
    mimeType = msg.document.mime_type || "application/octet-stream";
  }

  if (!fileId) return;

  try {
    const file = await bot.getFile(fileId);
    const downloadUrl = `https://api.telegram.org/file/bot${process.env.TELEGRAM_TOKEN}/${file.file_path}`;

    // 1. הורדת הקובץ מטלגרם כזרם (Stream)
    const stream = await axios({
      method: "get",
      url: downloadUrl,
      responseType: "stream",
    });

    // 2. העלאה ל-Cloudinary וקבלת ה-URL הקבוע
    const cloudinaryResult = await uploadToCloudinary(stream.data);

    // 3. שליחת הנתונים ל-API שלנו
    await axios.post("http://localhost:3000/api/photos", {
      fileUrl: cloudinaryResult.secure_url,
      tags: cloudinaryResult.tags || [], // מערך תגיות שיתמלא אוטומטית ע"י ניתוח התמונה ב-Cloudinary
      caption: msg.caption || "",
      sender,
      source: "telegram",
    });

    console.log(`📸 נשמר בענן מ-${sender}`);
    bot.sendMessage(chatId, "✅ התמונה נשמרה בהצלחה באלבום!");
  } catch (err) {
    console.error('❌ שגיאה מפורטת:', err);
    bot.sendMessage(chatId, 'משהו השתבש בשמירת התמונה.');
  }
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/photos", photosRouter);
app.use("/api/albums", albumsRouter);
app.use("/api/stats",  statsRouter); // מחזיר סטטיסטיקות על התמונות — מי שלח הכי הרבה, תגיות נפוצות וכו'

app.post("/webhook/whatsapp", (req, res) => {
  console.log("📩 WhatsApp:", JSON.stringify(req.body).slice(0, 120));
  res.set("Content-Type", "text/xml");
  res.send("<Response></Response>");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 שרת פעיל: http://localhost:${PORT}`);
  console.log(`🤖 בוט טלגרם פעיל`);
});
