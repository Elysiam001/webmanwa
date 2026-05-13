import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Flame, Star, TrendingUp, Clock, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  const bannerManga = [];
  const latestUpdates = [];

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="banner-container">
          {bannerManga.map((manga, index) => (
            <motion.div 
              key={manga.id}
              className={`banner-slide ${index === activeSlide ? 'active' : ''}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: index === activeSlide ? 1 : 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="banner-overlay"></div>
              <img src={manga.image} alt={manga.title} className="banner-bg" />
              <div className="container banner-content">
                <motion.div 
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="banner-info"
                >
                  <span className="status-badge">{manga.status}</span>
                  <h1 className="banner-title">{manga.title}</h1>
                  <div className="banner-meta">
                    {manga.genre.map(g => <span key={g} className="genre-tag">{g}</span>)}
                  </div>
                  <p className="banner-desc">{manga.description}</p>
                  <div className="banner-btns">
                    <Link to={`/manga/${manga.id}`} className="primary-btn">Đọc ngay</Link>
                    <button className="secondary-btn glass">Thông tin</button>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="container">
        <section className="main-section">
          <div className="section-header">
            <h2 className="section-title">Mới cập nhật</h2>
            <Link to="/latest" className="view-all">
              Xem tất cả <ChevronRight size={18} />
            </Link>
          </div>
          
          <div className="manga-grid">
            {latestUpdates.length > 0 ? (
              latestUpdates.map((manga, idx) => (
                <motion.div 
                  key={manga.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -10 }}
                >
                  <Link to={`/manga/${manga.id}`} className="manga-card">
                    <div className="card-thumb">
                      <img src={manga.thumbnail} alt={manga.title} />
                      <div className="card-overlay">
                        <span className="rating"><Star size={14} fill="currentColor" /> {manga.rating}</span>
                      </div>
                      <div className="card-hover-info">
                        <button className="read-btn">Đọc ngay</button>
                      </div>
                    </div>
                    <div className="card-info">
                      <h3 className="manga-title">{manga.title}</h3>
                      <div className="manga-stats">
                        <span className="chapter">{manga.chapter}</span>
                        <span className="views"><Flame size={12} /> {manga.views}</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))
            ) : (
              <div className="no-data glass">
                <p>Chưa có truyện nào được đăng. Hãy là người đầu tiên!</p>
              </div>
            )}
          </div>
        </section>
      </div>

      <style jsx="true">{`
        .home-page { padding-bottom: 5rem; }
        .hero-section { height: 600px; margin-bottom: 4rem; position: relative; }
        .banner-container { height: 100%; position: relative; }
        .banner-slide { position: absolute; inset: 0; display: none; }
        .banner-slide.active { display: block; }
        .banner-bg { width: 100%; height: 100%; object-fit: cover; }
        .banner-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, var(--bg-main) 10%, transparent 60%),
                      linear-gradient(to right, var(--bg-main) 20%, transparent 80%);
        }
        .banner-content { position: relative; height: 100%; display: flex; align-items: center; z-index: 10; }
        .banner-info { max-width: 600px; }
        .status-badge { background: var(--primary); padding: 0.25rem 0.75rem; border-radius: var(--radius-full); font-size: 0.8rem; font-weight: 700; text-transform: uppercase; }
        .banner-title { font-size: 3.5rem; font-weight: 800; margin: 1rem 0; line-height: 1.1; }
        .genre-tag { background: rgba(255, 255, 255, 0.1); padding: 0.3rem 0.8rem; border-radius: var(--radius-full); font-size: 0.85rem; margin-right: 0.5rem; }
        .banner-desc { margin: 1.5rem 0; color: var(--text-secondary); font-size: 1.1rem; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
        .banner-btns { display: flex; gap: 1rem; }
        .primary-btn { background: var(--primary); color: white; padding: 1rem 2rem; border-radius: var(--radius-md); font-weight: 600; }
        .secondary-btn { padding: 1rem 2rem; border-radius: var(--radius-md); font-weight: 600; color: white; }
        .main-section { margin-bottom: 4rem; }
        .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .view-all { display: flex; align-items: center; color: var(--text-secondary); font-size: 0.9rem; }
        .manga-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 2rem; }
        .manga-card { display: block; color: inherit; }
        .card-thumb { position: relative; aspect-ratio: 2/3; border-radius: var(--radius-md); overflow: hidden; background: var(--bg-surface); }
        .card-thumb img { width: 100%; height: 100%; object-fit: cover; transition: var(--transition); }
        .manga-card:hover .card-thumb img { transform: scale(1.1); }
        .card-overlay { position: absolute; top: 10px; right: 10px; }
        .rating { background: rgba(0, 0, 0, 0.6); backdrop-filter: blur(4px); padding: 0.2rem 0.5rem; border-radius: var(--radius-sm); font-size: 0.8rem; display: flex; align-items: center; gap: 0.3rem; color: #ffb800; }
        .card-hover-info { position: absolute; inset: 0; background: rgba(0, 0, 0, 0.4); display: flex; align-items: center; justify-content: center; opacity: 0; transition: var(--transition); }
        .manga-card:hover .card-hover-info { opacity: 1; }
        .read-btn { background: var(--primary); color: white; padding: 0.5rem 1.25rem; border-radius: var(--radius-full); font-weight: 600; transform: translateY(20px); transition: var(--transition); }
        .manga-card:hover .read-btn { transform: translateY(0); }
        .card-info { padding-top: 1rem; }
        .manga-title { font-size: 1rem; font-weight: 600; margin-bottom: 0.4rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .manga-card:hover .manga-title { color: var(--primary); }
        .manga-meta { display: flex; justify-content: space-between; align-items: center; color: var(--text-secondary); font-size: 0.85rem; }
        .chapter { color: var(--accent); font-weight: 500; }
        .no-data {
          grid-column: 1 / -1;
          padding: 4rem;
          text-align: center;
          color: var(--text-secondary);
          border-radius: var(--radius-lg);
          font-size: 1.1rem;
        }
        @media (max-width: 768px) {
          .banner-title { font-size: 2.25rem; }
          .hero-section { height: 450px; }
          .manga-grid { grid-template-columns: repeat(2, 1fr); gap: 1rem; }
        }
      `}</style>
    </div>
  );
};

export default Home;
