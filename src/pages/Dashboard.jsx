import { useState } from 'react';
import { 
  LayoutDashboard, Book, PlusCircle, Users, BarChart3, 
  Settings, LogOut, ChevronRight, Edit, Trash2, Eye 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Dữ liệu mẫu
  const stats = [
    { label: "Tổng view", value: "1.2M", icon: <Eye size={20} />, color: "#8b5cf6" },
    { label: "Theo dõi", value: "45.2K", icon: <Users size={20} />, color: "#06b6d4" },
    { label: "Số truyện", value: "12", icon: <Book size={20} />, color: "#22c55e" },
    { label: "Rating TB", value: "4.8", icon: <BarChart3 size={20} />, color: "#eab308" },
  ];

  const myManga = [
    { id: 1, title: "Hành trình vô tận", type: "Manga", chapters: 120, views: "450K", status: "Đang tiến hành" },
    { id: 2, title: "Kiếm sĩ cuối cùng", type: "Manhwa", chapters: 85, views: "280K", status: "Hoàn thành" },
  ];

  return (
    <div className="dashboard-page">
      <aside className="sidebar glass">
        <div className="sidebar-header">
          <div className="user-info">
            <div className="avatar">A</div>
            <div className="user-details">
              <span className="username">Author Name</span>
              <span className="role">Creator</span>
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
          <Link to="/dashboard/create" className="nav-item">
            <PlusCircle size={20} /> Thêm truyện mới
          </Link>
          <button 
            className={`nav-item ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            <BarChart3 size={20} /> Thống kê chi tiết
          </button>
          <div className="nav-divider"></div>
          <button className="nav-item">
            <Settings size={20} /> Cài đặt
          </button>
          <button className="nav-item logout">
            <LogOut size={20} /> Đăng xuất
          </button>
        </nav>
      </aside>

      <main className="dashboard-content">
        <header className="content-header">
          <h2 className="page-title">
            {activeTab === 'overview' ? 'Bảng điều khiển' : 'Danh sách truyện của bạn'}
          </h2>
          <div className="header-actions">
            <Link to="/dashboard/create" className="create-btn">
              <PlusCircle size={20} /> Tạo truyện mới
            </Link>
          </div>
        </header>

        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="stats-grid">
              {stats.map((s, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="stat-card glass"
                >
                  <div className="stat-icon" style={{ backgroundColor: `${s.color}20`, color: s.color }}>
                    {s.icon}
                  </div>
                  <div className="stat-info">
                    <span className="stat-label">{s.label}</span>
                    <span className="stat-value">{s.value}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            <section className="recent-manga glass">
              <div className="section-header">
                <h3>Truyện mới cập nhật</h3>
                <button className="text-btn">Xem tất cả <ChevronRight size={16} /></button>
              </div>
              <div className="manga-table">
                <table>
                  <thead>
                    <tr>
                      <th>Tên truyện</th>
                      <th>Loại</th>
                      <th>Số chương</th>
                      <th>Lượt xem</th>
                      <th>Trạng thái</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myManga.map(m => (
                      <tr key={m.id}>
                        <td><strong>{m.title}</strong></td>
                        <td>{m.type}</td>
                        <td>{m.chapters}</td>
                        <td>{m.views}</td>
                        <td><span className="status-tag">{m.status}</span></td>
                        <td>
                          <div className="table-actions">
                            <button className="action-btn edit"><Edit size={16} /></button>
                            <button className="action-btn delete"><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}
      </main>

      <style jsx="true">{`
        .dashboard-page {
          display: flex;
          min-height: 100vh;
          padding-top: 80px;
          background: var(--bg-main);
        }

        .sidebar {
          width: 280px;
          height: calc(100vh - 80px);
          position: fixed;
          left: 0;
          bottom: 0;
          display: flex;
          flex-direction: column;
          border-left: none;
          border-bottom: none;
        }

        .sidebar-header {
          padding: 2rem;
          border-bottom: 1px solid var(--border);
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .avatar {
          width: 45px;
          height: 45px;
          background: var(--primary);
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.2rem;
        }

        .username {
          display: block;
          font-weight: 700;
          font-size: 1rem;
        }

        .role {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .sidebar-nav {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.85rem 1.25rem;
          border-radius: var(--radius-md);
          color: var(--text-secondary);
          font-weight: 500;
          transition: var(--transition);
          width: 100%;
          text-align: left;
        }

        .nav-item:hover, .nav-item.active {
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-primary);
        }

        .nav-item.active {
          color: var(--primary);
          background: rgba(139, 92, 246, 0.1);
        }

        .nav-divider {
          height: 1px;
          background: var(--border);
          margin: 1rem 0;
        }

        .nav-item.logout:hover {
          color: #ef4444;
          background: rgba(239, 68, 68, 0.1);
        }

        .dashboard-content {
          margin-left: 280px;
          flex: 1;
          padding: 3rem;
        }

        .content-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 3rem;
        }

        .page-title { font-size: 1.75rem; font-weight: 800; }

        .create-btn {
          background: var(--primary);
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: var(--radius-md);
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .stat-card {
          padding: 1.5rem;
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }

        .stat-icon {
          width: 50px;
          height: 50px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-label {
          display: block;
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: 800;
        }

        .recent-manga {
          border-radius: var(--radius-lg);
          padding: 2rem;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .manga-table {
          width: 100%;
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th {
          text-align: left;
          padding: 1rem;
          color: var(--text-muted);
          font-size: 0.85rem;
          border-bottom: 1px solid var(--border);
        }

        td {
          padding: 1.25rem 1rem;
          border-bottom: 1px solid var(--border);
        }

        .status-tag {
          background: rgba(34, 197, 94, 0.1);
          color: #22c55e;
          padding: 0.25rem 0.5rem;
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
          font-weight: 700;
        }

        .table-actions {
          display: flex;
          gap: 0.5rem;
        }

        .action-btn {
          padding: 0.4rem;
          border-radius: var(--radius-sm);
          color: var(--text-secondary);
        }

        .action-btn.edit:hover { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
        .action-btn.delete:hover { background: rgba(239, 68, 68, 0.1); color: #ef4444; }

        @media (max-width: 1200px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 768px) {
          .sidebar { width: 80px; }
          .username, .role, .nav-item span { display: none; }
          .dashboard-content { margin-left: 80px; padding: 1.5rem; }
          .stats-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
