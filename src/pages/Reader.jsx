import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Settings, MessageSquare, Heart, Home, Loader2, BarChart3 } from 'lucide-react';
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
        // 1. Fetch manga info for navigation
        const mangaRes = await fetch(`/api/manga/${id}`);
        const mangaData = await mangaRes.json();
        if (mangaRes.ok) setManga(mangaData);

        // 2. Fetch current chapter content
        const chapterRes = await fetch(`/api/manga/chapters/${chapterId}`);
        const chapterData = await chapterRes.json();
        if (chapterRes.ok) setChapter(chapterData);
        else throw new Error(chapterData.message || 'Lỗi tải nội dung');
        
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
      timeout = setTimeout(() => setShowNav(false), 4000);
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

  return (
    <div className="reader-page">
      {/* THANH ĐIỀU HƯỚNG - LUÔN HIỆN HOẶC HIỆN KHI DI CHUỘT */}
      <AnimatePresence>
        {showNav && (
          <motion.nav 
            initial={{ y: -70 }} 
            animate={{ y: 0 }} 
            exit={{ y: -70 }} 
            className="reader-nav-top"
          >
            <div className="nav-left">
              <button onClick={() => navigate(`/manga/${id}`)} className="back-btn">
                <ChevronLeft size={24} /> <span className="desktop-only">Trở về</span>
              </button>
              {chapter && (
                <div className="chapter-info-badge">
                  Chương {chapter.number}
                </div>
              )}
            </div>

            <div className="nav-center">
              <button onClick={() => goToChapter(prevChapter?._id)} disabled={!prevChapter} className="nav-ch-btn">
                <ChevronLeft size={20} />
              </button>
              <select 
                value={chapterId} 
                onChange={(e) => goToChapter(e.target.value)}
                className="ch-select"
              >
                {manga?.chapters?.map(ch => (
                  <option key={ch._id} value={ch._id}>Chương {ch.number}</option>
                ))}
              </select>
              <button onClick={() => goToChapter(nextChapter?._id)} disabled={!nextChapter} className="nav-ch-btn">
                <ChevronRight size={20} />
              </button>
            </div>

            <div className="nav-right">
              <button className="icon-btn" onClick={() => navigate('/')}><Home size={20} /></button>
              <button className="icon-btn desktop-only"><Settings size={20} /></button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* NỘI DUNG CHÍNH */}
      <div className="reader-main-content">
        {loading ? (
          <div className="skeleton-container container">
            <div className="skeleton-line"></div>
            <div className="skeleton-box"></div>
            <div className="skeleton-box"></div>
            <div className="skeleton-box"></div>
          </div>
        ) : error ? (
          <div className="reader-error">
            <div className="error-icon">⚠️</div>
            <h2>Không thể tải chương</h2>
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className="btn-retry">Thử lại</button>
          </div>
        ) : (
          <div className="content-display">
            {chapter?.type === 'Novel' ? (
              <div className="novel-reader container">
                <h1 className="novel-title">Chương {chapter.number}: {chapter.title}</h1>
                <div className="novel-body">
                  {chapter.content?.split('\n').map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>
            ) : (
              <div className="manga-reader">
                {chapter?.images?.map((img, i) => (
                  <img key={i} src={img} alt={`Trang ${i+1}`} loading="lazy" className="manga-page-img" />
                ))}
              </div>
            )}

            {/* ĐIỀU HƯỚNG CUỐI TRANG */}
            <div className="reader-footer-nav container">
              <div className="nav-btns-large">
                <button 
                  className="big-btn prev" 
                  onClick={() => goToChapter(prevChapter?._id)}
                  disabled={!prevChapter}
                >
                  <ChevronLeft size={24} /> Chương trước
                </button>
                <button 
                  className="big-btn next" 
                  onClick={() => goToChapter(nextChapter?._id)}
                  disabled={!nextChapter}
                >
                  {nextChapter ? 'Chương kế tiếp' : 'Hết bộ truyện'} <ChevronRight size={24} />
                </button>
              </div>
              
              <div className="footer-actions">
                <button className="action-item"><Heart size={24} /> <span>Yêu thích</span></button>
                <button className="action-item"><MessageSquare size={24} /> <span>Bình luận</span></button>
                <button className="action-item"><BarChart3 size={24} /> <span>Xếp hạng</span></button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx="true">{`
        .reader-page { background: #0a0a0a; min-height: 100vh; color: white; }
        
        .reader-nav-top { 
          position: fixed; top: 0; left: 0; right: 0; height: 70px; 
          background: rgba(15, 15, 15, 0.9); backdrop-filter: blur(15px);
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 2rem; z-index: 1000; border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        .nav-left, .nav-center, .nav-right { display: flex; align-items: center; gap: 1rem; }
        .back-btn { display: flex; align-items: center; gap: 0.5rem; color: #ccc; font-weight: 700; }
        .chapter-info-badge { background: var(--primary); color: white; padding: 4px 12px; border-radius: 20px; font-size: 0.85rem; font-weight: 700; }
        
        .ch-select { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: white; padding: 6px 12px; border-radius: 8px; outline: none; }
        .nav-ch-btn { color: #94a3b8; padding: 6px; }
        .nav-ch-btn:disabled { opacity: 0.2; }
        .icon-btn { color: #94a3b8; padding: 8px; }

        .reader-main-content { padding-top: 70px; }
        
        /* SKELETON LOADING */
        .skeleton-container { padding: 4rem 1rem; display: flex; flex-direction: column; gap: 2rem; }
        .skeleton-line { width: 60%; height: 40px; background: rgba(255,255,255,0.05); border-radius: 8px; }
        .skeleton-box { width: 100%; height: 600px; background: rgba(255,255,255,0.03); border-radius: 12px; }

        .manga-reader { display: flex; flex-direction: column; align-items: center; }
        .manga-page-img { width: 100%; max-width: 900px; height: auto; display: block; }

        .novel-reader { max-width: 800px; padding: 4rem 1.5rem; background: #fdf6e3; color: #5c4b37; border-radius: 0 0 12px 12px; margin-bottom: 3rem; }
        .novel-title { font-size: 2.25rem; font-weight: 900; margin-bottom: 3rem; text-align: center; color: #2d2419; }
        .novel-body { font-size: 1.3rem; line-height: 2; font-family: 'Georgia', serif; }
        .novel-body p { margin-bottom: 1.5rem; text-align: justify; }

        .reader-footer-nav { padding: 4rem 1rem 8rem; display: flex; flex-direction: column; align-items: center; gap: 4rem; }
        .nav-btns-large { display: flex; gap: 2rem; width: 100%; max-width: 700px; }
        .big-btn { flex: 1; display: flex; align-items: center; justify-content: center; gap: 1rem; padding: 1.25rem; border-radius: 16px; font-weight: 800; font-size: 1.1rem; transition: all 0.3s; }
        .big-btn.prev { background: rgba(255,255,255,0.05); color: white; border: 1px solid rgba(255,255,255,0.1); }
        .big-btn.next { background: var(--primary); color: white; box-shadow: 0 10px 25px rgba(99, 102, 241, 0.4); }
        .big-btn:disabled { opacity: 0.2; pointer-events: none; }

        .footer-actions { display: flex; gap: 4rem; color: #64748b; }
        .action-item { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; font-weight: 700; font-size: 0.9rem; }
        .action-item:hover { color: var(--primary); }

        .reader-error { height: 60vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1.5rem; }
        .error-icon { font-size: 4rem; }
        .btn-retry { background: var(--primary); color: white; padding: 10px 25px; border-radius: 8px; font-weight: 700; }

        @media (max-width: 768px) {
          .reader-nav-top { padding: 0 1rem; }
          .desktop-only { display: none; }
          .nav-btns-large { flex-direction: column; gap: 1rem; }
          .footer-actions { gap: 2rem; }
          .novel-reader { padding: 2rem 1rem; border-radius: 0; }
        }
      `}</style>
    </div>
  );
};

export default Reader;
