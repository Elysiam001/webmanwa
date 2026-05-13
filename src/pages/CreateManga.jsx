import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookText, Image as ImageIcon, ArrowRight, ArrowLeft, 
  CheckCircle, Plus, Info, Sparkles 
} from 'lucide-react';
import { motion } from 'framer-motion';

const CreateManga = () => {
  const [step, setStep] = useState(1); // 1: Chọn loại, 2: Nhập thông tin
  const [storyType, setStoryType] = useState(null); // 'manga' hoặc 'novel'
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    author: '',
    genres: '',
    coverImage: ''
  });
  const navigate = useNavigate();

  const handleTypeSelect = (type) => {
    setStoryType(type);
    setStep(2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Đã tạo thành công ${storyType === 'manga' ? 'Truyện tranh' : 'Truyện chữ'}: ${formData.title}`);
    navigate('/dashboard');
  };

  return (
    <div className="create-container">
      <div className="container">
        {step === 1 ? (
          /* BƯỚC 1: CHỌN LOẠI TRUYỆN */
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="selection-hub"
          >
            <div className="hub-header">
              <h1 className="hub-title">Bạn muốn đăng loại truyện gì?</h1>
              <p className="hub-subtitle">Chọn định dạng phù hợp nhất với nội dung của bạn</p>
            </div>

            <div className="hub-grid">
              {/* Card Truyện Tranh */}
              <motion.div 
                whileHover={{ y: -10, scale: 1.02 }}
                onClick={() => handleTypeSelect('manga')}
                className="type-card manga-type"
              >
                <div className="type-icon-wrapper">
                  <ImageIcon size={48} />
                </div>
                <div className="type-info">
                  <h2>Truyện Tranh</h2>
                  <p>Manhwa, Manga, Manhua... Cho phép tải lên hình ảnh từng trang truyện.</p>
                </div>
                <div className="type-footer">
                  <span>Bắt đầu ngay</span>
                  <ArrowRight size={20} />
                </div>
                <div className="type-badge">Phổ biến</div>
              </motion.div>

              {/* Card Truyện Chữ */}
              <motion.div 
                whileHover={{ y: -10, scale: 1.02 }}
                onClick={() => handleTypeSelect('novel')}
                className="type-card novel-type"
              >
                <div className="type-icon-wrapper">
                  <BookText size={48} />
                </div>
                <div className="type-info">
                  <h2>Truyện Chữ / Tiểu thuyết</h2>
                  <p>Light Novel, Web Novel... Trình soạn thảo văn bản chuyên nghiệp.</p>
                </div>
                <div className="type-footer">
                  <span>Bắt đầu ngay</span>
                  <ArrowRight size={20} />
                </div>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          /* BƯỚC 2: NHẬP THÔNG TIN CHI TIẾT */
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="form-container-premium glass-card"
          >
            <div className="form-header-vibrant">
              <button onClick={() => setStep(1)} className="back-btn-hub">
                <ArrowLeft size={20} />
              </button>
              <div className="header-text">
                <h1>Thông tin {storyType === 'manga' ? 'Truyện tranh' : 'Truyện chữ'}</h1>
                <p>Hãy điền đầy đủ các thông tin bên dưới</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="vibrant-form">
              <div className="form-layout">
                {/* Ảnh bìa */}
                <div className="cover-upload-side">
                  <div className="cover-preview-box">
                    {formData.coverImage ? (
                      <img src={formData.coverImage} alt="Preview" />
                    ) : (
                      <div className="empty-preview">
                        <ImageIcon size={40} />
                        <span>Chưa có ảnh bìa</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="upload-options">
                    <label className="btn-upload-local">
                      <ImageIcon size={18} /> Tải ảnh từ máy
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileChange} 
                        hidden 
                      />
                    </label>
                    <div className="or-divider">hoặc</div>
                    <div className="input-group-hub">
                      <label>Dán link ảnh (URL)</label>
                      <input 
                        type="url" 
                        placeholder="https://..."
                        value={formData.coverImage}
                        onChange={(e) => setFormData({...formData, coverImage: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                {/* Thông tin chi tiết */}
                <div className="info-side">
                  <div className="input-group-hub">
                    <label>Tên truyện</label>
                    <input 
                      type="text" 
                      placeholder="Nhập tên truyện..."
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      required
                    />
                  </div>

                  <div className="input-row-hub">
                    <div className="input-group-hub">
                      <label>Tác giả</label>
                      <input 
                        type="text" 
                        placeholder="Tên tác giả"
                        value={formData.author}
                        onChange={(e) => setFormData({...formData, author: e.target.value})}
                      />
                    </div>
                    <div className="input-group-hub">
                      <label>Thể loại</label>
                      <input 
                        type="text" 
                        placeholder="Hành động, Tình cảm..."
                        value={formData.genres}
                        onChange={(e) => setFormData({...formData, genres: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="input-group-hub">
                    <label>Tóm tắt nội dung</label>
                    <textarea 
                      rows="6" 
                      placeholder="Mô tả ngắn gọn về cốt truyện..."
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                    ></textarea>
                  </div>

                  {storyType === 'manga' && (
                    <div className="manga-notice glass">
                      <Info size={18} />
                      <p>Sau khi tạo truyện, bạn có thể tải lên các chương truyện dưới dạng tệp ảnh.</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="form-footer-hub">
                <button type="submit" className="btn-create-vibrant">
                  <Plus size={20} /> Tạo {storyType === 'manga' ? 'Truyện tranh' : 'Truyện chữ'}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </div>

      <style jsx="true">{`
        .create-container {
          padding: 120px 0 80px;
          min-height: 100vh;
          background: #f8fafc;
        }

        /* Hub Styles */
        .selection-hub {
          max-width: 900px;
          margin: 0 auto;
          text-align: center;
        }

        .hub-header { margin-bottom: 4rem; }
        .hub-title { font-size: 2.5rem; font-weight: 800; color: var(--text-primary); margin-bottom: 1rem; }
        .hub-subtitle { color: var(--text-secondary); font-size: 1.1rem; }

        .hub-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2.5rem;
        }

        .type-card {
          background: white;
          padding: 3rem 2rem;
          border-radius: var(--radius-xl);
          border: 2px solid transparent;
          box-shadow: var(--shadow-lg);
          cursor: pointer;
          position: relative;
          text-align: left;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          transition: var(--transition);
        }

        .manga-type:hover { border-color: var(--primary); }
        .novel-type:hover { border-color: var(--accent); }

        .type-icon-wrapper {
          width: 80px;
          height: 80px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .manga-type .type-icon-wrapper { background: linear-gradient(135deg, var(--primary), var(--accent)); }
        .novel-type .type-icon-wrapper { background: linear-gradient(135deg, #f43f5e, #fb923c); }

        .type-info h2 { font-size: 1.5rem; font-weight: 800; margin-bottom: 0.75rem; }
        .type-info p { color: var(--text-secondary); line-height: 1.6; }

        .type-footer {
          margin-top: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-weight: 700;
          color: var(--text-primary);
        }

        .type-badge {
          position: absolute;
          top: 20px;
          right: 20px;
          background: var(--primary);
          color: white;
          padding: 4px 12px;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 700;
        }

        /* Form Styles */
        .form-container-premium {
          max-width: 1000px;
          margin: 0 auto;
          padding: 3rem;
          background: white;
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-xl);
        }

        .form-header-vibrant {
          display: flex;
          align-items: center;
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .back-btn-hub {
          background: var(--bg-body);
          color: var(--text-secondary);
          padding: 12px;
          border-radius: 50%;
        }

        .header-text h1 { font-size: 2rem; font-weight: 800; background: linear-gradient(135deg, var(--primary), var(--secondary)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }

        .form-layout {
          display: grid;
          grid-template-columns: 320px 1fr;
          gap: 3rem;
        }

        .cover-preview-box {
          width: 100%;
          aspect-ratio: 2/3;
          background: var(--bg-body);
          border-radius: var(--radius-lg);
          border: 2px dashed var(--border);
          overflow: hidden;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cover-preview-box img { width: 100%; height: 100%; object-fit: cover; }
        .empty-preview { text-align: center; color: var(--text-muted); display: flex; flex-direction: column; gap: 0.5rem; }

        .upload-options {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .btn-upload-local {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          background: white;
          border: 2px solid var(--primary);
          color: var(--primary);
          padding: 0.75rem;
          border-radius: var(--radius-md);
          font-weight: 700;
          cursor: pointer;
          transition: var(--transition);
        }

        .btn-upload-local:hover {
          background: var(--primary-light);
        }

        .or-divider {
          text-align: center;
          position: relative;
          color: var(--text-muted);
          font-size: 0.85rem;
          font-weight: 600;
        }

        .or-divider::before, .or-divider::after {
          content: '';
          position: absolute;
          top: 50%;
          width: 35%;
          height: 1px;
          background: var(--border);
        }

        .or-divider::before { left: 0; }
        .or-divider::after { right: 0; }

        .input-group-hub { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1.5rem; }
        .input-group-hub label { font-weight: 700; font-size: 0.95rem; }
        .input-group-hub input, .input-group-hub textarea {
          background: var(--bg-body);
          border: 1px solid var(--border);
          padding: 1rem;
          border-radius: var(--radius-md);
          outline: none;
          font-weight: 500;
        }

        .input-group-hub input:focus { border-color: var(--primary); background: white; }

        .input-row-hub { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }

        .manga-notice {
          padding: 1rem;
          background: var(--primary-light);
          border: 1px solid rgba(99, 102, 241, 0.2);
          border-radius: var(--radius-md);
          display: flex;
          gap: 1rem;
          color: var(--primary);
          font-weight: 500;
          font-size: 0.9rem;
        }

        .form-footer-hub {
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid var(--border);
          display: flex;
          justify-content: flex-end;
        }

        .btn-create-vibrant {
          background: linear-gradient(135deg, var(--primary), var(--accent));
          color: white;
          padding: 1rem 3rem;
          border-radius: var(--radius-lg);
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          box-shadow: 0 10px 25px rgba(99, 102, 241, 0.3);
        }

        @media (max-width: 900px) {
          .hub-grid { grid-template-columns: 1fr; }
          .form-layout { grid-template-columns: 1fr; }
          .cover-upload-side { max-width: 320px; margin: 0 auto; }
        }
      `}</style>
    </div>
  );
};

export default CreateManga;
