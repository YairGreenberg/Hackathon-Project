import express from 'express';
import { ObjectId } from 'mongodb';
import dbMongo from '../data/coonected Mongo.js';

const router = express.Router();

// GET /api/photos — כל התמונות
router.get('/', async (req, res) => {
  try {
    const photos = await dbMongo.collection('photos').find().toArray();
    res.json({ count: photos.length, photos });
  } catch (err) {
    res.status(500).json({ error: 'שגיאה בשליפת תמונות' });
  }
});

// GET /api/photos/:albumName — לפי אלבום
router.get('/:albumName', async (req, res) => {
  try {
    const { albumName } = req.params;
    const photos = await dbMongo.collection('photos').find({ albumName }).toArray();
    res.json({ count: photos.length, photos });
  } catch (err) {
    res.status(500).json({ error: 'שגיאה בשליפת תמונות' });
  }
});

// POST /api/photos — שמירת תמונה
router.post('/', async (req, res) => {
  try {
    const { fileUrl = '', caption = '', sender = 'unknown', source = 'telegram', albumName = 'general' } = req.body;

    const photo = {
      fileUrl,
      caption,
      sender,
      source,
      albumName,
      createdAt: new Date().toISOString(),
    };

    const result = await dbMongo.collection('photos').insertOne(photo);
    console.log(`📸 נשמר מ-${sender} לאלבום ${albumName}`);
    res.json({ success: true, photo: { ...photo, id: result.insertedId } });
  } catch (err) {
    res.status(500).json({ error: 'שגיאה בשמירת תמונה' });
  }
});

// DELETE /api/photos/:id — מחיקת תמונה
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await dbMongo.collection('photos').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'תמונה לא נמצאה' });
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'שגיאה במחיקת תמונה' });
  }
});

// PATCH /api/photos/:id/album — שייך תמונה לאלבום
router.patch('/:id/album', async (req, res) => {
  try {
    const { id } = req.params;
    const { albumName } = req.body;

    const result = await dbMongo.collection('photos').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { albumName } },
      { returnDocument: 'after' }
    );

    if (!result) {
      return res.status(404).json({ error: 'תמונה לא נמצאה' });
    }

    res.json({ success: true, photo: result });
  } catch (err) {
    res.status(500).json({ error: 'שגיאה בעדכון אלבום' });
  }
});

export default router;