import React from "react";
import {Route, Routes} from "react-router";
import Albums from './pages/Alboms/index'
import Album from './pages/Album/index'
function Routers() {
  return (
    <Routes>
      {/* <Route path="/album/all" element={<Album />} /> */}
      <Route path="/albums" element={<Albums />} />
      <Route path="/album/:id" element={<Album />} />
    </Routes>
  );
}

export default Routers;
