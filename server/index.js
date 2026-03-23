import 'dotenv/config';
import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
// import { downloadFile } from './services/downloader.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// אחסון זמני בזיכרון — עד שה-DB מוכן
const photos = [];

const UPLOADS = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(UPLOADS)) fs.mkdirSync(UPLOADS);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', photos: photos.length });
});


//token telegrm
app.post('/webhook/telegram', (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.sendStatus(200);
  }

  const sender = message.from?.username || message.from?.id || 'unknown';
  const caption = message.caption || message.text || '';
  const hasPhoto = !!message.photo;

  console.log(`📩 הודעה מ-${sender} | תמונה: ${hasPhoto} | טקסט: "${caption}"`);

  if (hasPhoto) {
    const photo = {
      id: Date.now().toString(),
      fileUrl: '',
      caption,
      sender,
      source: 'telegram',
      createdAt: new Date().toISOString(),
    };
    photos.push(photo);
    console.log(`📸 נשמר מ-${sender}`);
  }

  res.sendStatus(200);
});
// קבלת תמונה — POST /api/photo
// body: { fileUrl, caption, sender, source }
app.post('/api/photo', (req, res) => {
  const { fileUrl = '', caption = '', sender = 'unknown', source = 'telegram' } = req.body;

  const photo = {
    id: Date.now().toString(),
    fileUrl,
    caption,
    sender,
    source,
    createdAt: new Date().toISOString(),
  };

  photos.push(photo);
  console.log(`📸 נשמר מ-${sender}`);
  res.json({ success: true, photo });
});

app.get('/api/photos', (req, res) => {
  res.json({ count: photos.length, photos });
});

// Telegram webhook — מוכן לחיבור כשיהיה הקוד
app.post('/webhook/telegram', (req, res) => {
  console.log('📩 טלגרם:', JSON.stringify(req.body).slice(0, 120));
  res.sendStatus(200);
});

// WhatsApp / Twilio webhook
app.post('/webhook/whatsapp', (req, res) => {
  console.log('📩 WhatsApp:', JSON.stringify(req.body).slice(0, 120));
  res.set('Content-Type', 'text/xml');
  res.send('<Response></Response>');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 שרת פעיל: http://localhost:${PORT}`);
  console.log(`⚠️  זיכרון זמני — ממתין ל-MongoDB URI`);
});


