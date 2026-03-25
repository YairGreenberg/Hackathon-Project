import React from "react";
import {Route, Routes} from "react-router";
import Albums from './pages/Alboms/index'
import Album from './pages/Album/index'
import AllImages from './pages/AllImages/index'
function Routers() {
  return (
    <Routes>
      <Route path="/album/allImages" element={<AllImages />} />
      <Route path="/" element={<Albums />} />
      <Route path="/album/:id" element={<Album />} />
    </Routes>
  );
}

export default Routers;
