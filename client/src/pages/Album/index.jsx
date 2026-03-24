import {useParams} from "react-router";
import "./style.css";

import React, {useState, useEffect} from "react";
import axios from "axios";
import {usePrint} from "../../hooke/usePrint";

// import "./gallery.css";

const fakeImages = [
  "https://picsum.photos/id/1015/600/400",
  "https://picsum.photos/id/1016/600/400",
  "https://picsum.photos/id/1018/600/400",
  "https://picsum.photos/id/1020/600/400",
  "https://picsum.photos/id/1024/600/400",
];

function index() {
  const [images, setImages] = useState(fakeImages);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const params = useParams();
  const {id} = params;
  // 🔌 כשתרצה API פשוט תפעיל את זה
  /*
  useEffect(() => {
    axios.get("/api/images").then((res) => {
      setImages(res.data);
    });
  }, []);
  */
  useEffect(() => {
    async function setData() {
      setIsLoading(true);
      try {
        // -- Add real url with id --
        const url = "";
        const [data] = await axios.get(url);
        setAlbums(data);
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
  // -- TO-DO -- add loading
  const {sendToPrint} = usePrint();
  return (
    <section className="main-gallery-section">
      <h1>Album Name</h1>
      {isLoading && <h1>Loading...</h1>}
      <div className="gallery">
        {images.map((img, index) => (
          <div key={index} className="card" onClick={() => openImage(index)}>
            <img src={img} alt="gallery" />
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

            <img className="modal-img" src={images[selectedIndex]} alt="big" />

            <button className="nav right" onClick={nextImage}>
              ›
            </button>
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
