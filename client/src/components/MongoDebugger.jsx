import { useState, useRef } from 'react';
import useStore from '../store/useStore';

const MongoDebugger = () => {
  const { albums, photos, fetchAlbums, fetchPhotos, deletePhoto } = useStore();
  const [isVisible, setIsVisible] = useState(false);
  
  // State לתצוגה המקדימה
  const [hoveredImage, setHoveredImage] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  // Ref לשמירת הטיימר כדי שנוכל לבטל אותו
  const timerRef = useRef(null);

  const refreshAll = () => {
    fetchAlbums();
    fetchPhotos();
  };

  const handleMouseEnter = (e, url) => {
    const { clientX, clientY } = e;
    
    // ניקוי טיימר קודם אם קיים
    if (timerRef.current) clearTimeout(timerRef.current);

    // הגדרת טיימר לשנייה אחת (1000ms)
    timerRef.current = setTimeout(() => {
      setHoveredImage(url);
      setMousePos({ x: clientX, y: clientY });
    }, 1000);
  };

  const handleMouseLeave = () => {
    // אם העכבר יצא לפני שעברה שנייה, מבטלים את הטיימר ולא מציגים
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setHoveredImage(null);
  };

  if (!isVisible) {
    return (
      <button 
        onClick={() => setIsVisible(true)}
        style={{ position: 'fixed', bottom: '10px', right: '10px', zIndex: 9998 }}
      >
        🛠️ Open Debugger
      </button>
    );
  }

  return (
    <>
      {/* בועת התצוגה המקדימה */}
      {hoveredImage && (
        <div style={{
          position: 'fixed',
          top: mousePos.y - 170,
          left: mousePos.x - 210,
          width: '200px',
          height: '150px',
          border: '3px solid #0f0',
          borderRadius: '8px',
          overflow: 'hidden',
          zIndex: 10000,
          backgroundColor: '#000',
          boxShadow: '0 0 20px rgba(0,255,0,0.6)',
          pointerEvents: 'none'
        }}>
          <img src={hoveredImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="preview" />
        </div>
      )}

      <div style={{
        position: 'fixed', bottom: 0, right: 0, width: '450px', height: '500px',
        backgroundColor: '#222', color: '#0f0', padding: '15px', overflowY: 'auto',
        borderTopLeftRadius: '10px', boxShadow: '-2px 0 10px rgba(0,0,0,0.5)',
        zIndex: 9999, fontFamily: 'monospace', fontSize: '12px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <strong style={{ color: '#fff' }}>DATABASE INSPECTOR</strong>
          <div>
            <button onClick={refreshAll} style={{ marginRight: '5px' }}>🔄</button>
            <button onClick={() => setIsVisible(false)}>✖</button>
          </div>
        </div>

        <section>
          <h4 style={{ color: '#fff', borderBottom: '1px solid #444' }}>📸 Photos ({photos.length})</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '10px' }}>
            {photos.map((photo) => (
              <div 
                key={photo._id} 
                onMouseEnter={(e) => handleMouseEnter(e, photo.fileUrl)}
                onMouseLeave={handleMouseLeave}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  backgroundColor: '#333', padding: '8px', borderRadius: '4px',
                  transition: 'background 0.2s'
                }}
              >
                <div style={{ maxWidth: '70%', overflow: 'hidden' }}>
                  <span style={{ color: '#adadad' }}>{photo._id}</span>
                  <div style={{ color: '#888', fontSize: '10px' }}>{photo.caption || 'no-caption'}</div>
                </div>
                
                <button 
                  onClick={() => deletePhoto(photo._id)}
                  style={{ backgroundColor: '#cc0000', color: 'white', border: 'none', padding: '5px', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Del
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
};

export default MongoDebugger;