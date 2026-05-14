import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Book, PlusCircle, Users, BarChart3, 
  Settings, LogOut, ChevronRight, Edit, Trash2, Eye, Plus, X, Save, ImageIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('manga');
  const [myManga, setMyManga] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingManga, setEditingManga] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyManga();
  }, [token]);

  const fetchMyManga = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/manga/user', {
        headers: { 'x-auth-token': token }
      });
      const data = await res.json();
      if (res.ok) setMyManga(data);
    } catch (err) {
      console.error('Lỗi tải danh sách truyện:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa bộ truyện "${title}" không? Hành động này sẽ xóa tất cả các chương liên quan.`)) {
      try {
        const res = await fetch(`/api/manga/${id}`, {
          method: 'DELETE',
          headers: { 'x-auth-token': token }
        });
        if (res.ok) {
          alert('Đã xóa truyện thành công!');
          setMyManga(myManga.filter(m => m._id !== id));
        } else {
          const data = await res.json();
          alert(data.message || 'Lỗi khi xóa truyện');
        }
      } catch (err) {
        alert('Lỗi kết nối Server');
      }
    }
  };

  const handleUpdateManga = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    try {
      const res = await fetch(`/api/manga/${editingManga._id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'x-auth-token': token 
        },
        body: JSON.stringify(editingManga)
      });
      const data = await res.json();
      if (res.ok) {
        alert('Cập nhật thành công!');
        setMyManga(myManga.map(m => m._id === data._id ? data : m));
        setEditingManga(null);
        fetchMyManga(); // Refresh to be sure
      } else {
        alert(data.message || 'Lỗi khi cập nhật');
      }
    } catch (err) {
      alert('Lỗi kết nối Server');
    } finally {
      setUpdateLoading(false);
    }
  };

  const stats = [
    { label: "Số truyện", value: myManga.length, icon: <Book size={20} />, color: "#22c55e" },
    { label: "Tổng view", value: "0", icon: <Eye size={20} />, color: "#8b5cf6" },
    { label: "Theo dõi", value: "0", icon: <Users size={20} />, color: "#06b6d4" },
    { label: "Rating TB", value: "0", icon: <BarChart3 size={20} />, color: "#eab308" },
  ];

  return (
    <div className="dashboard-page">
      <aside className="sidebar glass-card">
        <div className="sidebar-header">
          <div className="user-info-dash">
            <img 
              src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.username}&background=6366f1&color=fff`} 
              alt="Avatar" 
              className="dash-avatar"
            />
            <div className="user-details">
              <span className="username">{user?.username}</span>
              <span className="role">Nhà sáng tạo</span>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
            <LayoutDashboard size={20} /> Tổng quan
          </button>
          <button className={`nav-item ${activeTab === 'manga' ? 'active' : ''}`} onClick={() => setActiveTab('manga')}>
            <Book size={20} /> Quản lý truyện
          </button>
          <Link to="/create-manga" className="nav-item">
            <PlusCircle size={20} /> Tác phẩm mới
          </Link>
          <div className="nav-divider"></div>
          <button onClick={logout} className="nav-item logout">
            <LogOut size={20} /> Đăng xuất
          </button>
        </nav>
      </aside>

      <main className="dashboard-content">
        <header className="content-header">
          <div>
            <h2 className="page-title">{activeTab === 'overview' ? 'Bảng điều khiển' : 'Tác phẩm của tôi'}</h2>
            <p className="page-subtitle">Quản lý và cập nhật các bộ truyện của bạn</p>
          </div>
          <Link to="/create-manga" className="btn-create-dash">
            <Plus size={20} /> Tạo tác phẩm mới
          </Link>
        </header>

        {activeTab === 'overview' && (
          <div className="stats-grid">
            {stats.map((s, idx) => (
              <div key={idx} className="stat-card glass-card">
                <div className="stat-icon" style={{ backgroundColor: `${s.color}20`, color: s.color }}>{s.icon}</div>
                <div className="stat-info">
                  <span className="stat-label">{s.label}</span>
                  <span className="stat-value">{s.value}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="manga-list-section glass-card">
          {loading ? (
            <div className="loading-state">Đang tải danh sách...</div>
          ) : myManga.length > 0 ? (
            <div className="manga-table">
              <table>
                <thead>
                  <tr>
                    <th>Ảnh bìa</th>
                    <th>Tên tác phẩm</th>
                    <th>Loại</th>
                    <th>Số chương</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {myManga.map(m => (
                    <tr key={m._id}>
                      <td><img src={m.cover} alt="Cover" className="table-thumb" /></td>
                      <td>
                        <div className="title-cell">
                          <strong>{m.title}</strong>
                          <span className="other-title">{m.otherTitle}</span>
                        </div>
                      </td>
                      <td><span className="type-badge-dash">{m.type}</span></td>
                      <td>{m.chapterCount || 0}</td>
                      <td><span className="status-tag-dash">{m.status}</span></td>
                      <td>
                        <div className="table-actions">
                          {m.type === 'Novel' ? (
                            <Link to={`/dashboard/novel-editor/${m._id}`} className="action-btn-add novel" title="Viết chương mới">
                              <Plus size={18} /> Viết chương
                            </Link>
                          ) : (
                            <Link to={`/dashboard/add-chapter/${m._id}`} className="action-btn-add" title="Thêm chương mới">
                              <Plus size={18} /> Thêm vào
                            </Link>
                          )}
                          <button onClick={() => setEditingManga(m)} className="action-btn-icon" title="Chỉnh sửa"><Edit size={18} /></button>
                          <button onClick={() => handleDelete(m._id, m.title)} className="action-btn-icon delete" title="Xóa"><Trash2 size={18} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-manga">
              <div className="empty-icon">📚</div>
              <p>Bạn chưa có tác phẩm nào.</p>
              <Link to="/create-manga" className="btn-text">Bắt đầu tạo ngay thôi!</Link>
            </div>
          )}
        </div>
      </main>

      {/* MODAL CHỈNH SỬA TRUYỆN */}
      <AnimatePresence>
        {editingManga && (
          <div className="modal-overlay">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="modal-card glass-card">
              <div className="modal-header">
                <h3>Chỉnh sửa tác phẩm</h3>
                <button onClick={() => setEditingManga(null)} className="close-modal"><X size={24} /></button>
              </div>
              <form onSubmit={handleUpdateManga} className="modal-form">
                <div className="modal-body-scroll">
                  <div className="form-grid-modal">
                    <div className="modal-cover-side">
                      <div className="modal-cover-preview">
                        <img src={editingManga.cover} alt="Preview" />
                      </div>
                      <div className="input-group-dash">
                        <label>Link ảnh bìa (URL)</label>
                        <input 
                          type="text" 
                          value={editingManga.cover} 
                          onChange={(e) => setEditingManga({...editingManga, cover: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="modal-info-side">
                      <div className="input-group-dash">
                        <label>Tên truyện</label>
                        <input 
                          type="text" 
                          value={editingManga.title} 
                          onChange={(e) => setEditingManga({...editingManga, title: e.target.value})}
                          required
                        />
                      </div>
                      <div className="input-group-dash">
                        <label>Tên khác</label>
                        <input 
                          type="text" 
                          value={editingManga.otherTitle} 
                          onChange={(e) => setEditingManga({...editingManga, otherTitle: e.target.value})}
                        />
                      </div>
                      <div className="form-row-dash">
                        <div className="input-group-dash">
                          <label>Trạng thái</label>
                          <select 
                            value={editingManga.status} 
                            onChange={(e) => setEditingManga({...editingManga, status: e.target.value})}
                            className="select-dash"
                          >
                            <option value="Đang tiến hành">Đang tiến hành</option>
                            <option value="Hoàn thành">Hoàn thành</option>
                            <option value="Tạm ngưng">Tạm ngưng</option>
                          </select>
                        </div>
                        <div className="input-group-dash">
                          <label>Loại</label>
                          <select 
                            value={editingManga.type} 
                            onChange={(e) => setEditingManga({...editingManga, type: e.target.value})}
                            className="select-dash"
                          >
                            <option value="Manhwa">Manhwa</option>
                            <option value="Manga">Manga</option>
                            <option value="Manhua">Manhua</option>
                            <option value="Novel">Novel</option>
                          </select>
                        </div>
                      </div>
                      <div className="input-group-dash">
                        <label>Mô tả nội dung</label>
                        <textarea 
                          rows="4"
                          value={editingManga.description} 
                          onChange={(e) => setEditingManga({...editingManga, description: e.target.value})}
                          className="textarea-dash"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" onClick={() => setEditingManga(null)} className="btn-cancel">Hủy</button>
                  <button type="submit" className="btn-save-modal" disabled={updateLoading}>
                    {updateLoading ? 'Đang lưu...' : <><Save size={18} /> Lưu thay đổi</>}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx="true">{`
        .dashboard-page { display: flex; min-height: 100vh; padding-top: 70px; background: #f8fafc; }
        .sidebar { width: 280px; height: calc(100vh - 70px); position: fixed; left: 0; bottom: 0; padding: 1.5rem; display: flex; flex-direction: column; border-radius: 0; border-right: 1px solid var(--border); }
        .sidebar-header { margin-bottom: 2rem; padding-bottom: 1.5rem; border-bottom: 1px solid var(--border); }
        .user-info-dash { display: flex; align-items: center; gap: 1rem; }
        .dash-avatar { width: 48px; height: 48px; border-radius: 50%; object-fit: cover; }
        .username { display: block; font-weight: 800; font-size: 1rem; }
        .role { font-size: 0.8rem; color: var(--text-muted); }
        .sidebar-nav { display: flex; flex-direction: column; gap: 0.5rem; }
        .nav-item { display: flex; align-items: center; gap: 1rem; padding: 0.85rem 1rem; border-radius: var(--radius-md); color: var(--text-secondary); font-weight: 600; width: 100%; text-align: left; }
        .nav-item:hover, .nav-item.active { background: var(--primary-light); color: var(--primary); }
        .nav-divider { height: 1px; background: var(--border); margin: 1rem 0; }
        .nav-item.logout { color: #f43f5e; margin-top: auto; }
        .dashboard-content { margin-left: 280px; flex: 1; padding: 2.5rem; }
        .content-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2.5rem; }
        .page-title { font-size: 2rem; font-weight: 800; color: var(--text-primary); }
        .btn-create-dash { background: var(--primary); color: white; padding: 0.75rem 1.5rem; border-radius: var(--radius-md); font-weight: 700; display: flex; align-items: center; gap: 0.5rem; }
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; margin-bottom: 2.5rem; }
        .stat-card { padding: 1.5rem; display: flex; align-items: center; gap: 1rem; }
        .stat-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
        .manga-list-section { padding: 0; overflow: hidden; }
        .manga-table { width: 100%; overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; }
        th { text-align: left; padding: 1.25rem 1rem; background: #f8fafc; color: var(--text-muted); font-size: 0.85rem; font-weight: 700; text-transform: uppercase; }
        td { padding: 1.25rem 1rem; border-bottom: 1px solid var(--border); }
        .table-thumb { width: 50px; height: 70px; object-fit: cover; border-radius: 4px; }
        .type-badge-dash { background: #f1f5f9; color: var(--text-secondary); padding: 4px 8px; border-radius: 6px; font-size: 0.75rem; font-weight: 700; }
        .status-tag-dash { color: #22c55e; font-weight: 700; }
        .table-actions { display: flex; align-items: center; gap: 0.75rem; }
        .action-btn-add { background: var(--primary-light); color: var(--primary); padding: 0.5rem 1rem; border-radius: 8px; font-size: 0.85rem; font-weight: 700; display: flex; align-items: center; gap: 0.4rem; }
        .action-btn-icon { color: var(--text-muted); padding: 0.5rem; border-radius: 8px; }
        .action-btn-icon:hover { background: #f1f5f9; color: var(--text-primary); }
        .action-btn-icon.delete:hover { color: #f43f5e; background: #fff1f2; }
        .empty-manga { padding: 5rem; text-align: center; }

        /* MODAL STYLES */
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); z-index: 2000; display: flex; align-items: center; justify-content: center; padding: 2rem; }
        .modal-card { background: white; width: 100%; max-width: 800px; border-radius: var(--radius-xl); overflow: hidden; display: flex; flex-direction: column; max-height: 90vh; }
        .modal-header { padding: 1.5rem 2rem; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
        .modal-header h3 { font-size: 1.5rem; font-weight: 800; color: var(--text-primary); }
        .modal-body-scroll { padding: 2rem; overflow-y: auto; flex: 1; }
        .form-grid-modal { display: grid; grid-template-columns: 220px 1fr; gap: 2rem; }
        .modal-cover-preview { width: 100%; aspect-ratio: 2/3; border-radius: 12px; overflow: hidden; margin-bottom: 1rem; border: 1px solid var(--border); }
        .modal-cover-preview img { width: 100%; height: 100%; object-fit: cover; }
        .input-group-dash { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1.25rem; }
        .input-group-dash label { font-weight: 700; font-size: 0.85rem; color: var(--text-secondary); }
        .input-group-dash input, .select-dash, .textarea-dash { padding: 0.75rem; border: 1px solid var(--border); border-radius: 8px; outline: none; background: #f8fafc; font-weight: 500; }
        .form-row-dash { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .modal-footer { padding: 1.5rem 2rem; border-top: 1px solid var(--border); display: flex; justify-content: flex-end; gap: 1rem; background: #f8fafc; }
        .btn-cancel { padding: 0.75rem 1.5rem; border-radius: 8px; font-weight: 700; color: var(--text-secondary); }
        .btn-save-modal { background: var(--primary); color: white; padding: 0.75rem 2rem; border-radius: 8px; font-weight: 700; display: flex; align-items: center; gap: 0.5rem; }

        @media (max-width: 1024px) {
          .sidebar { width: 80px; }
          .dashboard-content { margin-left: 80px; }
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .form-grid-modal { grid-template-columns: 1fr; }
          .modal-cover-side { max-width: 150px; }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
