import express from 'express';
import dbMongo from '../data/coonected Mongo.js';

const router = express.Router();

// GET /api/stats
router.get('/', async (req, res) => {
  try {
    const collection = dbMongo.collection('photos');

    const [topSenders, byAlbum, byDay, topTags, total] = await Promise.all([

      // חמשת המשתמשים עם הכי הרבה תמונות
      collection.aggregate([
        { $group: { _id: '$sender', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
        { $project: { sender: '$_id', count: 1, _id: 0 } }
      ]).toArray(),

      // מספר תמונות לפי אלבום
      collection.aggregate([
        { $group: { _id: '$albumName', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]).toArray(),

      // תמונות לפי יום בשבעת הימים האחרונים
      collection.aggregate([
        { $match: { createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() } } },
        { $group: { _id: { $substr: ['$createdAt', 0, 10] }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ]).toArray(),

      // עשר התגיות הנפוצות ביותר
      // $unwind פורס כל מערך תגיות לשורות נפרדות לפני הספירה
      collection.aggregate([
        { $unwind: '$tags' },
        { $group: { _id: '$tags', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]).toArray(),

      collection.countDocuments()
    ]);

    res.json({ total, topSenders, byAlbum, byDay, topTags });

  } catch (err) {
    console.error('שגיאה בטעינת סטטיסטיקות:', err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
