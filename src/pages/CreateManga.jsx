import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Image, Type, AlignLeft, User, List, CheckCircle, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const CreateManga = () => {
  const [formData, setFormData] = useState({
    title: '',
    otherTitle: '',
    description: '',
    author: '',
    genre: '',
    status: 'Đang tiến hành',
    type: 'Manhwa',
    coverImage: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Logic gửi dữ liệu tới API sẽ thêm ở đây
    setTimeout(() => {
      setLoading(false);
      alert('Tạo truyện thành công! (Dữ liệu mẫu)');
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="create-page">
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="create-card glass-card-premium"
        >
          <div className="card-header-vibrant">
            <button onClick={() => navigate(-1)} className="back-btn">
              <ArrowLeft size={20} />
            </button>
            <h1 className="page-title-vibrant">Tạo bộ truyện mới</h1>
          </div>

          <form onSubmit={handleSubmit} className="create-form">
            <div className="form-grid">
              {/* Cột trái: Ảnh bìa */}
              <div className="form-column image-upload-section">
                <div className="image-preview-container">
                  {formData.coverImage ? (
                    <img src={formData.coverImage} alt="Cover Preview" className="preview-img" />
                  ) : (
                    <div className="no-image">
                      <Image size={48} className="icon-muted" />
                      <span>Chưa có ảnh bìa</span>
                    </div>
                  )}
                </div>
                <div className="input-group">
                  <label>Link ảnh bìa</label>
                  <div className="input-wrapper">
                    <Image size={20} className="input-icon" />
                    <input 
                      type="url" 
                      placeholder="https://example.com/image.jpg"
                      value={formData.coverImage}
                      onChange={(e) => setFormData({...formData, coverImage: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              {/* Cột phải: Thông tin */}
              <div className="form-column info-section">
                <div className="input-group">
                  <label>Tên truyện <span className="required">*</span></label>
                  <div className="input-wrapper">
                    <Type size={20} className="input-icon" />
                    <input 
                      type="text" 
                      placeholder="Nhập tên bộ truyện..." 
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label>Tên gọi khác</label>
                  <div className="input-wrapper">
                    <Type size={20} className="input-icon" />
                    <input 
                      type="text" 
                      placeholder="Tên tiếng Anh, Hàn..."
                      value={formData.otherTitle}
                      onChange={(e) => setFormData({...formData, otherTitle: e.target.value})}
                    />
                  </div>
                </div>

                <div className="input-row">
                  <div className="input-group">
                    <label>Tác giả</label>
                    <div className="input-wrapper">
                      <User size={20} className="input-icon" />
                      <input 
                        type="text" 
                        placeholder="Tên tác giả"
                        value={formData.author}
                        onChange={(e) => setFormData({...formData, author: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="input-group">
                    <label>Thể loại <span className="required">*</span></label>
                    <div className="input-wrapper">
                      <List size={20} className="input-icon" />
                      <input 
                        type="text" 
                        placeholder="Hành động, Phiêu lưu..." 
                        required
                        value={formData.genre}
                        onChange={(e) => setFormData({...formData, genre: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <div className="input-row">
                  <div className="input-group">
                    <label>Trạng thái</label>
                    <select 
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="custom-select"
                    >
                      <option>Đang tiến hành</option>
                      <option>Hoàn thành</option>
                      <option>Tạm ngưng</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Loại truyện</label>
                    <select 
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                      className="custom-select"
                    >
                      <option>Manhwa</option>
                      <option>Manga</option>
                      <option>Manhua</option>
                      <option>Comic</option>
                    </select>
                  </div>
                </div>

                <div className="input-group">
                  <label>Giới thiệu truyện</label>
                  <div className="input-wrapper align-top">
                    <AlignLeft size={20} className="input-icon mt-2" />
                    <textarea 
                      placeholder="Nhập tóm tắt nội dung truyện..."
                      rows="5"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>

            <div className="form-footer">
              <button 
                type="submit" 
                className={`btn-submit-vibrant ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? 'Đang xử lý...' : (
                  <>
                    <CheckCircle size={20} /> Hoàn tất tạo truyện
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>

      <style jsx="true">{`
        .create-page {
          padding: 120px 0 60px;
          background: linear-gradient(135deg, #f8fafc, #eff6ff);
          min-height: 100vh;
        }

        .glass-card-premium {
          background: white;
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-xl);
          padding: 2.5rem;
          border: 1px solid var(--border);
        }

        .card-header-vibrant {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 3rem;
          border-bottom: 2px solid var(--bg-body);
          padding-bottom: 1.5rem;
        }

        .back-btn {
          color: var(--text-secondary);
          background: var(--bg-body);
          padding: 10px;
          border-radius: 50%;
        }

        .page-title-vibrant {
          font-size: 2rem;
          font-weight: 800;
          color: var(--text-primary);
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .create-form {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 3rem;
        }

        .image-preview-container {
          width: 100%;
          aspect-ratio: 2/3;
          background: var(--bg-body);
          border-radius: var(--radius-lg);
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px dashed var(--border);
          margin-bottom: 1.5rem;
        }

        .preview-img { width: 100%; height: 100%; object-fit: cover; }
        .no-image { display: flex; flex-direction: column; align-items: center; color: var(--text-muted); gap: 0.5rem; }

        .input-group { display: flex; flex-direction: column; gap: 0.75rem; width: 100%; }
        .input-group label { font-weight: 700; color: var(--text-primary); font-size: 0.95rem; }
        .required { color: #f43f5e; }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          background: var(--bg-body);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: 0 1rem;
          transition: var(--transition);
        }

        .input-wrapper:focus-within {
          border-color: var(--primary);
          background: white;
          box-shadow: 0 0 0 4px var(--primary-light);
        }

        .input-icon { color: var(--text-muted); }
        .input-wrapper input, .input-wrapper textarea {
          background: none;
          border: none;
          padding: 1rem 0.75rem;
          width: 100%;
          outline: none;
          color: var(--text-primary);
          font-weight: 500;
        }

        .input-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }

        .custom-select {
          background: var(--bg-body);
          border: 1px solid var(--border);
          padding: 1rem;
          border-radius: var(--radius-md);
          font-weight: 600;
          outline: none;
        }

        .form-footer {
          display: flex;
          justify-content: flex-end;
          padding-top: 2rem;
          border-top: 1px solid var(--border);
        }

        .btn-submit-vibrant {
          background: linear-gradient(135deg, var(--primary), var(--accent));
          color: white;
          padding: 1.25rem 3rem;
          border-radius: var(--radius-lg);
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          box-shadow: 0 10px 25px rgba(99, 102, 241, 0.3);
        }

        .btn-submit-vibrant:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 30px rgba(99, 102, 241, 0.4);
        }

        @media (max-width: 900px) {
          .form-grid { grid-template-columns: 1fr; }
          .image-upload-section { max-width: 300px; margin: 0 auto; }
        }
      `}</style>
    </div>
  );
};

export default CreateManga;
