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
        .detail-page { background: #0f172a; min-height: 100vh; padding-top: 0; color: #f1f5f9; }
        
        .detail-header { position: relative; padding: 160px 0 80px; overflow: hidden; }
        .header-bg { position: absolute; inset: 0; z-index: 0; }
        .header-bg img { width: 100%; height: 100%; object-fit: cover; filter: blur(60px) brightness(0.3) saturate(1.5); transform: scale(1.2); }
        .header-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, transparent, #0f172a); }
        
        .header-content { position: relative; z-index: 1; display: flex; gap: 4rem; align-items: flex-end; }
        
        .detail-cover { 
          flex-shrink: 0; width: 300px; aspect-ratio: 2/3; 
          border-radius: 20px; overflow: hidden; 
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7); 
          border: 1px solid rgba(255, 255, 255, 0.1);
          transform: translateY(20px);
        }
        .detail-cover img { width: 100%; height: 100%; object-fit: cover; }
        
        .detail-info { flex: 1; padding-bottom: 20px; }
        .type-badge { 
          background: var(--primary); color: white; padding: 0.4rem 1rem; 
          border-radius: 8px; font-size: 0.85rem; font-weight: 800; 
          text-transform: uppercase; letter-spacing: 1px; margin-bottom: 1.5rem;
          display: inline-block; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
        }
        
        .manga-title { font-size: 4rem; font-weight: 900; margin-bottom: 0.5rem; line-height: 1.1; letter-spacing: -2px; }
        .other-title { color: #94a3b8; font-size: 1.5rem; margin-bottom: 2.5rem; font-weight: 500; }
        
        .stats-row { display: flex; gap: 3rem; margin-bottom: 2.5rem; }
        .stat-item { display: flex; align-items: center; gap: 0.75rem; font-weight: 800; font-size: 1.2rem; }
        .stat-item svg { color: var(--primary); }
        
        .genre-tag { 
          background: rgba(255, 255, 255, 0.05); color: #cbd5e1; 
          padding: 0.6rem 1.5rem; border-radius: 12px; font-size: 0.9rem; 
          font-weight: 700; border: 1px solid rgba(255, 255, 255, 0.1); 
          margin-right: 0.75rem; transition: all 0.3s;
        }
        .genre-tag:hover { background: var(--primary); color: white; border-color: var(--primary); }
        
        .action-btns { display: flex; gap: 1.5rem; margin-top: 3rem; }
        .read-now-btn { 
          background: var(--primary); color: white; padding: 1.1rem 3rem; 
          border-radius: 16px; font-weight: 900; font-size: 1.1rem;
          display: flex; align-items: center; gap: 0.75rem; 
          box-shadow: 0 10px 30px rgba(99, 102, 241, 0.5);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .read-now-btn:hover { transform: translateY(-5px); box-shadow: 0 20px 40px rgba(99, 102, 241, 0.6); }
        
        .follow-btn { 
          background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(10px);
          padding: 1.1rem 2.5rem; border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.1);
          color: white; font-weight: 800; font-size: 1.1rem;
          display: flex; align-items: center; gap: 0.75rem; transition: all 0.3s;
        }
        .follow-btn:hover { background: rgba(255, 255, 255, 0.1); }

        .detail-body { margin-top: 5rem; padding-bottom: 8rem; }
        .body-grid { display: grid; grid-template-columns: 1fr 340px; gap: 4rem; }
        
        .glass-card { 
          background: rgba(255, 255, 255, 0.02); backdrop-filter: blur(20px); 
          border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 24px;
          padding: 2.5rem;
        }
        
        .section-title { 
          display: flex; align-items: center; gap: 1rem; 
          font-size: 1.75rem; font-weight: 900; margin-bottom: 2rem; 
          color: white; border-left: 4px solid var(--primary); padding-left: 1rem;
        }
        .description { color: #94a3b8; line-height: 2; font-size: 1.15rem; font-weight: 500; }
        
        .chapters-section { margin-top: 4rem; }
        .chapter-count { background: rgba(99, 102, 241, 0.1); color: var(--primary); padding: 4px 12px; border-radius: 8px; font-size: 0.9rem; }
        
        .chapters-list { padding: 0.5rem; }
        .chapter-item { 
          display: flex; justify-content: space-between; align-items: center; 
          padding: 1.5rem 2rem; border-radius: 16px; margin-bottom: 0.5rem;
          transition: all 0.3s; border: 1px solid transparent;
        }
        .chapter-item:hover { 
          background: rgba(255, 255, 255, 0.03); 
          border-color: rgba(255, 255, 255, 0.1);
          transform: translateX(10px); 
          color: var(--primary); 
        }
        .ch-info { display: flex; align-items: center; gap: 1.5rem; }
        .ch-num { font-weight: 900; font-size: 1.1rem; color: white; }
        .ch-title { color: #94a3b8; font-weight: 600; }
        .ch-date { color: #64748b; font-size: 0.9rem; font-weight: 600; }
        
        .side-card h4 { font-size: 1.5rem; font-weight: 900; margin-bottom: 2rem; color: white; }
        .side-item { margin-bottom: 1.5rem; padding: 1rem; background: rgba(255, 255, 255, 0.02); border-radius: 12px; }
        .side-item span { color: #94a3b8; font-size: 0.9rem; }
        .side-item strong { display: block; color: white; font-size: 1.1rem; margin-top: 0.25rem; }
        .status-highlight { color: #22c55e !important; }

        @media (max-width: 1024px) {
          .body-grid { grid-template-columns: 1fr; }
          .header-content { flex-direction: column; align-items: center; text-align: center; gap: 2rem; }
          .detail-cover { width: 220px; transform: translateY(0); }
          .manga-title { font-size: 2.5rem; }
          .stats-row { justify-content: center; gap: 1.5rem; }
          .action-btns { flex-direction: column; width: 100%; }
          .read-now-btn, .follow-btn { justify-content: center; }
        }
      `}</style>
    </div>
  );
};

export default MangaDetail;
