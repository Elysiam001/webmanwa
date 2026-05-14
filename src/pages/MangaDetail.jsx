import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Play, Heart, Share2, List, Info, Clock, User, Tag, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const MangaDetail = () => {
  const { id } = useParams();
  const [manga, setManga] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMangaDetail = async () => {
      try {
        const res = await fetch(`/api/manga/${id}`);
        const data = await res.json();
        if (res.ok) {
          setManga(data);
        }
      } catch (err) {
        console.error('Lỗi tải chi tiết truyện:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMangaDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="loading-screen">
        <Loader2 className="animate-spin" size={48} />
        <p>Đang tải dữ liệu truyện...</p>
      </div>
    );
  }

  if (!manga) {
    return (
      <div className="error-screen">
        <h2>Không tìm thấy bộ truyện này</h2>
        <Link to="/" className="btn-primary">Quay về trang chủ</Link>
      </div>
    );
  }

  return (
    <div className="detail-page">
      <div className="detail-header">
        <div className="header-bg">
          <img src={manga.cover} alt="" />
          <div className="header-overlay"></div>
        </div>
        
        <div className="container header-content">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="detail-cover"
          >
            <img src={manga.cover} alt={manga.title} />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="detail-info"
          >
            <div className="type-badge">{manga.type}</div>
            <h1 className="manga-title">{manga.title}</h1>
            <p className="other-title">{manga.otherTitle}</p>
            
            <div className="stats-row">
              <div className="stat-item"><Star size={18} fill="#ffb800" color="#ffb800" /> <span>{manga.rating || 0}</span></div>
              <div className="stat-item"><Heart size={18} /> <span>{manga.followers || 0}</span></div>
              <div className="stat-item"><Clock size={18} /> <span>{manga.views || 0}</span></div>
            </div>

            <div className="genres-list">
              {manga.genres?.map(g => <span key={g} className="genre-tag">{g}</span>)}
            </div>

            <div className="action-btns">
              <Link 
                to={manga.chapters?.length > 0 ? `/read/${id}/${manga.chapters[manga.chapters.length - 1]._id}` : '#'} 
                className={`read-now-btn ${manga.chapters?.length === 0 ? 'disabled' : ''}`}
              >
                <Play size={20} fill="currentColor" /> Đọc ngay
              </Link>
              <button className="follow-btn glass">
                <Heart size={20} /> Theo dõi
              </button>
              <button className="share-btn glass">
                <Share2 size={20} />
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container detail-body">
        <div className="body-grid">
          <div className="main-col">
            <section className="info-section">
              <h3 className="section-title"><Info size={20} /> Giới thiệu</h3>
              <p className="description">{manga.description || 'Chưa có mô tả cho bộ truyện này.'}</p>
            </section>

            <section className="chapters-section">
              <div className="section-header">
                <h3 className="section-title"><List size={20} /> Danh sách chương</h3>
                <span className="chapter-count">{manga.chapters?.length || 0} chương</span>
              </div>
              
              <div className="chapters-list glass">
                {manga.chapters?.length > 0 ? (
                  manga.chapters.map(ch => (
                    <Link key={ch._id} to={`/read/${id}/${ch._id}`} className="chapter-item">
                      <span className="ch-title">Chương {ch.number}: {ch.title}</span>
                      <span className="ch-date">{new Date(ch.createdAt).toLocaleDateString('vi-VN')}</span>
                    </Link>
                  ))
                ) : (
                  <div className="no-chapters">Chưa có chương nào được đăng.</div>
                )}
              </div>
            </section>
          </div>

          <aside className="side-col">
            <div className="side-card glass">
              <h4>Thông tin chi tiết</h4>
              <div className="side-item">
                <User size={16} /> <span>Tác giả: <strong>{manga.author}</strong></span>
              </div>
              <div className="side-item">
                <Tag size={16} /> <span>Trạng thái: <strong className="status-highlight">{manga.status || 'Đang cập nhật'}</strong></span>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <style jsx="true">{`
        .detail-page { padding-top: 0; }
        .loading-screen, .error-screen { height: 80vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem; }
        .detail-header { position: relative; padding: 140px 0 60px; overflow: hidden; }
        .header-bg { position: absolute; inset: 0; z-index: -1; }
        .header-bg img { width: 100%; height: 100%; object-fit: cover; filter: blur(40px) brightness(0.3); transform: scale(1.1); }
        .header-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, transparent, #f8fafc); }
        .header-content { display: flex; gap: 3rem; align-items: flex-end; }
        .detail-cover { flex-shrink: 0; width: 280px; aspect-ratio: 2/3; border-radius: var(--radius-lg); overflow: hidden; box-shadow: var(--shadow-lg); border: 4px solid rgba(255, 255, 255, 0.1); }
        .detail-cover img { width: 100%; height: 100%; object-fit: cover; }
        .detail-info { flex: 1; }
        .type-badge { background: var(--primary); color: white; padding: 0.2rem 0.6rem; border-radius: var(--radius-sm); font-size: 0.75rem; font-weight: 700; display: inline-block; margin-bottom: 0.75rem; }
        .manga-title { font-size: 3rem; font-weight: 800; margin-bottom: 0.5rem; line-height: 1.2; }
        .other-title { color: var(--text-secondary); font-size: 1.1rem; margin-bottom: 1.5rem; }
        .stats-row { display: flex; gap: 2rem; margin-bottom: 1.5rem; }
        .stat-item { display: flex; align-items: center; gap: 0.5rem; font-weight: 600; }
        .genres-list { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 2rem; }
        .genre-tag { background: white; padding: 4px 12px; border-radius: 20px; font-size: 0.85rem; font-weight: 600; border: 1px solid var(--border); }
        .action-btns { display: flex; gap: 1rem; }
        .read-now-btn { background: var(--primary); color: white; padding: 0.8rem 2rem; border-radius: var(--radius-md); font-weight: 700; display: flex; align-items: center; gap: 0.75rem; box-shadow: 0 4px 20px rgba(99, 102, 241, 0.3); }
        .read-now-btn.disabled { opacity: 0.5; cursor: not-allowed; }
        .follow-btn, .share-btn { background: white; border: 1px solid var(--border); padding: 0.8rem 1.5rem; border-radius: var(--radius-md); display: flex; align-items: center; gap: 0.5rem; font-weight: 600; }
        .detail-body { margin-top: 3rem; padding-bottom: 5rem; }
        .body-grid { display: grid; grid-template-columns: 1fr 320px; gap: 3rem; }
        .description { color: var(--text-secondary); line-height: 1.8; font-size: 1.05rem; margin-top: 1rem; }
        .chapters-section { margin-top: 3rem; }
        .chapters-list { margin-top: 1.5rem; background: white; border-radius: var(--radius-lg); border: 1px solid var(--border); overflow: hidden; }
        .chapter-item { display: flex; justify-content: space-between; padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--border); transition: var(--transition); }
        .chapter-item:last-child { border-bottom: none; }
        .chapter-item:hover { background: var(--primary-light); color: var(--primary); }
        .ch-title { font-weight: 600; }
        .ch-date { color: var(--text-muted); font-size: 0.85rem; }
        .no-chapters { padding: 3rem; text-align: center; color: var(--text-muted); }
        .side-card { background: white; padding: 1.5rem; border-radius: var(--radius-lg); border: 1px solid var(--border); }
        .side-card h4 { margin-bottom: 1.25rem; font-size: 1.1rem; font-weight: 800; }
        .side-item { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem; font-size: 0.95rem; }
        .status-highlight { color: #22c55e; }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 1024px) {
          .body-grid { grid-template-columns: 1fr; }
          .header-content { flex-direction: column; align-items: center; text-align: center; }
          .detail-cover { width: 200px; }
          .manga-title { font-size: 2rem; }
          .stats-row { justify-content: center; }
          .action-btns { justify-content: center; }
        }
      `}</style>
    </div>
  );
};

export default MangaDetail;
