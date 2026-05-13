import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Flame, Star, TrendingUp, Clock, ChevronRight, Play } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  const bannerManga = []; // Sẽ lấy từ Database sau
  const latestUpdates = []; // Sẽ lấy từ Database sau

  return (
    <div className="home-page">
      {/* Hero Section với Trang trí mới */}
      <section className="hero-section">
        <div className="container hero-content">
          <div className="hero-grid">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="hero-text"
            >
              <span className="hero-badge">Chào mừng tới ManhwaHub</span>
              <h1 className="hero-title">
                Khám phá thế giới <br /> 
                <span className="gradient-text">Truyện tranh</span> đỉnh cao
              </h1>
              <p className="hero-desc">
                Cập nhật nhanh nhất những bộ Manhwa, Manga, Manhua hot nhất hiện nay. 
                Trải nghiệm đọc truyện mượt mà trên mọi thiết bị.
              </p>
              <div className="hero-btns">
                <Link to="/genres" className="btn-primary-vibrant">
                  Khám phá ngay <Play size={18} fill="currentColor" />
                </Link>
                <Link to="/latest" className="btn-secondary-outline">
                  Truyện mới nhất
                </Link>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="hero-image-wrapper"
            >
              <div className="decorative-circle-1"></div>
              <div className="decorative-circle-2"></div>
              <img 
                src="https://images.unsplash.com/photo-1618336753974-aae8e04506aa?auto=format&fit=crop&q=80&w=800" 
                alt="Manhwa Art" 
                className="hero-main-img"
              />
            </motion.div>
          </div>
        </div>
      </section>

      <div className="container">
        {/* Section: Mới cập nhật */}
        <section className="main-section">
          <div className="section-header">
            <div className="section-title-wrapper">
              <div className="title-icon"><Clock size={24} /></div>
              <h2 className="section-title">Mới cập nhật</h2>
            </div>
            <Link to="/latest" className="view-all-btn">
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
                  whileHover={{ y: -8 }}
                >
                  <Link to={`/manga/${manga.id}`} className="manga-card-vibrant">
                    <div className="card-thumb-vibrant">
                      <img src={manga.thumbnail} alt={manga.title} />
                      <div className="card-badge">{manga.status || 'Hot'}</div>
                      <div className="card-rating">
                        <Star size={12} fill="currentColor" /> {manga.rating}
                      </div>
                    </div>
                    <div className="card-content-vibrant">
                      <h3 className="manga-title-vibrant">{manga.title}</h3>
                      <div className="manga-info-vibrant">
                        <span className="chapter-label">{manga.chapter}</span>
                        <span className="views-label"><Flame size={12} /> {manga.views}</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))
            ) : (
              <div className="no-data-vibrant">
                <div className="no-data-icon">📦</div>
                <p className="no-data-text">Hiện chưa có bộ truyện nào. Hãy quay lại sau nhé!</p>
                <Link to="/create-manga" className="btn-small-primary">Đăng truyện đầu tiên</Link>
              </div>
            )}
          </div>
        </section>

        {/* Section: Thể loại tiêu biểu */}
        <section className="genre-preview-section">
           <div className="section-header">
            <div className="section-title-wrapper">
              <div className="title-icon"><TrendingUp size={24} /></div>
              <h2 className="section-title">Thể loại phổ biến</h2>
            </div>
          </div>
          <div className="genre-pills">
            {['Action', 'Fantasy', 'Adventure', 'Isekai', 'Romance', 'School Life', 'Supernatural', 'Comedy'].map(genre => (
              <Link key={genre} to={`/genres/${genre}`} className="genre-pill">
                {genre}
              </Link>
            ))}
          </div>
        </section>
      </div>

      <style jsx="true">{`
        .home-page {
          padding-top: 80px;
          min-height: 100vh;
        }

        /* Hero Section Styling */
        .hero-section {
          padding: 4rem 0;
          background: radial-gradient(circle at top right, var(--primary-light), transparent);
          overflow: hidden;
        }

        .hero-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          gap: 4rem;
        }

        .hero-badge {
          display: inline-block;
          background: var(--primary-light);
          color: var(--primary);
          padding: 0.5rem 1.25rem;
          border-radius: var(--radius-full);
          font-weight: 700;
          font-size: 0.85rem;
          margin-bottom: 1.5rem;
          border: 1px solid rgba(99, 102, 241, 0.2);
        }

        .hero-title {
          font-size: 3.5rem;
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: 1.5rem;
          color: var(--text-primary);
        }

        .hero-desc {
          color: var(--text-secondary);
          font-size: 1.1rem;
          max-width: 500px;
          margin-bottom: 2.5rem;
        }

        .hero-btns {
          display: flex;
          gap: 1.25rem;
        }

        .btn-primary-vibrant {
          background: linear-gradient(135deg, var(--primary), var(--accent));
          color: white;
          padding: 1rem 2rem;
          border-radius: var(--radius-lg);
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          box-shadow: 0 10px 25px rgba(99, 102, 241, 0.3);
        }

        .btn-primary-vibrant:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 30px rgba(99, 102, 241, 0.4);
        }

        .btn-secondary-outline {
          border: 2px solid var(--border);
          color: var(--text-primary);
          padding: 1rem 2rem;
          border-radius: var(--radius-lg);
          font-weight: 700;
        }

        .hero-image-wrapper {
          position: relative;
        }

        .hero-main-img {
          width: 100%;
          height: 500px;
          object-fit: cover;
          border-radius: 2.5rem;
          box-shadow: var(--shadow-xl);
          position: relative;
          z-index: 2;
        }

        .decorative-circle-1 {
          position: absolute;
          top: -20px;
          right: -20px;
          width: 150px;
          height: 150px;
          background: var(--secondary);
          opacity: 0.2;
          filter: blur(40px);
          border-radius: 50%;
        }

        .decorative-circle-2 {
          position: absolute;
          bottom: -30px;
          left: -30px;
          width: 200px;
          height: 200px;
          background: var(--primary);
          opacity: 0.2;
          filter: blur(50px);
          border-radius: 50%;
        }

        /* Section Styling */
        .main-section {
          padding: 4rem 0;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2.5rem;
        }

        .section-title-wrapper {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .title-icon {
          color: var(--primary);
          background: var(--primary-light);
          padding: 10px;
          border-radius: 12px;
        }

        .section-title {
          font-size: 1.75rem;
          font-weight: 800;
          color: var(--text-primary);
        }

        .view-all-btn {
          color: var(--primary);
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        /* Manga Card Vibrant */
        .manga-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 2rem;
        }

        .manga-card-vibrant {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .card-thumb-vibrant {
          position: relative;
          aspect-ratio: 2/3;
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-md);
        }

        .card-thumb-vibrant img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .manga-card-vibrant:hover img {
          transform: scale(1.1);
        }

        .card-badge {
          position: absolute;
          top: 10px;
          left: 10px;
          background: var(--primary);
          color: white;
          padding: 4px 10px;
          border-radius: 8px;
          font-size: 0.75rem;
          font-weight: 700;
        }

        .card-rating {
          position: absolute;
          bottom: 10px;
          right: 10px;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(10px);
          color: #fbbf24;
          padding: 4px 8px;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .manga-title-vibrant {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1.3;
        }

        .manga-info-vibrant {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .chapter-label {
          color: var(--primary);
          font-weight: 600;
        }

        /* No Data State */
        .no-data-vibrant {
          grid-column: 1 / -1;
          padding: 5rem;
          background: white;
          border: 2px dashed var(--border);
          border-radius: var(--radius-xl);
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .no-data-icon { font-size: 3rem; }
        .no-data-text { color: var(--text-secondary); font-weight: 500; font-size: 1.1rem; }
        .btn-small-primary {
          background: var(--primary-light);
          color: var(--primary);
          padding: 0.5rem 1.5rem;
          border-radius: var(--radius-full);
          font-weight: 700;
          font-size: 0.9rem;
        }

        /* Genre Pills */
        .genre-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 4rem;
        }

        .genre-pill {
          background: white;
          border: 1px solid var(--border);
          padding: 0.75rem 1.5rem;
          border-radius: var(--radius-full);
          font-weight: 600;
          color: var(--text-secondary);
          box-shadow: var(--shadow-sm);
        }

        .genre-pill:hover {
          background: var(--primary);
          color: white;
          border-color: var(--primary);
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
        }

        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr; gap: 2rem; }
          .hero-title { font-size: 2.5rem; }
          .hero-main-img { height: 350px; }
        }
      `}</style>
    </div>
  );
};

export default Home;
