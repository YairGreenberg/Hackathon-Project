import express from 'express';
import { ObjectId } from 'mongodb';
import dbMongo from '../data/coonected Mongo.js';
import { deleteFromCloudinary } from '../services/cloudinaryService.js';

const router = express.Router();

// GET /api/photos — שליפת כל התמונות
router.get('/', async (req, res) => {
  try {
    const photos = await dbMongo.collection('photos')
      .find()
      .sort({ createdAt: -1 }) // הצגת החדשות ביותר קודם
      .toArray();
    res.json({ count: photos.length, photos });
  } catch (err) {
    res.status(500).json({ error: 'שגיאה בשליפת תמונות' });
  }
});

// GET /api/photos/:albumName — סינון לפי שם אלבום
router.get('/album/:albumName', async (req, res) => {
  try {
    const { albumName } = req.params;
    const photos = await dbMongo.collection('photos').find({ albumName }).toArray();
    res.json({ count: photos.length, albumName, photos });
  } catch (err) {
    res.status(500).json({ error: 'שגיאה בסינון לפי אלבום' });
  }
});

// POST /api/photos — שמירת תמונה חדשה
router.post('/', async (req, res) => {
  try {
    const { fileUrl, caption, sender, source, albumName } = req.body;

    if (!fileUrl) return res.status(400).json({ error: 'חסר URL של התמונה' });

    const photo = {
      fileUrl,
      caption: caption || '',
      sender: sender || 'unknown',
      source: source || 'telegram',
      albumName: albumName || 'general',
      createdAt: new Date().toISOString(),
    };

    const result = await dbMongo.collection('photos').insertOne(photo);
    res.status(201).json({ success: true, id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: 'שגיאה בשמירת התמונה ב-DB' });
  }
});

// DELETE /api/photos/:id — מחיקת תמונה מה-DB ומהענן
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const photo = await dbMongo.collection('photos').findOne({ _id: new ObjectId(id) });
    
    if (!photo) return res.status(404).json({ error: 'התמונה לא קיימת' });

    // חילוץ ה-Public ID לצורך מחיקה מ-Cloudinary
    try {
      const parts = photo.fileUrl.split('/');
      const fileName = parts.pop().split('.')[0];
      const folder = parts.pop();
      const publicId = `${folder}/${fileName}`;
      await deleteFromCloudinary(publicId);
    } catch (cloudErr) {
      console.warn("⚠️ לא ניתן היה למחוק מהענן, מוחק מה-DB בכל זאת.");
    }

    await dbMongo.collection('photos').deleteOne({ _id: new ObjectId(id) });
    res.json({ success: true, message: 'הוסר בהצלחה' });
  } catch (err) {
    res.status(500).json({ error: 'שגיאה במחיקה' });
  }
});

export default router;