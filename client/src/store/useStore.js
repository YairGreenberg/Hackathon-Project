import { create } from "zustand";
import api from "../services/api";

const useStore = create((set, get) => ({
  albums: [],
  photos: [],
  selectedAlbum: null, // null אומר שמציגים את כל התמונות

  fetchAlbums: async () => {
    try {
      const response = await api.get("/albums");
      set({ albums: response.data.albums });
    } catch (error) {
      console.error("Error fetching albums:", error);
    }
  },

  fetchPhotos: async () => {
    try {
      const response = await api.get("/photos");
      set({ photos: response.data.photos });
    } catch (error) {
      console.error("Error fetching photos:", error);
    }
  },

  // פונקציה לעדכון האלבום הנבחר
  setSelectedAlbum: (albumName) => {
    set({ selectedAlbum: albumName });
  },

  // פונקציה שמחזירה רק את התמונות הרלוונטיות
  getFilteredPhotos: () => {
    const { photos, selectedAlbum } = get();
    if (!selectedAlbum) return photos;
    return photos.filter((photo) => photo.albumName === selectedAlbum);
  },

  deletePhoto: async (photoId) => {
    try {
      // זה יפעיל את כל תהליך המחיקה הכפול בשרת
      await api.delete(`/photos/${photoId}`);

      // עדכון ה-UI
      set((state) => ({
        photos: state.photos.filter((p) => p._id !== photoId),
      }));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  },
}));

export default useStore;
