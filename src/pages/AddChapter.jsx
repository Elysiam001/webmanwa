import { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Upload, X, Grid, List, Eye, Save, ChevronLeft, Move } from 'lucide-react';
import { motion, Reorder } from 'framer-motion';

const AddChapter = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [chapterInfo, setChapterInfo] = useState({ number: '', title: '' });

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file, index) => ({
      id: Math.random().toString(36).substr(2, 9),
      url: URL.createObjectURL(file),
      name: file.name
    }));
    setImages([...images, ...newImages]);
  };

  const removeImage = (imgId) => {
    setImages(images.filter(img => img.id !== imgId));
  };

  return (
    <div className="add-chapter-page container">
      <header className="page-header">
        <button onClick={() => navigate(-1)} className="back-link">
          <ChevronLeft size={20} /> Quay lại quản lý truyện
        </button>
        <h1 className="page-title">Thêm chương mới</h1>
      </header>

      <div className="chapter-grid">
        <div className="chapter-form glass">
          <section className="form-section">
            <h3>Thông tin chương</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Số chương *</label>
                <input 
                  type="number" 
                  placeholder="Ví dụ: 1" 
                  value={chapterInfo.number}
                  onChange={(e) => setChapterInfo({...chapterInfo, number: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Tên chương (tùy chọn)</label>
                <input 
                  type="text" 
                  placeholder="Ví dụ: Khởi đầu mới..." 
                  value={chapterInfo.title}
                  onChange={(e) => setChapterInfo({...chapterInfo, title: e.target.value})}
                />
              </div>
            </div>
          </section>

          <section className="upload-section">
            <div className="section-header">
              <h3>Tải lên trang truyện</h3>
              <span className="count">{images.length} ảnh đã chọn</span>
            </div>
            
            <label className="dropzone-area glass">
              <input type="file" multiple accept="image/*" onChange={handleFileChange} hidden />
              <Upload size={40} className="icon" />
              <h4>Kéo thả hoặc click để tải ảnh lên</h4>
              <p>Hỗ trợ tải hàng loạt ảnh (JPG, PNG, WEBP)</p>
            </label>

            <div className="image-manager">
              <div className="manager-header">
                <h4>Sắp xếp trang</h4>
                <div className="view-toggle">
                  <button className="active"><Grid size={18} /></button>
                  <button><List size={18} /></button>
                </div>
              </div>

              <Reorder.Group axis="y" values={images} onReorder={setImages} className="image-list">
                {images.map((img, index) => (
                  <Reorder.Item key={img.id} value={img} className="image-item glass">
                    <div className="item-left">
                      <Move size={18} className="drag-handle" />
                      <span className="page-num">Trang {index + 1}</span>
                      <img src={img.url} alt="" className="item-thumb" />
                      <span className="file-name">{img.name}</span>
                    </div>
                    <button className="remove-btn" onClick={() => removeImage(img.id)}>
                      <X size={18} />
                    </button>
                  </Reorder.Item>
                ))}
              </Reorder.Group>
            </div>
          </section>

          <div className="form-actions">
            <button className="preview-btn glass"><Eye size={20} /> Preview</button>
            <button className="save-btn"><Save size={20} /> Đăng chương</button>
          </div>
        </div>

        <aside className="chapter-sidebar">
          <div className="info-card glass">
            <h4>Mẹo nhỏ</h4>
            <ul>
              <li>Bạn có thể kéo thả để thay đổi thứ tự các trang.</li>
              <li>Nên đặt tên file theo số thứ tự (01, 02...) để tự động sắp xếp.</li>
              <li>Dung lượng mỗi ảnh không nên quá 2MB để load nhanh.</li>
            </ul>
          </div>
        </aside>
      </div>

      <style jsx="true">{`
        .add-chapter-page { padding: 120px 2rem 5rem; }
        .page-header { margin-bottom: 2.5rem; }
        .back-link { display: flex; align-items: center; gap: 0.5rem; color: var(--text-secondary); margin-bottom: 1rem; font-weight: 500; }
        .page-title { font-size: 2.5rem; font-weight: 800; }

        .chapter-grid { display: grid; grid-template-columns: 1fr 350px; gap: 2.5rem; align-items: start; }
        .chapter-form { padding: 3rem; border-radius: var(--radius-lg); }

        .form-section { margin-bottom: 3rem; }
        .form-section h3 { margin-bottom: 1.5rem; font-size: 1.25rem; color: var(--primary); }

        .form-group { margin-bottom: 1.5rem; display: flex; flex-direction: column; gap: 0.5rem; }
        .form-group label { font-weight: 600; font-size: 0.95rem; color: var(--text-secondary); }

        input { background: var(--bg-surface-elevated); border: 1px solid var(--border); padding: 0.85rem 1.25rem; border-radius: var(--radius-md); color: white; outline: none; }
        input:focus { border-color: var(--primary); }

        .form-row { display: grid; grid-template-columns: 1fr 2fr; gap: 1.5rem; }

        .upload-section { margin-bottom: 3rem; }
        .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
        .count { color: var(--text-muted); font-size: 0.9rem; }

        .dropzone-area {
          border: 2px dashed var(--border);
          border-radius: var(--radius-lg);
          padding: 3rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          cursor: pointer;
          transition: var(--transition);
        }

        .dropzone-area:hover { border-color: var(--primary); background: rgba(139, 92, 246, 0.05); }
        .dropzone-area .icon { color: var(--text-muted); margin-bottom: 1rem; }
        .dropzone-area h4 { margin-bottom: 0.5rem; }
        .dropzone-area p { font-size: 0.85rem; color: var(--text-muted); }

        .image-manager { margin-top: 3rem; }
        .manager-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
        .view-toggle { display: flex; background: var(--bg-surface-elevated); padding: 0.25rem; border-radius: var(--radius-sm); }
        .view-toggle button { padding: 0.4rem; border-radius: var(--radius-sm); color: var(--text-muted); }
        .view-toggle button.active { background: var(--bg-surface); color: var(--primary); }

        .image-list { display: flex; flex-direction: column; gap: 0.75rem; }
        .image-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 1.25rem;
          border-radius: var(--radius-md);
        }

        .item-left { display: flex; align-items: center; gap: 1.25rem; }
        .drag-handle { color: var(--text-muted); cursor: grab; }
        .page-num { font-weight: 700; color: var(--primary); font-size: 0.9rem; min-width: 60px; }
        .item-thumb { width: 50px; height: 70px; object-fit: cover; border-radius: 4px; }
        .file-name { font-size: 0.9rem; color: var(--text-secondary); }

        .remove-btn { color: var(--text-muted); }
        .remove-btn:hover { color: #ef4444; }

        .form-actions { display: flex; justify-content: flex-end; gap: 1.5rem; padding-top: 2rem; border-top: 1px solid var(--border); }
        .preview-btn { padding: 0.85rem 2rem; border-radius: var(--radius-md); font-weight: 600; color: white; display: flex; align-items: center; gap: 0.75rem; }
        .save-btn { background: var(--primary); color: white; padding: 0.85rem 2rem; border-radius: var(--radius-md); font-weight: 700; display: flex; align-items: center; gap: 0.75rem; }

        .info-card { padding: 1.5rem; border-radius: var(--radius-lg); }
        .info-card h4 { margin-bottom: 1rem; }
        .info-card li { font-size: 0.85rem; color: var(--text-secondary); list-style: disc; margin-left: 1rem; margin-bottom: 0.5rem; }

        @media (max-width: 1024px) {
          .chapter-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default AddChapter;
