import express from 'express';

const router = express.Router();

// אחסון זמני — יוחלף ב-MongoDB
const albums = [];

// GET /api/albums — כל האלבומים
router.get('/', (req, res) => {
  res.json({ count: albums.length, albums });
});

// POST /api/albums — צור אלבום חדש
router.post('/', (req, res) => {
  const { name, description = '' } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'חסר שם אלבום' });
  }

  const album = {
    id: Date.now().toString(),
    name,
    description,
    createdAt: new Date().toISOString(),
  };

  albums.push(album);
  console.log(`📁 אלבום נוצר: ${name}`);
  res.json({ success: true, album });
});

export default router;
