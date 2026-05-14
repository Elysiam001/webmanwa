import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Book, PlusCircle, Users, BarChart3, 
  Settings, LogOut, ChevronRight, Edit, Trash2, Eye, Plus
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('manga');
  const [myManga, setMyManga] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyManga();
  }, []);

  const fetchMyManga = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/manga/user', {
        headers: { 'x-auth-token': token }
      });
      const data = await res.json();
      if (res.ok) {
        setMyManga(data);
      }
    } catch (err) {
      console.error('Lỗi tải danh sách truyện:', err);
    } finally {
      setLoading(false);
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
          <button 
            className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <LayoutDashboard size={20} /> Tổng quan
          </button>
          <button 
            className={`nav-item ${activeTab === 'manga' ? 'active' : ''}`}
            onClick={() => setActiveTab('manga')}
          >
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
            <h2 className="page-title">
              {activeTab === 'overview' ? 'Bảng điều khiển' : 'Tác phẩm của tôi'}
            </h2>
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
                <div className="stat-icon" style={{ backgroundColor: `${s.color}20`, color: s.color }}>
                  {s.icon}
                </div>
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
                      <td>
                        <img src={m.cover} alt="Cover" className="table-thumb" />
                      </td>
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
                          <Link 
                            to={`/dashboard/add-chapter/${m._id}`} 
                            className="action-btn-add"
                            title="Thêm chương mới"
                          >
                            <Plus size={18} /> Thêm chương
                          </Link>
                          <button className="action-btn-icon" title="Chỉnh sửa"><Edit size={18} /></button>
                          <button className="action-btn-icon delete" title="Xóa"><Trash2 size={18} /></button>
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

      <style jsx="true">{`
        .dashboard-page { display: flex; min-height: 100vh; padding-top: 70px; background: #f8fafc; }
        .sidebar { width: 280px; height: calc(100vh - 70px); position: fixed; left: 0; bottom: 0; padding: 1.5rem; display: flex; flex-direction: column; border-radius: 0; border-right: 1px solid var(--border); }
        .sidebar-header { margin-bottom: 2rem; padding-bottom: 1.5rem; border-bottom: 1px solid var(--border); }
        .user-info-dash { display: flex; align-items: center; gap: 1rem; }
        .dash-avatar { width: 48px; height: 48px; border-radius: 50%; object-fit: cover; }
        .username { display: block; font-weight: 800; font-size: 1rem; }
        .role { font-size: 0.8rem; color: var(--text-muted); }
        
        .sidebar-nav { display: flex; flex-direction: column; gap: 0.5rem; }
        .nav-item { display: flex; align-items: center; gap: 1rem; padding: 0.85rem 1rem; border-radius: var(--radius-md); color: var(--text-secondary); font-weight: 600; width: 100%; }
        .nav-item:hover, .nav-item.active { background: var(--primary-light); color: var(--primary); }
        .nav-divider { height: 1px; background: var(--border); margin: 1rem 0; }
        .nav-item.logout { color: #f43f5e; margin-top: auto; }

        .dashboard-content { margin-left: 280px; flex: 1; padding: 2.5rem; }
        .content-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2.5rem; }
        .page-title { font-size: 2rem; font-weight: 800; color: var(--text-primary); }
        .page-subtitle { color: var(--text-secondary); }
        .btn-create-dash { background: var(--primary); color: white; padding: 0.75rem 1.5rem; border-radius: var(--radius-md); font-weight: 700; display: flex; align-items: center; gap: 0.5rem; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2); }

        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; margin-bottom: 2.5rem; }
        .stat-card { padding: 1.5rem; display: flex; align-items: center; gap: 1rem; }
        .stat-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
        .stat-value { font-size: 1.5rem; font-weight: 800; display: block; }
        .stat-label { font-size: 0.85rem; color: var(--text-secondary); }

        .manga-list-section { padding: 0; overflow: hidden; }
        .manga-table { width: 100%; overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; }
        th { text-align: left; padding: 1.25rem 1rem; background: #f8fafc; color: var(--text-muted); font-size: 0.85rem; font-weight: 700; text-transform: uppercase; }
        td { padding: 1.25rem 1rem; border-bottom: 1px solid var(--border); }
        .table-thumb { width: 50px; height: 70px; object-fit: cover; border-radius: 4px; }
        .title-cell { display: flex; flex-direction: column; }
        .other-title { font-size: 0.8rem; color: var(--text-muted); }
        .type-badge-dash { background: #f1f5f9; color: var(--text-secondary); padding: 4px 8px; border-radius: 6px; font-size: 0.75rem; font-weight: 700; }
        .status-tag-dash { color: #22c55e; font-weight: 700; font-size: 0.85rem; }

        .table-actions { display: flex; align-items: center; gap: 0.75rem; }
        .action-btn-add { background: var(--primary-light); color: var(--primary); padding: 0.5rem 1rem; border-radius: 8px; font-size: 0.85rem; font-weight: 700; display: flex; align-items: center; gap: 0.4rem; }
        .action-btn-add:hover { background: var(--primary); color: white; }
        .action-btn-icon { color: var(--text-muted); padding: 0.5rem; border-radius: 8px; }
        .action-btn-icon:hover { background: #f1f5f9; color: var(--text-primary); }
        .action-btn-icon.delete:hover { color: #f43f5e; background: #fff1f2; }

        .empty-manga { padding: 5rem; text-align: center; }
        .empty-icon { font-size: 3rem; margin-bottom: 1rem; }
        .btn-text { color: var(--primary); font-weight: 700; margin-top: 0.5rem; display: inline-block; }

        @media (max-width: 1024px) {
          .sidebar { width: 80px; padding: 1rem; }
          .user-details, .nav-item span, .page-subtitle, .role { display: none; }
          .dashboard-content { margin-left: 80px; }
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
