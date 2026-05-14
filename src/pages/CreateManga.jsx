import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  BookText, Image as ImageIcon, ArrowRight, ArrowLeft, 
  CheckCircle, Plus, Info, Sparkles, Loader2 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const CreateManga = () => {
  const { user, token } = useAuth();
  const [step, setStep] = useState(1);
  const [storyType, setStoryType] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    otherTitle: '',
    description: '',
    author: '',
    genres: '',
    coverImage: ''
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [myManga, setMyManga] = useState([]);
  const [loadingManga, setLoadingManga] = useState(true);

  useEffect(() => {
    const fetchMyManga = async () => {
      if (!token) return;
      try {
        const res = await fetch('/api/manga/user', {
          headers: { 'x-auth-token': token },
          cache: 'no-store' // Ép trình duyệt không dùng cache cũ
        });
        const data = await res.json();
        console.log('--- DEBUG FRONTEND ---');
        console.log('Mã ID Server nhận được:', data.debug?.serverReceivedId);
        
        if (res.ok) {
          setMyManga(data.mangas || []);
        }
      } catch (err) {
        console.error('Lỗi tải truyện:', err);
      } finally {
        setLoadingManga(false);
      }
    };
    fetchMyManga();
  }, [token]);

  const handleTypeSelect = (type) => {
    setStoryType(type);
    setStep(2);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        return alert('Ảnh quá lớn! Vui lòng chọn ảnh dưới 5MB.');
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, coverImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.coverImage) {
      return alert('Vui lòng tải lên hoặc dán link ảnh bìa!');
    }

    setLoading(true);
    console.log('🚀 Đang gửi dữ liệu tạo truyện...');
    
    try {
      if (!token) {
        throw new Error('Bạn chưa đăng nhập. Vui lòng đăng nhập lại!');
      }

      const res = await fetch('/api/manga', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({
          title: formData.title,
          otherTitle: formData.otherTitle,
          description: formData.description,
          author: formData.author,
          cover: formData.coverImage,
          genres: formData.genres,
          type: storyType === 'manga' ? 'Manhwa' : 'Novel'
        })
      });

      let data;
      try {
        data = await res.json();
      } catch (jsonErr) {
        throw new Error('Server gặp lỗi hệ thống (Phản hồi không phải JSON)');
      }

      if (!res.ok) {
        throw new Error(data.message || `Lỗi từ Server: ${res.status}`);
      }

      console.log('✅ Tạo truyện thành công:', data);
      alert(`Đã tạo thành công tác phẩm: ${data.title}`);
      navigate('/dashboard');
    } catch (err) {
      console.error('❌ Lỗi khi tạo truyện:', err);
      alert('LỖI: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-container">
      <div className="container">
        {step === 1 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="selection-hub"
          >
            <div className="hub-header">
              <h1 className="hub-title">Trung tâm Sáng tác</h1>
              <p className="hub-subtitle">Bắt đầu hành trình trở thành tác giả chuyên nghiệp</p>
            </div>

            <div className="hub-grid">
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

            {/* PHẦN TÁC PHẨM ĐÃ TẠO */}
            <div className="my-works-section">
              <div className="section-divider">
                <span>HOẶC TIẾP TỤC VỚI</span>
              </div>
              <div className="section-header-hub">
                <h2 className="section-title-hub">Tác phẩm của bạn</h2>
                {user && <span className="debug-id-badge">ID người dùng: {user.id}</span>}
              </div>
              
              {loadingManga ? (
                <div className="loading-works">
                  <Loader2 className="animate-spin" size={24} />
                  <span>Đang tải danh sách tác phẩm...</span>
                </div>
              ) : myManga.length > 0 ? (
                <div className="works-list-hub">
                  {myManga.map(m => (
                    <div key={m._id} className="work-item-hub glass-card">
                      <img src={m.cover} alt="" className="work-thumb" />
                      <div className="work-details">
                        <h3>{m.title}</h3>
                        <p>{m.type} • {m.chapterCount || 0} chương</p>
                      </div>
                      <Link to={`/dashboard/add-chapter/${m._id}`} className="btn-add-ch-hub">
                        <Plus size={16} /> Thêm chương
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-works-hub">
                  <p>Bạn chưa có tác phẩm nào hiển thị ở đây. Hãy thử tạo truyện mới nhé!</p>
                  
                  {/* BẢNG DEBUG CÔNG KHAI - CHỈ HIỆN KHI KHÔNG CÓ TRUYỆN */}
                  <div className="public-debug-table">
                    <h4>CÔNG CỤ KIỂM TRA HỆ THỐNG (TẠM THỜI)</h4>
                    <p>Nếu bạn thấy truyện của mình hiện ở bảng dưới này mà không hiện ở trên, hãy báo cho tôi mã uploader của nó.</p>
                    <iframe 
                      src="/api/manga/debug/all" 
                      style={{ width: '100%', height: '150px', border: '1px solid #ddd', borderRadius: '8px', background: '#f8f9fa', padding: '10px' }}
                    />
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="form-container-premium"
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

                <div className="info-side">
                  <div className="input-group-hub">
                    <label>Tên truyện *</label>
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
                      <label>Thể loại *</label>
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
                    <div className="manga-notice">
                      <Info size={18} />
                      <p>Sau khi tạo truyện, bạn có thể tải lên các chương truyện dưới dạng tệp ảnh.</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="form-footer-hub">
                <button type="submit" className="btn-create-vibrant" disabled={loading}>
                  {loading ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
                  <span>{loading ? 'Đang tạo...' : `Tạo ${storyType === 'manga' ? 'Truyện tranh' : 'Truyện chữ'}`}</span>
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </div>

      <style jsx="true">{`
        .create-container { padding: 120px 0 80px; min-height: 100vh; background: #f8fafc; }
        .selection-hub { max-width: 900px; margin: 0 auto; text-align: center; }
        .hub-header { margin-bottom: 4rem; }
        .hub-title { font-size: 2.5rem; font-weight: 800; color: var(--text-primary); margin-bottom: 1rem; }
        .hub-subtitle { color: var(--text-secondary); font-size: 1.1rem; }
        .hub-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2.5rem; }
        .type-card { background: white; padding: 3rem 2rem; border-radius: var(--radius-xl); border: 2px solid transparent; box-shadow: var(--shadow-lg); cursor: pointer; position: relative; text-align: left; display: flex; flex-direction: column; gap: 1.5rem; transition: var(--transition); }
        .manga-type:hover { border-color: var(--primary); }
        .novel-type:hover { border-color: var(--accent); }
        .type-icon-wrapper { width: 80px; height: 80px; border-radius: 20px; display: flex; align-items: center; justify-content: center; color: white; }
        .manga-type .type-icon-wrapper { background: linear-gradient(135deg, var(--primary), var(--accent)); }
        .novel-type .type-icon-wrapper { background: linear-gradient(135deg, #f43f5e, #fb923c); }
        .type-info h2 { font-size: 1.5rem; font-weight: 800; margin-bottom: 0.75rem; }
        .type-info p { color: var(--text-secondary); line-height: 1.6; }
        .type-footer { margin-top: auto; display: flex; align-items: center; justify-content: space-between; font-weight: 700; color: var(--text-primary); }
        .type-badge { position: absolute; top: 20px; right: 20px; background: var(--primary); color: white; padding: 4px 12px; border-radius: var(--radius-full); font-size: 0.75rem; font-weight: 700; }
        
        .form-container-premium { max-width: 1000px; margin: 0 auto; padding: 3rem; background: white; border-radius: var(--radius-xl); box-shadow: var(--shadow-xl); }
        .form-header-vibrant { display: flex; align-items: center; gap: 2rem; margin-bottom: 3rem; }
        .back-btn-hub { background: var(--bg-body); color: var(--text-secondary); padding: 12px; border-radius: 50%; }
        .header-text h1 { font-size: 2rem; font-weight: 800; background: linear-gradient(135deg, var(--primary), var(--secondary)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .form-layout { display: grid; grid-template-columns: 320px 1fr; gap: 3rem; }
        .cover-preview-box { width: 100%; aspect-ratio: 2/3; background: var(--bg-body); border-radius: var(--radius-lg); border: 2px dashed var(--border); overflow: hidden; margin-bottom: 1.5rem; display: flex; align-items: center; justify-content: center; }
        .cover-preview-box img { width: 100%; height: 100%; object-fit: cover; }
        .empty-preview { text-align: center; color: var(--text-muted); display: flex; flex-direction: column; gap: 0.5rem; }
        .upload-options { display: flex; flex-direction: column; gap: 1rem; }
        .btn-upload-local { display: flex; align-items: center; justify-content: center; gap: 0.75rem; background: white; border: 2px solid var(--primary); color: var(--primary); padding: 0.75rem; border-radius: var(--radius-md); font-weight: 700; cursor: pointer; transition: var(--transition); }
        .or-divider { text-align: center; position: relative; color: var(--text-muted); font-size: 0.85rem; font-weight: 600; }
        .or-divider::before, .or-divider::after { content: ''; position: absolute; top: 50%; width: 35%; height: 1px; background: var(--border); }
        .or-divider::before { left: 0; } .or-divider::after { right: 0; }
        .input-group-hub { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1.5rem; }
        .input-group-hub label { font-weight: 700; font-size: 0.95rem; }
        .input-group-hub input, .input-group-hub textarea { background: var(--bg-body); border: 1px solid var(--border); padding: 1rem; border-radius: var(--radius-md); outline: none; font-weight: 500; }
        .input-row-hub { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
        .manga-notice { padding: 1rem; background: var(--primary-light); border: 1px solid rgba(99, 102, 241, 0.2); border-radius: var(--radius-md); display: flex; gap: 1rem; color: var(--primary); font-weight: 500; font-size: 0.9rem; }
        .form-footer-hub { margin-top: 2rem; padding-top: 2rem; border-top: 1px solid var(--border); display: flex; justify-content: flex-end; }
        .btn-create-vibrant { background: linear-gradient(135deg, var(--primary), var(--accent)); color: white; padding: 1rem 3rem; border-radius: var(--radius-lg); font-weight: 800; display: flex; align-items: center; gap: 0.75rem; box-shadow: 0 10px 25px rgba(99, 102, 241, 0.3); }
        .btn-create-vibrant:disabled { opacity: 0.7; cursor: not-allowed; }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        .my-works-section { margin-top: 5rem; text-align: left; }
        .section-header-hub { display: flex; align-items: center; justify-content: space-between; margin-bottom: 2rem; }
        .debug-id-badge { background: #f1f5f9; color: #64748b; padding: 4px 10px; border-radius: 6px; font-size: 0.7rem; font-family: monospace; }
        .section-divider { display: flex; align-items: center; gap: 1rem; color: var(--text-muted); font-weight: 800; font-size: 0.75rem; margin-bottom: 2rem; }
        .section-divider::before, .section-divider::after { content: ''; flex: 1; height: 1px; background: var(--border); }
        .section-title-hub { font-size: 1.75rem; font-weight: 800; color: var(--text-primary); margin: 0; }
        .works-list-hub { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }
        .work-item-hub { display: flex; align-items: center; gap: 1rem; padding: 1rem; border-radius: 16px; transition: var(--transition); }
        .work-item-hub:hover { transform: translateY(-5px); border-color: var(--primary); }
        .work-thumb { width: 50px; height: 70px; object-fit: cover; border-radius: 8px; }
        .work-details { flex: 1; }
        .work-details h3 { font-size: 1rem; font-weight: 800; margin-bottom: 0.25rem; }
        .work-details p { font-size: 0.85rem; color: var(--text-secondary); }
        .btn-add-ch-hub { background: var(--primary-light); color: var(--primary); padding: 0.5rem 1rem; border-radius: 10px; font-size: 0.85rem; font-weight: 700; display: flex; align-items: center; gap: 0.4rem; white-space: nowrap; }
        .btn-add-ch-hub:hover { background: var(--primary); color: white; }
        .loading-works, .empty-works-hub { padding: 3rem; text-align: center; background: white; border-radius: 20px; border: 2px dashed var(--border); color: var(--text-muted); font-weight: 600; display: flex; flex-direction: column; align-items: center; gap: 1rem; }
        .public-debug-table { width: 100%; margin-top: 2rem; text-align: left; background: #fff; padding: 1.5rem; border-radius: 12px; border: 1px solid #fee2e2; }
        .public-debug-table h4 { font-size: 0.8rem; color: #ef4444; margin-bottom: 0.5rem; letter-spacing: 1px; }
        .public-debug-table p { font-size: 0.75rem; margin-bottom: 1rem; color: #64748b; }

        @media (max-width: 900px) {
          .hub-grid { grid-template-columns: 1fr; }
          .form-layout { grid-template-columns: 1fr; }
          .cover-upload-side { max-width: 320px; margin: 0 auto; }
          .works-list-hub { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default CreateManga;
