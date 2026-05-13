import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, User, Menu, X, BookOpen, Compass, History, Bookmark } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar glass ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container nav-content">
        <Link to="/" className="logo">
          <BookOpen className="logo-icon" size={32} />
          <span className="logo-text">Manhwa<span className="gradient-text">Hub</span></span>
        </Link>

        <div className="nav-links desktop-only">
          <Link to="/" className="nav-link active">Trang chủ</Link>
          <Link to="/genres" className="nav-link">Thể loại</Link>
          <Link to="/ranking" className="nav-link">Xếp hạng</Link>
          <Link to="/history" className="nav-link">Lịch sử</Link>
          <Link to="/follow" className="nav-link">Theo dõi</Link>
        </div>

        <div className="nav-actions">
          <div className="search-bar desktop-only">
            <Search size={18} className="search-icon" />
            <input type="text" placeholder="Tìm kiếm truyện..." />
          </div>
          
          <button className="icon-btn mobile-only">
            <Search size={20} />
          </button>

          {user ? (
            <div className="user-profile">
              <div className="user-info desktop-only">
                <span className="user-name">{user.username}</span>
              </div>
              <button onClick={logout} className="logout-btn">
                <X size={18} />
                <span className="desktop-only">Đăng xuất</span>
              </button>
            </div>
          ) : (
            <Link to="/login" className="login-btn">
              <User size={20} />
              <span className="desktop-only">Đăng nhập</span>
            </Link>
          )}

          <button 
            className="menu-btn mobile-only"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu glass animate-fade-in">
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>Trang chủ</Link>
          <Link to="/genres" onClick={() => setIsMobileMenuOpen(false)}>Thể loại</Link>
          <Link to="/ranking" onClick={() => setIsMobileMenuOpen(false)}>Xếp hạng</Link>
          <Link to="/history" onClick={() => setIsMobileMenuOpen(false)}>Lịch sử</Link>
          <Link to="/follow" onClick={() => setIsMobileMenuOpen(false)}>Theo dõi</Link>
        </div>
      )}

      <style jsx="true">{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 80px;
          z-index: 1000;
          transition: var(--transition);
          display: flex;
          align-items: center;
          border-top: none;
          border-left: none;
          border-right: none;
        }

        .navbar.scrolled {
          height: 70px;
          background: rgba(10, 10, 12, 0.85);
          box-shadow: var(--shadow-md);
        }

        .nav-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 1.5rem;
          font-weight: 800;
          letter-spacing: -0.5px;
        }

        .logo-icon {
          color: var(--primary);
        }

        .nav-links {
          display: flex;
          gap: 2rem;
        }

        .nav-link {
          font-weight: 500;
          color: var(--text-secondary);
          position: relative;
        }

        .nav-link:hover, .nav-link.active {
          color: var(--text-primary);
        }

        .nav-link.active::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 0;
          width: 100%;
          height: 2px;
          background: var(--primary);
          border-radius: var(--radius-full);
        }

        .nav-actions {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .search-bar {
          background: var(--bg-surface-elevated);
          border: 1px solid var(--border);
          border-radius: var(--radius-full);
          padding: 0.5rem 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          width: 250px;
          transition: var(--transition);
        }

        .search-bar:focus-within {
          border-color: var(--primary);
          width: 300px;
        }

        .search-bar input {
          background: none;
          border: none;
          color: var(--text-primary);
          width: 100%;
          outline: none;
          font-size: 0.9rem;
        }

        .login-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--primary);
          color: white;
          padding: 0.6rem 1.2rem;
          border-radius: var(--radius-full);
          font-weight: 600;
          box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);
        }

        .login-btn:hover {
          background: var(--primary-hover);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(139, 92, 246, 0.4);
        }
        
        .user-profile {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .user-name {
          font-weight: 600;
          color: var(--text-primary);
        }
        .logout-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #ef4444;
          background: rgba(239, 68, 68, 0.1);
          padding: 0.5rem 1rem;
          border-radius: var(--radius-full);
          font-weight: 500;
          transition: var(--transition);
        }
        .logout-btn:hover {
          background: rgba(239, 68, 68, 0.2);
        }

        .icon-btn, .menu-btn {
          color: var(--text-secondary);
        }

        .mobile-menu {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          border-top: 1px solid var(--border);
        }

        .mobile-only { display: none; }

        @media (max-width: 1024px) {
          .desktop-only { display: none; }
          .mobile-only { display: flex; }
          
          .navbar { height: 70px; }
          .container { padding: 0 1.25rem; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
