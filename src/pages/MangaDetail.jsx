import { useParams, Link } from 'react-router-dom';
import { Star, Play, Heart, Share2, List, Info, Clock, User, Tag } from 'lucide-react';
import { motion } from 'framer-motion';

const MangaDetail = () => {
  const { id } = useParams();

  // Mock data for the manga
  const manga = {
    id: id,
    title: "Solo Leveling",
    otherTitle: "Na Honjaman Level Up",
    author: "Chugong",
    artist: "Dubu (Redice Studio)",
    status: "Hoàn thành",
    type: "Manhwa",
    views: "15.2M",
    followers: "1.2M",
    rating: 4.9,
    description: "Trong một thế giới nơi những thợ săn, những người sở hữu sức mạnh ma thuật, phải chiến đấu với những con quái vật để bảo vệ loài người khỏi sự diệt vong nhất định, một thợ săn yếu đuối tên là Sung Jin-woo thấy mình đang ở trong một cuộc đấu tranh sinh tồn vô tận. Sau khi sống sót sau một ngục tối kép cực kỳ nguy hiểm và hiếm có, anh ta được chọn bởi một chương trình bí ẩn có tên là Hệ thống và được ban cho khả năng hiếm có là tăng cấp sức mạnh vượt giới hạn.",
    genres: ["Hành động", "Phiêu lưu", "Fantasy", "Hệ thống"],
    cover: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?auto=format&fit=crop&q=80&w=600",
    chapters: [
      { id: 200, title: "Chapter 200: Kết thúc", date: "10/05/2026" },
      { id: 199, title: "Chapter 199: Trận chiến cuối cùng", date: "05/05/2026" },
      { id: 198, title: "Chapter 198: Sự chuẩn bị", date: "01/05/2026" },
      { id: 1, title: "Chapter 1: Khởi đầu", date: "01/01/2020" },
    ]
  };

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
              <div className="stat-item"><Star size={18} fill="#ffb800" color="#ffb800" /> <span>{manga.rating}</span></div>
              <div className="stat-item"><Heart size={18} /> <span>{manga.followers}</span></div>
              <div className="stat-item"><Clock size={18} /> <span>{manga.views}</span></div>
            </div>

            <div className="genres-list">
              {manga.genres.map(g => <span key={g} className="genre-tag">{g}</span>)}
            </div>

            <div className="action-btns">
              <Link to={`/read/${id}/1`} className="read-now-btn">
                <Play size={20} fill="currentColor" /> Đọc từ đầu
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
              <p className="description">{manga.description}</p>
            </section>

            <section className="chapters-section">
              <div className="section-header">
                <h3 className="section-title"><List size={20} /> Danh sách chương</h3>
                <span className="chapter-count">{manga.chapters.length} chương</span>
              </div>
              
              <div className="chapters-list glass">
                {manga.chapters.map(ch => (
                  <Link key={ch.id} to={`/read/${id}/${ch.id}`} className="chapter-item">
                    <span className="ch-title">{ch.title}</span>
                    <span className="ch-date">{ch.date}</span>
                  </Link>
                ))}
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
                <Star size={16} /> <span>Họa sĩ: <strong>{manga.artist}</strong></span>
              </div>
              <div className="side-item">
                <Tag size={16} /> <span>Trạng thái: <strong className="status-highlight">{manga.status}</strong></span>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <style jsx="true">{`
        .detail-page {
          padding-top: 0;
        }

        .detail-header {
          position: relative;
          padding: 140px 0 60px;
          overflow: hidden;
        }

        .header-bg {
          position: absolute;
          inset: 0;
          z-index: -1;
        }

        .header-bg img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: blur(40px) brightness(0.3);
          transform: scale(1.1);
        }

        .header-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, transparent, var(--bg-main));
        }

        .header-content {
          display: flex;
          gap: 3rem;
          align-items: flex-end;
        }

        .detail-cover {
          flex-shrink: 0;
          width: 280px;
          aspect-ratio: 2/3;
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-lg);
          border: 4px solid rgba(255, 255, 255, 0.1);
        }

        .detail-cover img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .detail-info {
          flex: 1;
        }

        .type-badge {
          background: var(--accent);
          color: white;
          padding: 0.2rem 0.6rem;
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
          font-weight: 700;
          display: inline-block;
          margin-bottom: 0.75rem;
        }

        .manga-title {
          font-size: 3rem;
          font-weight: 800;
          margin-bottom: 0.5rem;
          line-height: 1.2;
        }

        .other-title {
          color: var(--text-secondary);
          font-size: 1.1rem;
          margin-bottom: 1.5rem;
        }

        .stats-row {
          display: flex;
          gap: 2rem;
          margin-bottom: 1.5rem;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
        }

        .action-btns {
          display: flex;
          gap: 1rem;
          margin-top: 2rem;
        }

        .read-now-btn {
          background: var(--primary);
          color: white;
          padding: 0.8rem 2rem;
          border-radius: var(--radius-md);
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          box-shadow: 0 4px 20px rgba(139, 92, 246, 0.4);
        }

        .follow-btn, .share-btn {
          padding: 0.8rem 1.5rem;
          border-radius: var(--radius-md);
          color: white;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .detail-body {
          margin-top: 3rem;
          padding-bottom: 5rem;
        }

        .body-grid {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 3rem;
        }

        .description {
          color: var(--text-secondary);
          line-height: 1.8;
          font-size: 1.05rem;
          margin-top: 1rem;
        }

        .chapters-section {
          margin-top: 3rem;
        }

        .chapter-count {
          color: var(--text-muted);
          font-size: 0.9rem;
        }

        .chapters-list {
          margin-top: 1.5rem;
          border-radius: var(--radius-md);
          max-height: 500px;
          overflow-y: auto;
        }

        .chapter-item {
          display: flex;
          justify-content: space-between;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid var(--border);
          transition: var(--transition);
        }

        .chapter-item:hover {
          background: rgba(255, 255, 255, 0.05);
          padding-left: 2rem;
          color: var(--primary);
        }

        .ch-title {
          font-weight: 500;
        }

        .ch-date {
          color: var(--text-muted);
          font-size: 0.85rem;
        }

        .side-card {
          padding: 1.5rem;
          border-radius: var(--radius-md);
        }

        .side-card h4 {
          margin-bottom: 1.25rem;
          font-size: 1.1rem;
        }

        .side-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
          color: var(--text-secondary);
          font-size: 0.95rem;
        }

        .status-highlight {
          color: #22c55e;
        }

        @media (max-width: 1024px) {
          .body-grid { grid-template-columns: 1fr; }
          .header-content { flex-direction: column; align-items: center; text-align: center; }
          .detail-cover { width: 200px; }
          .stats-row { justify-content: center; }
          .action-btns { justify-content: center; }
          .manga-title { font-size: 2rem; }
        }
      `}</style>
    </div>
  );
};

export default MangaDetail;
