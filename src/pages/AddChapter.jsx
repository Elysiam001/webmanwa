import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Upload, X, Grid, List, Eye, Save, ChevronLeft, Move, Loader2, Book, Plus } from 'lucide-react';
import { motion, Reorder } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const AddChapter = () => {
  const { token } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [chapterInfo, setChapterInfo] = useState({ number: '', title: '' });
  const [loading, setLoading] = useState(false);
  const [mangaTitle, setMangaTitle] = useState('Đang tải...');

  useEffect(() => {
    // Fetch manga info if needed, or just keep it simple for now
    setMangaTitle('Tác phẩm của bạn');
  }, [id]);

  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Giới hạn chiều rộng tối đa 1200px để tối ưu dung lượng
          const MAX_WIDTH = 1200;
          if (width > MAX_WIDTH) {
            height = (MAX_WIDTH / width) * height;
            width = MAX_WIDTH;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          // Nén chất lượng xuống 0.7 (70%) để cân bằng giữa nét và nhẹ
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
          resolve(compressedBase64);
        };
      };
    });
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    setLoading(true); // Hiển thị loading trong lúc nén ảnh
    
    try {
      const newImages = await Promise.all(files.map(async (file) => {
        const compressedBase64 = await compressImage(file);
        return {
          id: Math.random().toString(36).substr(2, 9),
          url: compressedBase64,
          name: file.name
        };
      }));
      setImages([...images, ...newImages]);
    } catch (err) {
      alert('Lỗi khi xử lý ảnh');
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (imgId) => {
    setImages(images.filter(img => img.id !== imgId));
  };

  const handleSave = async () => {
    if (!chapterInfo.number) return alert('Vui lòng nhập số chương!');
    if (images.length === 0) return alert('Vui lòng tải lên ít nhất 1 ảnh!');

    setLoading(true);
    try {
      const res = await fetch(`/api/manga/${id}/chapters`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({
          number: chapterInfo.number,
          title: chapterInfo.title,
          images: images.map(img => img.url)
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Lỗi khi đăng chương');

      alert(`Đã đăng thành công chương ${chapterInfo.number}!`);
      navigate('/dashboard');
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-chapter-page">
      <div className="container">
        <header className="page-header-vibrant">
          <button onClick={() => navigate('/dashboard')} className="back-btn-dash">
            <ChevronLeft size={20} /> Quay lại quản lý
          </button>
          <div className="header-titles">
            <h1 className="page-title">Đăng chương mới</h1>
            <p className="manga-ref">Dành cho: <span className="highlight-text">{mangaTitle}</span></p>
          </div>
        </header>

        <div className="chapter-content-grid">
          <div className="main-form-side">
            <section className="info-section-dash glass-card">
              <div className="section-title">
                <Book size={20} />
                <h3>Thông tin chương</h3>
              </div>
              <div className="form-row-dash">
                <div className="input-group-dash">
                  <label>Chương số *</label>
                  <input 
                    type="number" 
                    placeholder="Ví dụ: 1" 
                    value={chapterInfo.number}
                    onChange={(e) => setChapterInfo({...chapterInfo, number: e.target.value})}
                  />
                </div>
                <div className="input-group-dash">
                  <label>Tên chương (không bắt buộc)</label>
                  <input 
                    type="text" 
                    placeholder="Ví dụ: Khởi đầu mới..." 
                    value={chapterInfo.title}
                    onChange={(e) => setChapterInfo({...chapterInfo, title: e.target.value})}
                  />
                </div>
              </div>
            </section>

            <section className="upload-section-dash glass-card">
              <div className="section-header-dash">
                <div className="section-title">
                  <Upload size={20} />
                  <h3>Nội dung chương</h3>
                </div>
                <span className="image-count">{images.length} trang đã tải</span>
              </div>
              
              <label className="dropzone-vibrant">
                <input type="file" multiple accept="image/*" onChange={handleFileChange} hidden />
                <div className="dropzone-content">
                  <div className="icon-circle">
                    <Plus size={32} />
                  </div>
                  <h4>Tải lên các trang truyện</h4>
                  <p>Hỗ trợ JPG, PNG, WEBP. Bạn có thể chọn nhiều ảnh cùng lúc.</p>
                </div>
              </label>

              {images.length > 0 && (
                <div className="image-reorder-list">
                  <div className="reorder-header">
                    <span>Kéo thả để sắp xếp thứ tự các trang</span>
                  </div>
                  <Reorder.Group axis="y" values={images} onReorder={setImages} className="images-container">
                    {images.map((img, index) => (
                      <Reorder.Item key={img.id} value={img} className="reorder-item">
                        <div className="item-main">
                          <Move size={18} className="drag-icon" />
                          <span className="page-index">Trang {index + 1}</span>
                          <img src={img.url} alt="" className="thumb-preview" />
                          <span className="file-name-text">{img.name}</span>
                        </div>
                        <button className="remove-img-btn" onClick={() => removeImage(img.id)}>
                          <X size={18} />
                        </button>
                      </Reorder.Item>
                    ))}
                  </Reorder.Group>
                </div>
              )}
            </section>

            <div className="sticky-actions">
              <div className="actions-inner glass-card">
                <p className="actions-info">Đảm bảo các trang đã đúng thứ tự trước khi đăng.</p>
                <div className="action-btns">
                  <button className="btn-preview-dash" disabled={images.length === 0}>
                    <Eye size={20} /> Xem trước
                  </button>
                  <button 
                    className="btn-save-dash" 
                    onClick={handleSave}
                    disabled={loading || images.length === 0}
                  >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                    <span>{loading ? 'Đang đăng...' : 'Đăng chương ngay'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <aside className="sidebar-tips">
            <div className="tip-card glass-card">
              <h4>Mẹo đăng truyện</h4>
              <ul className="tip-list">
                <li><strong>Thứ tự:</strong> Các trang sẽ hiển thị từ trên xuống dưới theo danh sách bên cạnh.</li>
                <li><strong>Dung lượng:</strong> Mỗi ảnh nên dưới 2MB để người đọc load nhanh hơn.</li>
                <li><strong>Số chương:</strong> Nếu bạn đăng chương lẻ (như 1.5), hãy nhập 1.5.</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>

      <style jsx="true">{`
        .add-chapter-page { padding: 120px 0 100px; background: #f8fafc; min-height: 100vh; }
        .page-header-vibrant { display: flex; align-items: center; gap: 2rem; margin-bottom: 3rem; }
        .back-btn-dash { background: white; color: var(--text-secondary); padding: 10px 15px; border-radius: var(--radius-md); box-shadow: var(--shadow-sm); display: flex; align-items: center; gap: 0.5rem; font-weight: 700; }
        .page-title { font-size: 2.25rem; font-weight: 800; color: var(--text-primary); }
        .manga-ref { color: var(--text-secondary); font-size: 1.1rem; }
        .highlight-text { color: var(--primary); font-weight: 700; }

        .chapter-content-grid { display: grid; grid-template-columns: 1fr 320px; gap: 2.5rem; }
        .section-title { display: flex; align-items: center; gap: 0.75rem; color: var(--text-primary); margin-bottom: 1.5rem; }
        .section-title h3 { font-size: 1.25rem; font-weight: 800; }
        .section-title svg { color: var(--primary); }

        .info-section-dash, .upload-section-dash { padding: 2rem; margin-bottom: 2rem; }
        .form-row-dash { display: grid; grid-template-columns: 150px 1fr; gap: 1.5rem; }
        .input-group-dash { display: flex; flex-direction: column; gap: 0.5rem; }
        .input-group-dash label { font-weight: 700; font-size: 0.9rem; color: var(--text-secondary); }
        .input-group-dash input { padding: 0.85rem; border: 1px solid var(--border); border-radius: 10px; outline: none; transition: var(--transition); background: #f8fafc; }
        .input-group-dash input:focus { border-color: var(--primary); background: white; box-shadow: 0 0 0 4px var(--primary-light); }

        .section-header-dash { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
        .image-count { background: var(--primary-light); color: var(--primary); padding: 4px 12px; border-radius: var(--radius-full); font-weight: 700; font-size: 0.85rem; }

        .dropzone-vibrant { display: block; background: white; border: 2px dashed var(--border); border-radius: 15px; padding: 3rem; cursor: pointer; transition: var(--transition); }
        .dropzone-vibrant:hover { border-color: var(--primary); background: var(--primary-light); }
        .dropzone-content { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 1rem; }
        .icon-circle { width: 64px; height: 64px; background: var(--primary); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 16px rgba(99, 102, 241, 0.2); }
        .dropzone-content h4 { font-weight: 800; font-size: 1.1rem; }
        .dropzone-content p { color: var(--text-muted); font-size: 0.9rem; }

        .image-reorder-list { margin-top: 2rem; border-top: 1px solid var(--border); padding-top: 2rem; }
        .reorder-header { margin-bottom: 1.5rem; font-weight: 700; color: var(--text-secondary); font-size: 0.9rem; }
        .images-container { display: flex; flex-direction: column; gap: 0.75rem; }
        .reorder-item { background: white; border: 1px solid var(--border); padding: 1rem; border-radius: 12px; display: flex; align-items: center; justify-content: space-between; cursor: move; }
        .item-main { display: flex; align-items: center; gap: 1.5rem; }
        .drag-icon { color: var(--text-muted); }
        .page-index { font-weight: 800; color: var(--primary); min-width: 60px; }
        .thumb-preview { width: 50px; height: 70px; object-fit: cover; border-radius: 4px; border: 1px solid var(--border); }
        .file-name-text { font-size: 0.9rem; color: var(--text-secondary); font-weight: 600; }
        .remove-img-btn { color: var(--text-muted); padding: 8px; border-radius: 50%; }
        .remove-img-btn:hover { background: #fff1f2; color: #f43f5e; }

        .sticky-actions { position: sticky; bottom: 2rem; z-index: 100; margin-top: 3rem; }
        .actions-inner { padding: 1.5rem 2rem; display: flex; align-items: center; justify-content: space-between; background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(10px); }
        .actions-info { font-size: 0.9rem; color: var(--text-secondary); font-weight: 500; }
        .action-btns { display: flex; gap: 1rem; }
        .btn-preview-dash { padding: 0.85rem 1.5rem; border-radius: 12px; font-weight: 700; color: var(--text-primary); border: 2px solid var(--border); display: flex; align-items: center; gap: 0.5rem; }
        .btn-save-dash { background: var(--primary); color: white; padding: 0.85rem 2rem; border-radius: 12px; font-weight: 700; display: flex; align-items: center; gap: 0.75rem; box-shadow: 0 8px 20px rgba(99, 102, 241, 0.3); }
        .btn-save-dash:disabled { opacity: 0.6; cursor: not-allowed; }

        .tip-card { padding: 1.5rem; }
        .tip-card h4 { font-weight: 800; margin-bottom: 1rem; color: var(--text-primary); }
        .tip-list { display: flex; flex-direction: column; gap: 1rem; }
        .tip-list li { font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5; }

        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        @media (max-width: 1024px) {
          .chapter-content-grid { grid-template-columns: 1fr; }
          .sidebar-tips { display: none; }
          .form-row-dash { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default AddChapter;
