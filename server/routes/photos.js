import express from "express";

const router = express.Router();

// אחסון זמני — יוחלף ב-MongoDB
const photos = [];

// GET /api/photos — כל התמונות
router.get("/", (req, res) => {
  res.json({ count: photos.length, photos });
});

// GET /api/photos/:albumName — לפי אלבום
router.get("/:albumName", (req, res) => {
  const { albumName } = req.params;
  const filtered = photos.filter((p) => p.albumName === albumName);
  res.json({ count: filtered.length, photos: filtered });
});

// POST /api/photos — שמירת תמונה
router.post("/", (req, res) => {
  const {
    fileUrl = "",
    caption = "",
    sender = "unknown",
    source = "telegram",
    albumName = "general",
  } = req.body;

  const photo = {
    id: Date.now().toString(),
    fileUrl,
    caption,
    sender,
    source,
    albumName,
    createdAt: new Date().toISOString(),
  };

  photos.push(photo);
  console.log(`📸 נשמר מ-${sender} לאלבום ${albumName}`);
  res.json({ success: true, photo });
});

// DELETE /api/photos/:id — מחיקת תמונה
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const index = photos.findIndex((p) => p.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "תמונה לא נמצאה" });
  }

  photos.splice(index, 1);
  res.json({ success: true });
});

// PATCH /api/photos/:id/album — שייך תמונה לאלבום
router.patch("/:id/album", (req, res) => {
  const { id } = req.params;
  const { albumName } = req.body;

  const photo = photos.find((p) => p.id === id);

  if (!photo) {
    return res.status(404).json({ error: "תמונה לא נמצאה" });
  }

  photo.albumName = albumName;
  res.json({ success: true, photo });
});

export default router;
