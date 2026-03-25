import "dotenv/config";
import express from "express";
import axios from "axios";
import cors from "cors";
import TelegramBot from "node-telegram-bot-api";
import photosRouter from "./routes/photos.js";
import albumsRouter from "./routes/albums.js";
import { uploadToCloudinary } from "./services/cloudinaryService.js";
import https from "https"; // נדרש לפתרון שגיאת ה-SSL

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// --- פתרון לשגיאת SSL (לשימוש מקומי בלבד) ---
// זה מאפשר ל-axios להתעלם משגיאות תעודה במידה והן נובעות מהרשת המקומית
const httpsAgent = new https.Agent({ rejectUnauthorized: false });
const apiClient = axios.create({
  baseURL: "http://localhost:3000",
  httpsAgent: httpsAgent
});
// ------------------------------------------

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

const userState = {};

async function processAndSaveFiles(chatId) {
  const state = userState[chatId];
  if (!state || !state.files.length) return;

  const albumName = state.selectedAlbum;
  bot.sendMessage(chatId, `⏳ מעלה ${state.files.length} קבצים לאלבום "${albumName}"...`);

  for (const fileObj of state.files) {
    try {
      const file = await bot.getFile(fileObj.fileId);
      const downloadUrl = `https://api.telegram.org/file/bot${process.env.TELEGRAM_TOKEN}/${file.file_path}`;

      const stream = await axios({
        method: "get",
        url: downloadUrl,
        responseType: "stream",
        httpsAgent: httpsAgent // שימוש באייג'נט גם כאן
      });

      const cloudinaryUrl = await uploadToCloudinary(stream.data);

      await apiClient.post("/api/photos", {
        fileUrl: cloudinaryUrl,
        caption: fileObj.caption || "",
        sender: state.sender,
        source: "telegram",
        albumName: albumName,
      });
    } catch (err) {
      console.error("❌ שגיאה בהעלאת קובץ:", err.message);
    }
  }

  bot.sendMessage(chatId, `✅ סיימתי! כל התמונות נשמרו באלבום "${albumName}".`);
  delete userState[chatId]; 
}

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const sender = String(msg.from?.username || msg.from?.id);
  const text = msg.text;

  if (text === "/start") {
    return bot.sendMessage(chatId, "היי! שלח לי תמונות ואשמור אותן באלבום שתבחר.");
  }

  // טיפול בשם אלבום חדש
  if (text && userState[chatId]?.step === "WAITING_ALBUM_NAME") {
    const newAlbumName = text.trim();
    try {
      const response = await apiClient.post("/api/albums", { name: newAlbumName });
      
      userState[chatId].selectedAlbum = newAlbumName;
      userState[chatId].step = "PROCESSING";
      
      if (response.data.message === 'אלבום כבר קיים') {
          bot.sendMessage(chatId, `האלבום "${newAlbumName}" כבר קיים, מוסיף אליו...`);
      }

      await processAndSaveFiles(chatId);
    } catch (err) {
      bot.sendMessage(chatId, "❌ שגיאה בגישה לאלבום.");
    }
    return;
  }

  // זיהוי מדיה
  let fileId;
  if (msg.photo?.length > 0) {
    fileId = msg.photo[msg.photo.length - 1].file_id;
  } else if (msg.video) {
    fileId = msg.video.file_id;
  }

  if (fileId) {
    if (!userState[chatId]) {
      userState[chatId] = { files: [], sender, step: "INIT" };
    }
    userState[chatId].files.push({ fileId, caption: msg.caption || "" });

    clearTimeout(userState[chatId].timer);
    userState[chatId].timer = setTimeout(() => {
      bot.sendMessage(chatId, `קיבלתי ${userState[chatId].files.length} קבצים. לאן לשמור?`, {
        reply_markup: {
          inline_keyboard: [
            [{ text: "📁 בחר אלבום קיים", callback_data: "EXISTING_ALBUM" }],
            [{ text: "➕ צור אלבום חדש", callback_data: "NEW_ALBUM" }],
          ],
        },
      });
    }, 1000);
  }
});

bot.on("callback_query", async (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;
  const state = userState[chatId];

  bot.answerCallbackQuery(query.id);
  if (!state) return bot.sendMessage(chatId, "הפעולה פגה. שלח את התמונות מחדש.");

  if (data === "EXISTING_ALBUM") {
    try {
      const { data: albumData } = await apiClient.get("/api/albums");
      if (!albumData.albums || albumData.albums.length === 0) {
        return bot.sendMessage(chatId, "אין אלבומים קיימים.");
      }
      
      const buttons = albumData.albums.map(album => ([
        { text: album.name, callback_data: `SET_ALBUM:${album.name}` }
      ]));
      
      bot.sendMessage(chatId, "בחר אלבום:", { reply_markup: { inline_keyboard: buttons } });
    } catch (err) {
      bot.sendMessage(chatId, "❌ שגיאה בשליפת אלבומים.");
    }
  } 
  else if (data === "NEW_ALBUM") {
    state.step = "WAITING_ALBUM_NAME";
    bot.sendMessage(chatId, "איך לקרוא לאלבום החדש?");
  } 
  else if (data.startsWith("SET_ALBUM:")) {
    state.selectedAlbum = data.split(":")[1];
    state.step = "PROCESSING";
    await processAndSaveFiles(chatId);
  }
});

app.use("/api/photos", photosRouter);
app.use("/api/albums", albumsRouter);

app.listen(3000, () => console.log(`🚀 Server running on port 3000`));