import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Flame, Star, TrendingUp, Clock, ChevronRight, Play, BookOpen, User, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
  const [latestUpdates, setLatestUpdates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchManga = async () => {
      try {
        const res = await fetch('/api/manga');
        const data = await res.json();
        if (res.ok) setLatestUpdates(data);
      } catch (err) {
        console.error('Lỗi tải truyện:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchManga();
  }, []);

  return (
    <div className="home-page">
      {/* PREMIUM HERO SECTION */}
      <section className="hero-v2">
        <div className="hero-v2-bg">
          <div className="blob blob-1"></div>
          <div className="blob blob-2"></div>
          <div className="blob blob-3"></div>
        </div>
        
        <div className="container hero-v2-content">
          <div className="hero-v2-grid">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="hero-v2-text"
            >
              <div className="hero-tag">
                <Zap size={16} fill="currentColor" /> <span>Nền tảng Manhwa hàng đầu</span>
              </div>
              <h1 className="hero-v2-title">
                Thỏa sức đam mê <br />
                với <span className="text-gradient">Thế giới Truyện</span>
              </h1>
              <p className="hero-v2-desc">
                Cập nhật liên tục những bộ truyện hot nhất, dịch giả tâm huyết, 
                trải nghiệm đọc đỉnh cao hoàn toàn miễn phí.
              </p>
              <div className="hero-v2-btns">
                <Link to="/latest" className="btn-glow">
                  Bắt đầu đọc <ChevronRight size={20} />
                </Link>
                <Link to="/genres" className="btn-glass">
                  Thể loại
                </Link>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="hero-v2-visual"
            >
              <div className="floating-card-wrapper">
                <img 
                  src="https://images.unsplash.com/photo-1618336753974-aae8e04506aa?auto=format&fit=crop&q=80&w=800" 
                  alt="Hero" 
                  className="hero-img-main"
                />
                <div className="floating-badge top-right">
                  <Star size={16} fill="#fbbf24" color="#fbbf24" /> <span>9.8 Rating</span>
                </div>
                <div className="floating-badge bottom-left">
                  <BookOpen size={16} /> <span>10k+ Chương</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="container main-layout">
        {/* SECTION: LATEST UPDATES */}
        <section className="home-section">
          <div className="section-header-v2">
            <div className="section-title-v2">
              <div className="icon-box"><Clock size={24} /></div>
              <h2>Mới cập nhật</h2>
            </div>
            <Link to="/latest" className="link-more">Xem tất cả <ChevronRight size={18} /></Link>
          </div>

          <div className="manga-grid-v2">
            {loading ? (
              [1,2,3,4,5,6].map(i => <div key={i} className="skeleton-card"></div>)
            ) : latestUpdates.length > 0 ? (
              latestUpdates.map((manga, idx) => (
                <motion.div 
                  key={manga._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Link to={`/manga/${manga._id}`} className="manga-card-v2">
                    <div className="manga-card-thumb">
                      <img src={manga.cover} alt={manga.title} loading="lazy" />
                      <div className="thumb-overlay">
                        <div className="play-icon"><Play size={24} fill="currentColor" /></div>
                      </div>
                      <div className="badge-type">{manga.type}</div>
                      <div className="badge-rating"><Star size={12} fill="#fbbf24" color="#fbbf24" /> {manga.rating || 0}</div>
                    </div>
                    <div className="manga-card-info">
                      <h3 className="manga-card-title">{manga.title}</h3>
                      <div className="manga-card-meta">
                        <span className="last-ch">Chương {manga.lastChapter?.number || '??'}</span>
                        <span className="views"><Flame size={14} /> {manga.views || 0}</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))
            ) : (
              <div className="empty-state">
                <p>Chưa có dữ liệu truyện nào.</p>
              </div>
            )}
          </div>
        </section>

        {/* SECTION: GENRES */}
        <section className="home-section">
          <div className="section-header-v2">
            <div className="section-title-v2">
              <div className="icon-box"><TrendingUp size={24} /></div>
              <h2>Thể loại phổ biến</h2>
            </div>
          </div>
          <div className="genre-cloud">
            {['Action', 'Fantasy', 'Adventure', 'Isekai', 'Romance', 'Comedy', 'Drama', 'Magic'].map(g => (
              <Link key={g} to={`/genres/${g}`} className="genre-item-v2">{g}</Link>
            ))}
          </div>
        </section>
      </div>

      <style jsx="true">{`
        .home-page { padding-bottom: 100px; overflow-x: hidden; }
        
        /* HERO V2 */
        .hero-v2 { position: relative; padding: 140px 0 100px; min-height: 85vh; display: flex; align-items: center; overflow: hidden; }
        .hero-v2-bg { position: absolute; inset: 0; z-index: 0; }
        .blob { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.15; }
        .blob-1 { width: 500px; height: 500px; background: var(--primary); top: -100px; right: -100px; }
        .blob-2 { width: 400px; height: 400px; background: var(--secondary); bottom: -100px; left: -100px; }
        .blob-3 { width: 300px; height: 300px; background: var(--accent); top: 50%; left: 50%; }

        .hero-v2-content { position: relative; z-index: 1; }
        .hero-v2-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; }
        
        .hero-tag { display: inline-flex; align-items: center; gap: 0.75rem; background: rgba(99, 102, 241, 0.1); color: var(--primary); padding: 8px 16px; border-radius: 100px; font-weight: 800; font-size: 0.85rem; margin-bottom: 2rem; border: 1px solid rgba(99, 102, 241, 0.2); }
        .hero-v2-title { font-size: 4.5rem; font-weight: 900; line-height: 1.1; margin-bottom: 1.5rem; letter-spacing: -2px; }
        .text-gradient { background: linear-gradient(135deg, #818cf8, #c084fc); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .hero-v2-desc { font-size: 1.2rem; color: var(--text-secondary); max-width: 550px; margin-bottom: 3rem; line-height: 1.6; }
        
        .hero-v2-btns { display: flex; gap: 1.5rem; }
        .btn-glow { background: var(--primary); color: white; padding: 1.1rem 2.5rem; border-radius: 16px; font-weight: 800; font-size: 1.1rem; display: flex; align-items: center; gap: 0.75rem; box-shadow: 0 10px 30px rgba(99, 102, 241, 0.4); transition: 0.3s; }
        .btn-glow:hover { transform: translateY(-5px); box-shadow: 0 15px 40px rgba(99, 102, 241, 0.6); }
        .btn-glass { background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(10px); color: white; padding: 1.1rem 2.5rem; border-radius: 16px; font-weight: 800; font-size: 1.1rem; border: 1px solid rgba(255, 255, 255, 0.1); transition: 0.3s; }
        .btn-glass:hover { background: rgba(255, 255, 255, 0.1); }

        .hero-v2-visual { position: relative; }
        .floating-card-wrapper { position: relative; padding: 20px; }
        .hero-img-main { width: 100%; height: 550px; object-fit: cover; border-radius: 32px; box-shadow: 0 40px 80px rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1); }
        .floating-badge { position: absolute; background: rgba(15, 23, 42, 0.8); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.1); padding: 12px 20px; border-radius: 20px; display: flex; align-items: center; gap: 0.75rem; font-weight: 800; box-shadow: 0 15px 30px rgba(0,0,0,0.3); }
        .top-right { top: 0; right: 0; transform: translate(20%, 20%); color: #fbbf24; }
        .bottom-left { bottom: 0; left: 0; transform: translate(-20%, -20%); color: var(--primary); }

        /* SECTIONS */
        .home-section { padding: 4rem 0; }
        .section-header-v2 { display: flex; justify-content: space-between; align-items: center; margin-bottom: 3rem; }
        .section-title-v2 { display: flex; align-items: center; gap: 1.5rem; }
        .icon-box { background: rgba(99, 102, 241, 0.1); color: var(--primary); padding: 12px; border-radius: 16px; }
        .section-title-v2 h2 { font-size: 2rem; font-weight: 900; }
        .link-more { color: var(--primary); font-weight: 800; display: flex; align-items: center; gap: 0.5rem; }

        /* MANGA GRID V2 */
        .manga-grid-v2 { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 3rem 2rem; }
        .manga-card-v2 { display: flex; flex-direction: column; gap: 1rem; position: relative; }
        .manga-card-thumb { position: relative; aspect-ratio: 2/3; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 20px rgba(0,0,0,0.3); transition: 0.3s; }
        .manga-card-thumb img { width: 100%; height: 100%; object-fit: cover; transition: 0.5s; }
        .manga-card-v2:hover .manga-card-thumb { transform: translateY(-10px); box-shadow: 0 20px 40px rgba(0,0,0,0.5); }
        .manga-card-v2:hover .manga-card-thumb img { transform: scale(1.1); }
        
        .thumb-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.8), transparent); opacity: 0; transition: 0.3s; display: flex; align-items: center; justify-content: center; }
        .manga-card-v2:hover .thumb-overlay { opacity: 1; }
        .play-icon { background: var(--primary); color: white; width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transform: scale(0.5); transition: 0.3s; }
        .manga-card-v2:hover .play-icon { transform: scale(1); }

        .badge-type { position: absolute; top: 12px; left: 12px; background: var(--primary); color: white; padding: 4px 10px; border-radius: 8px; font-size: 0.75rem; font-weight: 800; }
        .badge-rating { position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.6); backdrop-filter: blur(8px); color: #fbbf24; padding: 4px 10px; border-radius: 8px; font-size: 0.8rem; font-weight: 800; display: flex; align-items: center; gap: 4px; }

        .manga-card-title { font-size: 1.15rem; font-weight: 800; color: white; line-height: 1.3; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
        .manga-card-meta { display: flex; justify-content: space-between; font-size: 0.9rem; font-weight: 700; }
        .last-ch { color: var(--primary); }
        .views { color: var(--text-muted); display: flex; align-items: center; gap: 4px; }

        /* GENRES V2 */
        .genre-cloud { display: flex; flex-wrap: wrap; gap: 1rem; }
        .genre-item-v2 { background: rgba(255, 255, 255, 0.03); color: #94a3b8; padding: 12px 24px; border-radius: 16px; font-weight: 700; border: 1px solid rgba(255, 255, 255, 0.05); transition: 0.3s; }
        .genre-item-v2:hover { background: var(--primary); color: white; border-color: var(--primary); transform: translateY(-3px); box-shadow: 0 10px 20px rgba(99, 102, 241, 0.3); }

        .skeleton-card { aspect-ratio: 2/3; background: rgba(255,255,255,0.05); border-radius: 16px; animation: pulse 1.5s infinite; }
        @keyframes pulse { 0% { opacity: 0.5; } 50% { opacity: 0.8; } 100% { opacity: 0.5; } }

        @media (max-width: 1024px) {
          .hero-v2-grid { grid-template-columns: 1fr; text-align: center; gap: 4rem; }
          .hero-v2-text { display: flex; flex-direction: column; align-items: center; }
          .hero-v2-title { font-size: 3rem; }
          .hero-v2-visual { max-width: 400px; margin: 0 auto; }
          .floating-badge { font-size: 0.7rem; padding: 8px 12px; }
          .manga-grid-v2 { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); }
        }
      `}</style>
    </div>
  );
};

export default Home;
