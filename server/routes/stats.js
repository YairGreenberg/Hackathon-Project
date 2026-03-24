import express from 'express';
import Photo from '../models/Photo.js';

const router = express.Router();

// GET /api/stats
router.get('/', async (req, res) => {
  try {
    const [topSenders, byAlbum, byDay, topTags, total] = await Promise.all([

      // חמשת המשתמשים עם הכי הרבה תמונות
      Photo.aggregate([
        { $group: { _id: '$sender', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
        { $project: { sender: '$_id', count: 1, _id: 0 } }
      ]),

      // מספר תמונות לפי אלבום
      Photo.aggregate([
        { $group: { _id: '$albumName', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),

      // תמונות לפי יום בשבעת הימים האחרונים
      Photo.aggregate([
        { $match: { createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ]),

      // עשר התגיות הנפוצות ביותר
      // $unwind פורס כל מערך תגיות לשורות נפרדות לפני הספירה
      Photo.aggregate([
        { $unwind: '$tags' },
        { $group: { _id: '$tags', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]),

      Photo.countDocuments()
    ]);

    res.json({ total, topSenders, byAlbum, byDay, topTags });

  } catch (err) {
    console.error('שגיאה בטעינת סטטיסטיקות:', err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
