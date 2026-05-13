import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, Plus, Save, ChevronLeft, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const CreateManga = () => {
  const navigate = useNavigate();
  const [cover, setCover] = useState(null);
  const [genres, setGenres] = useState([]);
  
  const availableGenres = ["Action", "Adventure", "Comedy", "Drama", "Fantasy", "Horror", "Mystery", "Romance", "Sci-Fi", "Slice of Life"];

  const toggleGenre = (genre) => {
    if (genres.includes(genre)) {
      setGenres(genres.filter(g => g !== genre));
    } else {
      setGenres([...genres, genre]);
    }
  };

  return (
    <div className="create-manga-page container">
      <header className="page-header">
        <button onClick={() => navigate(-1)} className="back-link">
          <ChevronLeft size={20} /> Quay lại Dashboard
        </button>
        <h1 className="page-title">Tạo truyện mới</h1>
      </header>

      <div className="create-grid">
        <div className="main-form glass">
          <section className="form-section">
            <h3>Thông tin cơ bản</h3>
            <div className="form-group">
              <label>Tên truyện *</label>
              <input type="text" placeholder="Nhập tên chính thức..." required />
            </div>
            <div className="form-group">
              <label>Tên khác (nếu có)</label>
              <input type="text" placeholder="Tên tiếng Anh, Hàn, Nhật..." />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Tác giả</label>
                <input type="text" placeholder="Tên tác giả..." />
              </div>
              <div className="form-group">
                <label>Họa sĩ</label>
                <input type="text" placeholder="Tên họa sĩ..." />
              </div>
            </div>
          </section>

          <section className="form-section">
            <h3>Nội dung & Phân loại</h3>
            <div className="form-group">
              <label>Giới thiệu nội dung</label>
              <textarea rows="6" placeholder="Mô tả tóm tắt về câu chuyện..."></textarea>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Loại truyện</label>
                <select className="glass">
                  <option>Manga</option>
                  <option>Manhwa</option>
                  <option>Manhua</option>
                  <option>Comic</option>
                  <option>Novel</option>
                </select>
              </div>
              <div className="form-group">
                <label>Trạng thái</label>
                <select className="glass">
                  <option>Đang tiến hành</option>
                  <option>Hoàn thành</option>
                  <option>Tạm ngưng</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Thể loại</label>
              <div className="genres-selector">
                {availableGenres.map(g => (
                  <button 
                    key={g} 
                    className={`genre-chip ${genres.includes(g) ? 'active' : ''}`}
                    onClick={() => toggleGenre(g)}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <div className="form-actions">
            <button className="cancel-btn">Hủy bỏ</button>
            <button className="save-btn"><Save size={20} /> Lưu và tiếp tục</button>
          </div>
        </div>

        <aside className="side-form">
          <div className="upload-card glass">
            <h3>Ảnh bìa</h3>
            <div className="cover-upload-area">
              {cover ? (
                <div className="cover-preview">
                  <img src={URL.createObjectURL(cover)} alt="Preview" />
                  <button className="remove-btn" onClick={() => setCover(null)}><X size={16} /></button>
                </div>
              ) : (
                <label className="upload-placeholder">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => setCover(e.target.files[0])} 
                    hidden 
                  />
                  <ImageIcon size={40} className="icon" />
                  <span>Tải ảnh lên</span>
                  <p>Hỗ trợ JPG, PNG (Tỉ lệ 2:3)</p>
                </label>
              )}
            </div>
          </div>

          <div className="info-card glass">
            <h4>Lưu ý khi đăng truyện</h4>
            <ul>
              <li>Đảm bảo nội dung không vi phạm bản quyền.</li>
              <li>Ảnh bìa nên có chất lượng cao (min 600x900px).</li>
              <li>Chọn đúng thể loại để người đọc dễ tìm kiếm.</li>
            </ul>
          </div>
        </aside>
      </div>

      <style jsx="true">{`
        .create-manga-page {
          padding: 120px 2rem 5rem;
        }

        .page-header {
          margin-bottom: 2.5rem;
        }

        .back-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-secondary);
          margin-bottom: 1rem;
          font-weight: 500;
        }

        .page-title { font-size: 2.5rem; font-weight: 800; }

        .create-grid {
          display: grid;
          grid-template-columns: 1fr 350px;
          gap: 2.5rem;
          align-items: start;
        }

        .main-form { padding: 3rem; border-radius: var(--radius-lg); }

        .form-section { margin-bottom: 3rem; }
        .form-section h3 { margin-bottom: 1.5rem; font-size: 1.25rem; color: var(--primary); }

        .form-group { margin-bottom: 1.5rem; display: flex; flex-direction: column; gap: 0.5rem; }
        .form-group label { font-weight: 600; font-size: 0.95rem; color: var(--text-secondary); }

        input, textarea, select {
          background: var(--bg-surface-elevated);
          border: 1px solid var(--border);
          padding: 0.85rem 1.25rem;
          border-radius: var(--radius-md);
          color: white;
          outline: none;
          transition: var(--transition);
        }

        input:focus, textarea:focus, select:focus { border-color: var(--primary); }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .genres-selector {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin-top: 0.5rem;
        }

        .genre-chip {
          padding: 0.5rem 1rem;
          border-radius: var(--radius-full);
          border: 1px solid var(--border);
          color: var(--text-secondary);
          font-size: 0.9rem;
          font-weight: 500;
        }

        .genre-chip.active {
          background: var(--primary);
          color: white;
          border-color: var(--primary);
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1.5rem;
          padding-top: 2rem;
          border-top: 1px solid var(--border);
        }

        .cancel-btn {
          color: var(--text-muted);
          font-weight: 600;
        }

        .save-btn {
          background: var(--primary);
          color: white;
          padding: 0.85rem 2rem;
          border-radius: var(--radius-md);
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .upload-card { padding: 2rem; border-radius: var(--radius-lg); margin-bottom: 1.5rem; }
        .upload-card h3 { margin-bottom: 1.5rem; font-size: 1.1rem; }

        .cover-upload-area {
          aspect-ratio: 2/3;
          border: 2px dashed var(--border);
          border-radius: var(--radius-md);
          overflow: hidden;
          transition: var(--transition);
        }

        .upload-placeholder {
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          cursor: pointer;
          padding: 2rem;
        }

        .upload-placeholder .icon { color: var(--text-muted); margin-bottom: 1rem; }
        .upload-placeholder p { font-size: 0.75rem; color: var(--text-muted); margin-top: 0.5rem; }

        .cover-preview { position: relative; height: 100%; }
        .cover-preview img { width: 100%; height: 100%; object-fit: cover; }
        .remove-btn {
          position: absolute; top: 10px; right: 10px;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          padding: 0.4rem;
          border-radius: var(--radius-full);
        }

        .info-card { padding: 1.5rem; border-radius: var(--radius-lg); }
        .info-card h4 { margin-bottom: 1rem; font-size: 1rem; }
        .info-card ul { padding-left: 1.25rem; display: flex; flex-direction: column; gap: 0.75rem; }
        .info-card li { font-size: 0.85rem; color: var(--text-secondary); list-style: disc; }

        @media (max-width: 1024px) {
          .create-grid { grid-template-columns: 1fr; }
          .side-form { order: -1; }
          .upload-card { max-width: 400px; margin: 0 auto 2rem; }
        }
      `}</style>
    </div>
  );
};

export default CreateManga;
