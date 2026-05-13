import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, List, Settings, MessageSquare, Heart, Home, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Reader = () => {
  const { id, chapterId } = useParams();
  const navigate = useNavigate();
  const [showNav, setShowNav] = useState(true);
  const [zoom, setZoom] = useState(100);

  // Mock images for the chapter
  const pages = [
    "https://images.unsplash.com/photo-1614728263952-84ea256f9679?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1578632292335-df3abbb0d586?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1541562232579-512a21360020?auto=format&fit=crop&q=80&w=800",
  ];

  useEffect(() => {
    let timeout;
    const handleMouseMove = () => {
      setShowNav(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setShowNav(false), 3000);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="reader-page">
      {/* Top Navigation */}
      <AnimatePresence>
        {showNav && (
          <motion.div 
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            className="reader-nav-top glass"
          >
            <div className="nav-left">
              <Link to={`/manga/${id}`} className="back-btn"><ChevronLeft /> Quay lại</Link>
              <div className="reader-info">
                <span className="manga-name">Solo Leveling</span>
                <span className="divider">/</span>
                <span className="chapter-name">Chapter {chapterId}</span>
              </div>
            </div>
            
            <div className="nav-center">
              <button className="nav-ch-btn"><ChevronLeft size={20} /></button>
              <select className="ch-select glass">
                <option>Chapter {chapterId}</option>
                <option>Chapter {parseInt(chapterId) - 1}</option>
              </select>
              <button className="nav-ch-btn"><ChevronRight size={20} /></button>
            </div>

            <div className="nav-right">
              <button className="icon-btn"><Settings size={20} /></button>
              <button className="icon-btn"><Maximize2 size={20} /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content (Images) */}
      <div className="reader-content" style={{ width: `${zoom}%` }}>
        {pages.map((img, index) => (
          <div key={index} className="reader-page-img">
            <img src={img} alt={`Page ${index + 1}`} loading="lazy" />
          </div>
        ))}
      </div>

      {/* Bottom Actions */}
      <div className="reader-nav-bottom container">
        <div className="ch-navigation">
          <button className="big-nav-btn prev glass">Chương trước</button>
          <button className="big-nav-btn next">Chương kế tiếp</button>
        </div>
        
        <div className="reader-footer-actions">
          <button className="action-item"><Heart size={24} /> Theo dõi</button>
          <button className="action-item"><MessageSquare size={24} /> Bình luận (1.2K)</button>
          <button className="action-item" onClick={() => navigate('/')}><Home size={24} /> Trang chủ</button>
        </div>
      </div>

      <style jsx="true">{`
        .reader-page {
          background: #000;
          min-height: 100vh;
          padding-top: 80px;
        }

        .reader-nav-top {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2rem;
          z-index: 100;
          border-top: none;
        }

        .nav-left {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .back-btn {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-weight: 500;
          color: var(--text-secondary);
        }

        .reader-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-weight: 600;
        }

        .divider { color: var(--text-muted); }
        .chapter-name { color: var(--primary); }

        .nav-center {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .ch-select {
          padding: 0.5rem 1rem;
          border-radius: var(--radius-md);
          color: white;
          outline: none;
          min-width: 150px;
        }

        .nav-ch-btn {
          background: var(--bg-surface-elevated);
          padding: 0.5rem;
          border-radius: var(--radius-sm);
          color: white;
        }

        .nav-right {
          display: flex;
          gap: 1rem;
        }

        .reader-content {
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: width 0.3s ease;
        }

        .reader-page-img {
          width: 100%;
          max-width: 900px;
        }

        .reader-page-img img {
          width: 100%;
          height: auto;
          display: block;
        }

        .reader-nav-bottom {
          padding: 4rem 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3rem;
        }

        .ch-navigation {
          display: flex;
          gap: 2rem;
          width: 100%;
          max-width: 600px;
        }

        .big-nav-btn {
          flex: 1;
          padding: 1.25rem;
          border-radius: var(--radius-lg);
          font-weight: 700;
          font-size: 1.1rem;
        }

        .big-nav-btn.next {
          background: var(--primary);
          color: white;
        }

        .reader-footer-actions {
          display: flex;
          gap: 3rem;
          color: var(--text-secondary);
        }

        .action-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .action-item:hover {
          color: var(--primary);
        }

        @media (max-width: 768px) {
          .reader-nav-top { padding: 0 1rem; }
          .manga-name { display: none; }
          .divider { display: none; }
          .ch-navigation { flex-direction: column; gap: 1rem; }
          .reader-footer-actions { gap: 1.5rem; }
        }
      `}</style>
    </div>
  );
};

export default Reader;
