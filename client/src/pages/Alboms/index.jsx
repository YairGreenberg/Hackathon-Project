import React, {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router";
import "./style.css";

const fakeAlbums = [
  {
    id: 1,
    title: "Nature",
    cover: "https://picsum.photos/id/1018/600/400",
  },
  {
    id: 2,
    title: "City",
    cover: "https://picsum.photos/id/1015/600/400",
  },
  {
    id: 3,
    title: "Animals",
    cover: "https://picsum.photos/id/1024/600/400",
  },
  {
    id: 4,
    title: "Travel",
    cover: "https://picsum.photos/id/1035/600/400",
  },
];

export default function index() {
  const [albums, setAlbums] = useState(fakeAlbums);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // 🔌 כשתרצה API

  useEffect(() => {
    async function setData() {
      setIsLoading(true);
      try {
        // -- Add real url --
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

  const handleClick = (id) => {
    navigate(`/album/${id}`);
  };

  return (
    <>
      <h1>Wellcom to album page</h1>
      {isLoading && <h1>Loading...</h1>}
      <div className="albums-container">
        {albums.map((album) => (
          <div
            key={album.id}
            className="album-card"
            onClick={() => handleClick(album.id)}
          >
            <img src={album.cover} alt={album.title} />
            <div className="overlay">
              <h2>{album.title}</h2>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
