import express from "express";
import { ObjectId } from "mongodb";
import dbMongo from "../data/coonected Mongo.js";

const router = express.Router();

// GET /api/albums — כל האלבומים
router.get("/", async (req, res) => {
  try {
    const albums = await dbMongo.collection("albums").find().toArray();

    const newAlbums = await Promise.all(
      albums.map(async (albom) => {
        const img = await dbMongo
          .collection("photos")
          .find({ albumName: albom.name })
          .toArray();

        return {
          ...albom,
          img: img[0] || {
            fileUrl:
              "https://img.freepik.com/free-vector/yellow-folder-flat-style_78370-6671.jpg?semt=ais_hybrid&w=740&q=80",
          },
        };
      }),
    );

    console.log(newAlbums);

    res.json({ count: newAlbums.length, albums: newAlbums });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "שגיאה בשליפת אלבומים" });
  }
  // });
});

// POST /api/albums — צור אלבום חדש (עם בדיקת כפילות)
router.post("/", async (req, res) => {
  try {
    const { name, description = "" } = req.body;

    if (!name) {
      return res.status(400).json({ error: "חסר שם אלבום" });
    }

    // בדיקה אם האלבום כבר קיים
    const existingAlbum = await dbMongo
      .collection("albums")
      .findOne({ name: name.trim() });

    if (existingAlbum) {
      // אם קיים, נחזיר את האלבום הקיים במקום ליצור חדש
      return res.json({
        success: true,
        album: existingAlbum,
        message: "אלבום כבר קיים",
      });
    }

    const album = {
      name: name.trim(),
      description,
      createdAt: new Date().toISOString(),
    };

    const result = await dbMongo.collection("albums").insertOne(album);
    console.log(`📁 אלבום חדש נוצר: ${name}`);
    res.json({ success: true, album: { ...album, id: result.insertedId } });
  } catch (err) {
    res.status(500).json({ error: "שגיאה ביצירת אלבום" });
  }
});

// DELETE /api/albums/:id — מחיקת אלבום
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await dbMongo
      .collection("albums")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "אלבום לא נמצא" });
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "שגיאה במחיקת אלבום" });
  }
});

export default router;
