import {useParams} from "react-router";
import "./style.css";

import React, {useState, useEffect} from "react";
import axios from "axios";
import {usePrint} from "../../hooke/usePrint";

const fakeImages = [];

function index() {
  const [images, setImages] = useState(fakeImages);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);

  const params = useParams();
  const {id} = params;

  useEffect(() => {
    async function setData() {
      setIsLoading(true);
      try {
        const {data: albumName} = await axios.get(
          `http://localhost:3000/api/albums/${id}`,
        );
        console.log(albumName);

        const url = `http://localhost:3000/api/photos/album/${albumName}`;
        const {data} = await axios.get(url);
        setImages(data.photos);
      } catch (error) {
        console.error(error.message);
      } finally {
        setIsLoading(false);
      }
    }
    setData();
  }, []);

  const openImage = (index) => {
    setSelectedIndex(index);
  };

  const closeImage = () => {
    setSelectedIndex(null);
  };

  const nextImage = () => {
    setSelectedIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const {sendToPrint} = usePrint();

  const handleDelete = async (photoId) => {
    try {
      await axios.delete(`http://localhost:3000/api/photos/${photoId}`);
      setImages((prev) => prev.filter((img) => img._id !== photoId));
    } catch (error) {
      console.error(error.message);
    }
  };

  const confirmDelete = async () => {
    if (!imageToDelete) return;
    await handleDelete(imageToDelete._id);
    setImageToDelete(null);
  };

  const cancelDelete = () => {
    setImageToDelete(null);
  };

  return (
    <section className="main-gallery-section">
      <h1>Album Name</h1>

      {isLoading && <h1>Loading...</h1>}

      <div className="gallery">
        {images.map((img, index) => (
          <div
            key={img._id || index}
            className="card"
            onClick={() => openImage(index)}
          >
            <img src={img.fileUrl} alt="gallery" />

            <button
              className="delete-btn"
              onClick={(e) => {
                e.stopPropagation(); 
                setImageToDelete(img); 
              }}
            >
              🗑️
            </button>
          </div>
        ))}

        {selectedIndex !== null && (
          <div className="modal">
            <span className="close" onClick={closeImage}>
              ×
            </span>

            <button className="nav left" onClick={prevImage}>
              ‹
            </button>

            <img
              className="modal-img"
              src={images[selectedIndex].fileUrl}
              alt="big"
            />

            <button className="nav right" onClick={nextImage}>
              ›
            </button>
          </div>
        )}

        {imageToDelete && (
          <div className="confirm-modal">
            <div className="confirm-box">
              <h3>האם אתה בטוח שברצונך למחוק?</h3>

              <img
                src={imageToDelete.fileUrl}
                alt="preview"
                className="preview-img"
              />

              <p>נשלח על ידי: {imageToDelete.sender}</p>
              <p>אלבום: {imageToDelete.albumName}</p>

              <div className="actions">
                <button className="cancel" onClick={cancelDelete}>
                  ביטול
                </button>
                <button className="confirm" onClick={confirmDelete}>
                  מחק
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <button
        className="print"
        onClick={() => {
          console.log(id);
          // sendToPrint(id);
        }}
      >
        שלח להדפסה
      </button>
    </section>
  );
}

export default index;
