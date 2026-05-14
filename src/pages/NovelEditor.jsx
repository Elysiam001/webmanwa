import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ChevronLeft, Loader2, Book, FileText, Type, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const NovelEditor = () => {
  const { token } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [chapterInfo, setChapterInfo] = useState({ number: '', title: '', content: '' });
  const [loading, setLoading] = useState(false);
  const [manga, setManga] = useState(null);

  useEffect(() => {
    const fetchManga = async () => {
      try {
        const res = await fetch(`/api/manga/${id}`);
        const data = await res.json();
        if (res.ok) setManga(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchManga();
  }, [id]);

  const handleSave = async () => {
    if (!chapterInfo.number) return alert('Vui lòng nhập số chương!');
    if (!chapterInfo.content.trim()) return alert('Vui lòng nhập nội dung chương!');

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
          content: chapterInfo.content
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
    <div className="novel-editor-page">
      <div className="container">
        <header className="editor-header">
          <div className="header-left">
            <button onClick={() => navigate('/dashboard')} className="back-btn-dash">
              <ChevronLeft size={20} /> Quay lại
            </button>
            <div className="header-titles">
              <h1>Soạn thảo Tiểu thuyết</h1>
              <p>Tác phẩm: <span className="highlight">{manga?.title || 'Đang tải...'}</span></p>
            </div>
          </div>
          <div className="header-right">
            <button 
              className="btn-save-novel" 
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              <span>{loading ? 'Đang lưu...' : 'Đăng chương'}</span>
            </button>
          </div>
        </header>

        <div className="editor-layout">
          <div className="editor-main-side">
            <section className="info-bar glass-card">
              <div className="input-group-editor">
                <label><Type size={16} /> Chương số</label>
                <input 
                  type="number" 
                  placeholder="Ví dụ: 1" 
                  value={chapterInfo.number}
                  onChange={(e) => setChapterInfo({...chapterInfo, number: e.target.value})}
                />
              </div>
              <div className="input-group-editor flex-1">
                <label><FileText size={16} /> Tiêu đề chương</label>
                <input 
                  type="text" 
                  placeholder="Tên chương (ví dụ: Khởi đầu mới...)" 
                  value={chapterInfo.title}
                  onChange={(e) => setChapterInfo({...chapterInfo, title: e.target.value})}
                />
              </div>
            </section>

            <section className="text-editor-container glass-card">
              <textarea 
                placeholder="Bắt đầu viết câu chuyện của bạn tại đây..."
                value={chapterInfo.content}
                onChange={(e) => setChapterInfo({...chapterInfo, content: e.target.value})}
              ></textarea>
              <div className="editor-footer">
                <span>Số từ: {chapterInfo.content.trim().split(/\s+/).filter(w => w !== '').length}</span>
              </div>
            </section>
          </div>

          <aside className="editor-side">
            <div className="tip-card glass-card">
              <h4><Info size={18} /> Mẹo soạn thảo</h4>
              <ul className="tip-list">
                <li><strong>Phân đoạn:</strong> Nên ngắt đoạn thường xuyên để người đọc dễ theo dõi trên điện thoại.</li>
                <li><strong>Trình bày:</strong> Sử dụng các dấu ngắt để phân chia các cảnh khác nhau.</li>
                <li><strong>Lưu trữ:</strong> Hệ thống chưa có tự động lưu nháp, hãy đảm bảo bạn lưu thường xuyên.</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>

      <style jsx="true">{`
        .novel-editor-page { padding: 120px 0 60px; background: #f1f5f9; min-height: 100vh; }
        .editor-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .header-left { display: flex; align-items: center; gap: 2rem; }
        .back-btn-dash { background: white; padding: 0.75rem 1.25rem; border-radius: 12px; font-weight: 700; display: flex; align-items: center; gap: 0.5rem; box-shadow: var(--shadow-sm); }
        .header-titles h1 { font-size: 2rem; font-weight: 800; }
        .header-titles p { color: var(--text-secondary); }
        .highlight { color: var(--primary); font-weight: 700; }
        .btn-save-novel { background: var(--primary); color: white; padding: 0.85rem 2rem; border-radius: 12px; font-weight: 800; display: flex; align-items: center; gap: 0.75rem; box-shadow: 0 10px 20px rgba(99, 102, 241, 0.2); }
        
        .editor-layout { display: grid; grid-template-columns: 1fr 300px; gap: 2rem; }
        .info-bar { display: flex; gap: 2rem; padding: 1.5rem 2rem; margin-bottom: 1.5rem; align-items: center; }
        .input-group-editor { display: flex; flex-direction: column; gap: 0.5rem; }
        .input-group-editor label { font-size: 0.85rem; font-weight: 800; color: var(--text-secondary); display: flex; align-items: center; gap: 0.5rem; }
        .input-group-editor input { background: #f8fafc; border: 1px solid var(--border); padding: 0.75rem 1rem; border-radius: 10px; font-weight: 600; outline: none; }
        .flex-1 { flex: 1; }
        
        .text-editor-container { padding: 0; min-height: 600px; display: flex; flex-direction: column; }
        .text-editor-container textarea { flex: 1; padding: 3rem; border: none; outline: none; font-size: 1.2rem; line-height: 1.8; font-family: 'Inter', sans-serif; resize: none; background: white; border-radius: var(--radius-xl) var(--radius-xl) 0 0; }
        .editor-footer { padding: 1rem 2rem; background: #f8fafc; border-top: 1px solid var(--border); font-size: 0.9rem; font-weight: 600; color: var(--text-muted); }
        
        .tip-card { padding: 1.5rem; }
        .tip-card h4 { display: flex; align-items: center; gap: 0.5rem; font-weight: 800; margin-bottom: 1.25rem; }
        .tip-list { list-style: none; display: flex; flex-direction: column; gap: 1rem; }
        .tip-list li { font-size: 0.85rem; line-height: 1.6; color: var(--text-secondary); }
        
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        @media (max-width: 1024px) {
          .editor-layout { grid-template-columns: 1fr; }
          .editor-side { display: none; }
          .info-bar { flex-direction: column; align-items: stretch; }
        }
      `}</style>
    </div>
  );
};

export default NovelEditor;
