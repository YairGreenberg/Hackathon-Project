import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import "./style.css";

export default function AlbumPage() {
  const [albums, setAlbums] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [albumToDelete, setAlbumToDelete] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const { data } = await axios.get("http://localhost:3000/api/albums");
        setAlbums(data.albums || data);
      } catch (error) {
        console.error(error.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleClick = (id) => {
    navigate(`/album/${id}`);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:3000/api/albums/${albumToDelete._id}`
      );

      setAlbums((prev) =>
        prev.filter((a) => a._id !== albumToDelete._id)
      );

      setAlbumToDelete(null);
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="album-page">
      <h1>Albums</h1>

      {isLoading && <h2>Loading...</h2>}

      <div className="albums-grid">
        {albums.map((album) => (
          <div
            key={album._id}
            className="album-card"
            onClick={() => handleClick(album._id)}
          >
            <img src={album.img?.fileUrl} alt={album.name} />

            {/* כפתור מחיקה */}
            <button
              className="album-delete-btn"
              onClick={(e) => {
                e.stopPropagation();
                setAlbumToDelete(album);
              }}
            >
              🗑️
            </button>

            <div className="album-title">
              {album.name}
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {albumToDelete && (
        <div className="album-modal-backdrop">
          <div className="album-modal">
            <h3>Delete Album?</h3>

            <img
              src={albumToDelete.img?.fileUrl}
              alt=""
            />

            <p>{albumToDelete.name}</p>

            <div className="album-modal-actions">
              <button onClick={() => setAlbumToDelete(null)}>
                Cancel
              </button>
              <button onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}