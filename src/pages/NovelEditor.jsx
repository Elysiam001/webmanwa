import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Eye, ChevronLeft, Type, Image as ImageIcon, Bold, Italic, List, AlignLeft, Send } from 'lucide-react';

const NovelEditor = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState("");

  return (
    <div className="novel-editor-page container">
      <header className="page-header">
        <button onClick={() => navigate(-1)} className="back-link">
          <ChevronLeft size={20} /> Quay lại quản lý truyện
        </button>
        <h1 className="page-title">Viết chương tiểu thuyết</h1>
      </header>

      <div className="editor-grid">
        <div className="main-editor glass">
          <div className="editor-info-header">
            <input type="text" className="chapter-title-input" placeholder="Nhập tiêu đề chương..." />
            <div className="chapter-meta-inputs">
              <span>Chương số:</span>
              <input type="number" className="chapter-num-input" placeholder="1" />
            </div>
          </div>

          <div className="rich-text-toolbar glass">
            <button className="tool-btn"><Bold size={18} /></button>
            <button className="tool-btn"><Italic size={18} /></button>
            <button className="tool-btn"><List size={18} /></button>
            <button className="tool-btn"><AlignLeft size={18} /></button>
            <div className="tool-divider"></div>
            <button className="tool-btn"><ImageIcon size={18} /></button>
            <button className="tool-btn"><Type size={18} /></button>
          </div>

          <textarea 
            className="editor-textarea" 
            placeholder="Bắt đầu viết câu chuyện của bạn ở đây..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>

          <div className="editor-footer">
            <span className="word-count">{content.split(/\s+/).filter(x => x).length} từ</span>
            <div className="editor-actions">
              <button className="draft-btn glass"><Save size={18} /> Lưu nháp</button>
              <button className="publish-btn"><Send size={18} /> Đăng công khai</button>
            </div>
          </div>
        </div>

        <aside className="editor-sidebar">
          <div className="info-card glass">
            <h4>Cài đặt chương</h4>
            <div className="form-group">
              <label>Ghi chú của tác giả</label>
              <textarea placeholder="Ghi chú xuất hiện ở cuối chương..."></textarea>
            </div>
            <div className="form-group">
              <label>Hẹn giờ đăng</label>
              <input type="datetime-local" className="glass" />
            </div>
          </div>
        </aside>
      </div>

      <style jsx="true">{`
        .novel-editor-page { padding: 120px 2rem 5rem; }
        .page-header { margin-bottom: 2.5rem; }
        .back-link { display: flex; align-items: center; gap: 0.5rem; color: var(--text-secondary); margin-bottom: 1rem; font-weight: 500; }
        .page-title { font-size: 2.5rem; font-weight: 800; }

        .editor-grid { display: grid; grid-template-columns: 1fr 350px; gap: 2.5rem; align-items: start; }
        .main-editor { padding: 0; border-radius: var(--radius-lg); overflow: hidden; display: flex; flex-direction: column; min-height: 700px; }

        .editor-info-header { padding: 2rem; background: rgba(255, 255, 255, 0.02); display: flex; flex-direction: column; gap: 1rem; }
        .chapter-title-input { font-size: 2rem; font-weight: 700; background: none; border: none; outline: none; color: white; width: 100%; }
        .chapter-meta-inputs { display: flex; align-items: center; gap: 1rem; color: var(--text-secondary); font-size: 0.9rem; }
        .chapter-num-input { width: 60px; background: var(--bg-surface-elevated); border: 1px solid var(--border); padding: 0.4rem; border-radius: var(--radius-sm); color: white; text-align: center; }

        .rich-text-toolbar { margin: 0 2rem; padding: 0.75rem 1.25rem; display: flex; gap: 0.75rem; align-items: center; border-radius: var(--radius-md); }
        .tool-btn { color: var(--text-secondary); padding: 0.5rem; border-radius: var(--radius-sm); }
        .tool-btn:hover { background: rgba(255, 255, 255, 0.05); color: var(--text-primary); }
        .tool-divider { width: 1px; height: 24px; background: var(--border); margin: 0 0.5rem; }

        .editor-textarea { flex: 1; background: none; border: none; outline: none; color: var(--text-primary); padding: 2rem; font-size: 1.2rem; line-height: 1.8; resize: none; min-height: 500px; font-family: 'Inter', sans-serif; }

        .editor-footer { padding: 1.5rem 2rem; background: rgba(255, 255, 255, 0.02); display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border); }
        .word-count { color: var(--text-muted); font-size: 0.9rem; }
        .editor-actions { display: flex; gap: 1rem; }
        .draft-btn { padding: 0.75rem 1.5rem; border-radius: var(--radius-md); color: white; font-weight: 600; display: flex; align-items: center; gap: 0.5rem; }
        .publish-btn { background: var(--primary); color: white; padding: 0.75rem 1.5rem; border-radius: var(--radius-md); font-weight: 700; display: flex; align-items: center; gap: 0.5rem; }

        .editor-sidebar { display: flex; flex-direction: column; gap: 1.5rem; }
        .info-card { padding: 2rem; border-radius: var(--radius-lg); }
        .info-card h4 { margin-bottom: 1.5rem; }
        .form-group { margin-bottom: 1.5rem; display: flex; flex-direction: column; gap: 0.75rem; }
        .form-group label { font-size: 0.9rem; color: var(--text-secondary); font-weight: 600; }
        .form-group textarea { background: var(--bg-surface-elevated); border: 1px solid var(--border); border-radius: var(--radius-md); color: white; padding: 1rem; outline: none; min-height: 120px; }

        @media (max-width: 1024px) {
          .editor-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default NovelEditor;
