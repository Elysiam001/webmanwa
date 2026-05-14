import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, List, Settings, MessageSquare, Heart, Home, Maximize2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Reader = () => {
  const { id, chapterId } = useParams();
  const navigate = useNavigate();
  const [showNav, setShowNav] = useState(true);
  const [manga, setManga] = useState(null);
  const [chapter, setChapter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReaderData = async () => {
      setLoading(true);
      try {
        // Fetch manga info for navigation
        const mangaRes = await fetch(`/api/manga/${id}`);
        const mangaData = await mangaRes.json();
        if (mangaRes.ok) setManga(mangaData);

        // Fetch current chapter content
        const chapterRes = await fetch(`/api/manga/chapters/${chapterId}`);
        const chapterData = await chapterRes.json();
        if (chapterRes.ok) setChapter(chapterData);
        else throw new Error(chapterData.message || 'Lỗi tải chương');
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchReaderData();
    window.scrollTo(0, 0);
  }, [id, chapterId]);

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

  const goToChapter = (cid) => {
    if (cid) navigate(`/read/${id}/${cid}`);
  };

  const currentIndex = manga?.chapters?.findIndex(ch => ch._id === chapterId);
  const prevChapter = currentIndex < manga?.chapters?.length - 1 ? manga.chapters[currentIndex + 1] : null;
  const nextChapter = currentIndex > 0 ? manga.chapters[currentIndex - 1] : null;

  if (loading) return (
    <div className="reader-loading">
      <Loader2 className="animate-spin" size={40} />
      <p>Đang tải nội dung...</p>
    </div>
  );

  if (error || !chapter) return (
    <div className="reader-error">
      <h2>Lỗi tải chương</h2>
      <p>{error}</p>
      <Link to={`/manga/${id}`} className="btn-primary">Quay lại chi tiết</Link>
    </div>
  );

  return (
    <div className="reader-page">
      <AnimatePresence>
        {showNav && (
          <motion.div initial={{ y: -100 }} animate={{ y: 0 }} exit={{ y: -100 }} className="reader-nav-top glass">
            <div className="nav-left">
              <Link to={`/manga/${id}`} className="back-btn"><ChevronLeft /> {manga?.title || 'Quay lại'}</Link>
              <div className="reader-info desktop-only">
                <span className="chapter-name">Chương {chapter.number}</span>
              </div>
            </div>
            
            <div className="nav-center">
              <button 
                onClick={() => goToChapter(prevChapter?._id)} 
                disabled={!prevChapter} 
                className="nav-ch-btn"
              ><ChevronLeft size={20} /></button>
              
              <select 
                className="ch-select glass" 
                value={chapterId}
                onChange={(e) => goToChapter(e.target.value)}
              >
                {manga?.chapters?.map(ch => (
                  <option key={ch._id} value={ch._id}>Chương {ch.number}: {ch.title || ''}</option>
                ))}
              </select>
              
              <button 
                onClick={() => goToChapter(nextChapter?._id)} 
                disabled={!nextChapter} 
                className="nav-ch-btn"
              ><ChevronRight size={20} /></button>
            </div>

            <div className="nav-right desktop-only">
              <button className="icon-btn"><Settings size={20} /></button>
              <button className="icon-btn" onClick={() => navigate('/')}><Home size={20} /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="reader-container">
        {manga?.type === 'Novel' ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="novel-reader-content glass-card">
            <h2 className="novel-ch-title">Chương {chapter.number}: {chapter.title}</h2>
            <div className="novel-text">
              {chapter.content?.split('\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </motion.div>
        ) : (
          <div className="manga-reader-content">
            {chapter.images?.map((img, index) => (
              <div key={index} className="reader-page-img">
                <img src={img} alt={`Trang ${index + 1}`} loading="lazy" />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="reader-nav-bottom container">
        <div className="ch-navigation">
          <button 
            className="big-nav-btn prev glass" 
            onClick={() => goToChapter(prevChapter?._id)} 
            disabled={!prevChapter}
          >Chương trước</button>
          
          <button 
            className="big-nav-btn next" 
            onClick={() => goToChapter(nextChapter?._id)} 
            disabled={!nextChapter}
          >{nextChapter ? 'Chương kế tiếp' : 'Hết chương'}</button>
        </div>
        
        <div className="reader-footer-actions">
          <button className="action-item"><Heart size={24} /> Theo dõi</button>
          <button className="action-item"><MessageSquare size={24} /> Bình luận</button>
          <button className="action-item" onClick={() => navigate('/')}><Home size={24} /> Trang chủ</button>
        </div>
      </div>

      <style jsx="true">{`
        .reader-page { background: #0a0a0a; min-height: 100vh; padding-top: 80px; }
        .reader-loading, .reader-error { 
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex; 
          flex-direction: column; 
          align-items: center; 
          justify-content: center; 
          background: #0a0a0a;
          color: white; 
          gap: 1.5rem;
          z-index: 2000;
        }
        .reader-loading p {
          font-size: 1.1rem;
          font-weight: 600;
          letter-spacing: 1px;
          color: #94a3b8;
        }
        .reader-nav-top { position: fixed; top: 0; left: 0; right: 0; height: 70px; display: flex; align-items: center; justify-content: space-between; padding: 0 2rem; z-index: 1000; background: rgba(20, 20, 20, 0.8); backdrop-filter: blur(10px); color: white; border-bottom: 1px solid rgba(255,255,255,0.1); }
        .nav-left, .nav-center, .nav-right { display: flex; align-items: center; gap: 1rem; }
        .back-btn { display: flex; align-items: center; gap: 0.5rem; color: #ccc; font-weight: 600; }
        .chapter-name { color: var(--primary); font-weight: 700; }
        .ch-select { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); padding: 0.5rem 1rem; border-radius: 8px; color: white; outline: none; min-width: 180px; }
        .nav-ch-btn { background: rgba(255,255,255,0.1); padding: 0.5rem; border-radius: 8px; color: white; }
        .nav-ch-btn:disabled { opacity: 0.3; }
        
        .reader-container { width: 100%; max-width: 900px; margin: 0 auto; padding: 2rem 1rem; }
        .manga-reader-content { display: flex; flex-direction: column; align-items: center; }
        .reader-page-img { width: 100%; margin-bottom: 0; }
        .reader-page-img img { width: 100%; height: auto; display: block; }
        
        .novel-reader-content { background: #fdf6e3; color: #5c4b37; padding: 4rem; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        .novel-ch-title { font-size: 2rem; font-weight: 800; margin-bottom: 3rem; text-align: center; border-bottom: 1px solid rgba(0,0,0,0.1); padding-bottom: 1.5rem; }
        .novel-text { font-size: 1.25rem; line-height: 2; font-family: 'Merriweather', serif; }
        .novel-text p { margin-bottom: 1.5rem; }

        .reader-nav-bottom { padding: 5rem 0; display: flex; flex-direction: column; align-items: center; gap: 4rem; }
        .ch-navigation { display: flex; gap: 2rem; width: 100%; max-width: 600px; }
        .big-nav-btn { flex: 1; padding: 1.25rem; border-radius: 15px; font-weight: 800; font-size: 1.2rem; transition: var(--transition); }
        .big-nav-btn.prev { background: rgba(255,255,255,0.1); color: white; border: 1px solid rgba(255,255,255,0.2); }
        .big-nav-btn.next { background: var(--primary); color: white; box-shadow: 0 10px 20px rgba(99, 102, 241, 0.3); }
        .big-nav-btn:disabled { opacity: 0.3; pointer-events: none; }
        .reader-footer-actions { display: flex; gap: 4rem; color: #94a3b8; }
        .action-item { display: flex; flex-direction: column; align-items: center; gap: 0.75rem; font-weight: 600; }
        .action-item:hover { color: var(--primary); }

        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        @media (max-width: 768px) {
          .reader-nav-top { padding: 0 1rem; }
          .desktop-only { display: none; }
          .ch-select { min-width: 120px; font-size: 0.8rem; }
          .novel-reader-content { padding: 2rem 1.5rem; }
          .ch-navigation { flex-direction: column; gap: 1rem; }
          .reader-footer-actions { gap: 2rem; }
        }
      `}</style>
    </div>
  );
};

export default Reader;
