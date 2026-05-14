import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Play, Heart, Share2, List, Info, Clock, User, Tag, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const MangaDetail = () => {
  const { id } = useParams();
  const [manga, setManga] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMangaDetail = async () => {
      try {
        const res = await fetch(`/api/manga/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Không thể tải chi tiết truyện');
        setManga(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMangaDetail();
  }, [id]);

  if (error) return (
    <div className="error-container">
      <div className="error-icon">⚠️</div>
      <h2>Có lỗi xảy ra</h2>
      <p>{error || 'Không tìm thấy truyện'}</p>
      <Link to="/" className="btn-primary">Quay lại trang chủ</Link>
    </div>
  );

  return (
    <div className="detail-page">
      {/* HEADER SECTION - SKELETON OR REAL DATA */}
      <div className="detail-header">
        <div className="header-bg">
          <img src={manga?.cover} alt="" />
          <div className="header-overlay"></div>
        </div>
        
        <div className="container header-content">
          <div className={`detail-cover ${loading ? 'skeleton-anim' : ''}`}>
            {!loading && <img src={manga.cover} alt={manga.title} />}
          </div>

          <div className="detail-info">
            {loading ? (
              <div className="skeleton-info-stack">
                <div className="sk-badge"></div>
                <div className="sk-title"></div>
                <div className="sk-text"></div>
                <div className="sk-btns"></div>
              </div>
            ) : (
              <>
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
                    className={`read-now-btn ${!manga.chapters?.length ? 'disabled' : ''}`}
                  >
                    <Play size={20} fill="currentColor" /> Đọc ngay
                  </Link>
                  <button className="follow-btn glass-card">
                    <Heart size={20} /> Theo dõi
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="container detail-body">
        <div className="body-grid">
          <div className="main-col">
            <section className="info-section glass-card">
              <h3 className="section-title"><Info size={20} /> Giới thiệu</h3>
              {loading ? (
                <div className="sk-desc"></div>
              ) : (
                <p className="description">{manga.description || 'Chưa có mô tả cho bộ truyện này.'}</p>
              )}
            </section>

            <section className="chapters-section">
              <div className="section-header">
                <h3 className="section-title"><List size={20} /> Danh sách chương</h3>
                {!loading && <span className="chapter-count">{manga.chapters?.length || 0} chương</span>}
              </div>
              
              <div className="chapters-list glass-card">
                {loading ? (
                  <div className="sk-chapters">
                    {[1,2,3,4,5].map(i => <div key={i} className="sk-ch-item"></div>)}
                  </div>
                ) : manga.chapters?.length > 0 ? (
                  manga.chapters.map(ch => (
                    <Link key={ch._id} to={`/read/${id}/${ch._id}`} className="chapter-item">
                      <div className="ch-info">
                        <span className="ch-num">Chương {ch.number}</span>
                        <span className="ch-title">{ch.title}</span>
                      </div>
                      <span className="ch-date">{new Date(ch.createdAt).toLocaleDateString('vi-VN')}</span>
                    </Link>
                  ))
                ) : (
                  <div className="empty-chapters">Chưa có chương nào được đăng.</div>
                )}
              </div>
            </section>
          </div>

          <aside className="side-col">
            <div className="side-card glass-card">
              <h4>Thông tin chi tiết</h4>
              {loading ? (
                <div className="sk-side"></div>
              ) : (
                <>
                  <div className="side-item">
                    <User size={16} /> <span>Tác giả: <strong>{manga.author || 'Đang cập nhật'}</strong></span>
                  </div>
                  <div className="side-item">
                    <Tag size={16} /> <span>Trạng thái: <strong className="status-highlight">{manga.status || 'Đang tiến hành'}</strong></span>
                  </div>
                </>
              )}
            </div>
          </aside>
        </div>
      </div>

      <style jsx="true">{`
        .detail-page { padding-top: 0; min-height: 100vh; background: #f8fafc; }
        .detail-header { position: relative; padding: 140px 0 60px; overflow: hidden; }
        .header-bg { position: absolute; inset: 0; z-index: -1; }
        .header-bg img { width: 100%; height: 100%; object-fit: cover; filter: blur(40px) brightness(0.4); transform: scale(1.1); }
        .header-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, transparent, #f8fafc); }
        .header-content { display: flex; gap: 3rem; align-items: flex-end; }
        .detail-cover { flex-shrink: 0; width: 280px; aspect-ratio: 2/3; border-radius: 12px; overflow: hidden; box-shadow: var(--shadow-xl); border: 4px solid rgba(255, 255, 255, 0.1); background: rgba(0,0,0,0.1); }
        .detail-cover img { width: 100%; height: 100%; object-fit: cover; }
        .detail-info { flex: 1; color: var(--text-primary); }
        
        .type-badge { background: var(--primary); color: white; padding: 0.3rem 0.8rem; border-radius: 6px; font-size: 0.8rem; font-weight: 700; display: inline-block; margin-bottom: 1rem; }
        .manga-title { font-size: 3.5rem; font-weight: 800; margin-bottom: 0.5rem; line-height: 1.1; color: #1e293b; }
        .other-title { color: #64748b; font-size: 1.25rem; margin-bottom: 2rem; font-weight: 500; }
        .stats-row { display: flex; gap: 2.5rem; margin-bottom: 2rem; }
        .stat-item { display: flex; align-items: center; gap: 0.6rem; font-weight: 700; font-size: 1.1rem; }
        .genre-tag { background: white; color: var(--primary); padding: 0.5rem 1.25rem; border-radius: 20px; font-size: 0.9rem; font-weight: 700; box-shadow: var(--shadow-sm); border: 1px solid var(--border); margin-right: 0.75rem; }
        
        .action-btns { display: flex; gap: 1.5rem; margin-top: 2.5rem; }
        .read-now-btn { background: var(--primary); color: white; padding: 1rem 2.5rem; border-radius: 12px; font-weight: 800; display: flex; align-items: center; gap: 0.75rem; box-shadow: 0 10px 25px rgba(99, 102, 241, 0.3); }
        .read-now-btn.disabled { opacity: 0.5; pointer-events: none; }
        .follow-btn { padding: 1rem 2rem; border-radius: 12px; display: flex; align-items: center; gap: 0.75rem; font-weight: 700; background: rgba(255,255,255,0.8); }

        .detail-body { margin-top: 3.5rem; padding-bottom: 6rem; }
        .body-grid { display: grid; grid-template-columns: 1fr 320px; gap: 3rem; }
        .info-section { padding: 2rem; }
        .section-title { display: flex; align-items: center; gap: 0.75rem; font-size: 1.5rem; font-weight: 800; margin-bottom: 1.5rem; }
        .description { color: #475569; line-height: 1.8; font-size: 1.1rem; }
        
        .chapters-section { margin-top: 3rem; }
        .chapter-item { display: flex; justify-content: space-between; align-items: center; padding: 1.25rem 2rem; border-bottom: 1px solid var(--border); transition: 0.3s; }
        .chapter-item:hover { background: var(--primary-light); transform: translateX(10px); color: var(--primary); }
        .ch-num { font-weight: 800; }
        
        /* SKELETON ANIMATION */
        .skeleton-anim { background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%); background-size: 200% 100%; animation: skeleton-loading 1.5s infinite; }
        @keyframes skeleton-loading { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

        .sk-badge { width: 80px; height: 24px; border-radius: 6px; margin-bottom: 1rem; }
        .sk-title { width: 60%; height: 60px; border-radius: 8px; margin-bottom: 1rem; }
        .sk-text { width: 40%; height: 24px; border-radius: 6px; margin-bottom: 2rem; }
        .sk-btns { width: 300px; height: 50px; border-radius: 12px; }
        .sk-desc { width: 100%; height: 100px; border-radius: 8px; }
        .sk-ch-item { height: 60px; border-bottom: 1px solid #f1f5f9; }
        
        .sk-badge, .sk-title, .sk-text, .sk-btns, .sk-desc, .sk-ch-item, .sk-side { 
           background: rgba(0,0,0,0.05);
           position: relative;
           overflow: hidden;
        }
        .sk-badge::after, .sk-title::after, .sk-text::after, .sk-btns::after, .sk-desc::after, .sk-ch-item::after {
           content: ""; position: absolute; inset: 0;
           background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
           animation: skeleton-loading 1.5s infinite;
        }

        .error-container { min-height: 80vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1.5rem; text-align: center; }
        .error-icon { font-size: 4rem; }

        @media (max-width: 1024px) {
          .body-grid { grid-template-columns: 1fr; }
          .header-content { flex-direction: column; align-items: center; text-align: center; }
          .detail-cover { width: 200px; }
          .manga-title { font-size: 2.25rem; }
          .stats-row { justify-content: center; }
          .action-btns { justify-content: center; }
        }
      `}</style>
    </div>
  );
};

export default MangaDetail;
