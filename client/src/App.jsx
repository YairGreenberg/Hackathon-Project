import {useState} from "react";
import Routers from "./Routers";
import Header from "./components/Header/index";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Header />
      <Routers />
    </>
  );
}

export default App;
// =======
// import { useEffect } from 'react';
// import useStore from './store/useStore';

// import MongoDebugger from './components/MongoDebugger';

// function App() {
//   const { 
//     albums, 
//     fetchAlbums, 
//     fetchPhotos, 
//     selectedAlbum, 
//     setSelectedAlbum, 
//     getFilteredPhotos 
//   } = useStore();

//   useEffect(() => {
//     fetchAlbums();
//     fetchPhotos();
//   }, [fetchAlbums, fetchPhotos]);

//   const filteredPhotos = getFilteredPhotos();

//   return (
//     <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', direction: 'rtl' }}>
//       <h1>📸 ניהול אלבומים</h1>

//       <section>
//         <h2>📁 בחר אלבום:</h2>
//         <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', flexWrap: 'wrap' }}>
//           {/* כפתור להצגת הכל */}
//           <button 
//             onClick={() => setSelectedAlbum(null)}
//             style={{
//               padding: '10px 15px',
//               borderRadius: '20px',
//               cursor: 'pointer',
//               backgroundColor: selectedAlbum === null ? '#007bff' : '#f0f7ff',
//               color: selectedAlbum === null ? 'white' : 'black',
//               border: '1px solid #007bff'
//             }}
//           >
//             הכל
//           </button>

//           {/* כפתורים לכל אלבום */}
//           {albums.map((album) => (
//             <button 
//               key={album._id} 
//               onClick={() => setSelectedAlbum(album.name)}
//               style={{ 
//                 padding: '10px 15px', 
//                 borderRadius: '20px', 
//                 cursor: 'pointer',
//                 backgroundColor: selectedAlbum === album.name ? '#007bff' : '#f0f7ff',
//                 color: selectedAlbum === album.name ? 'white' : 'black',
//                 border: '1px solid #007bff'
//               }}
//             >
//               {album.name}
//             </button>
//           ))}
//         </div>
//       </section>

//       <section>
//         <h2>🖼️ תמונות {selectedAlbum ? `באלבום ${selectedAlbum}` : '(הכל)'}</h2>
//         <div style={{ 
//           display: 'grid', 
//           gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
//           gap: '15px' 
//         }}>
//           {filteredPhotos.length > 0 ? (
//             filteredPhotos.map((photo) => (
//               <div key={photo._id} style={{ 
//                 border: '1px solid #ddd', 
//                 borderRadius: '10px', 
//                 overflow: 'hidden',
//                 boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
//               }}>
//                 <img 
//                   src={photo.fileUrl} 
//                   alt={photo.caption} 
//                   style={{ width: '100%', height: '150px', objectFit: 'cover' }} 
//                 />
//                 <div style={{ padding: '10px' }}>
//                   <p style={{ margin: '0', fontSize: '14px' }}>{photo.caption || 'ללא כיתוב'}</p>
//                   <small style={{ color: '#888' }}>מאת: {photo.sender}</small>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <p>אין תמונות להצגה באלבום זה.</p>
//           )}
//         </div>
//       </section>
//       <MongoDebugger />
//     </div>
//   );
// }

// export default App;
