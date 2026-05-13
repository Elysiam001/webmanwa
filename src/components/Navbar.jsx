import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, User, Menu, X, BookOpen, Compass, History, 
  Bookmark, Settings, Power, Heart, Book, Layers, PlusCircle, CreditCard, Bell
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled glass' : ''}`}>
      <div className="container nav-content">
        <Link to="/" className="logo">
          <div className="logo-icon-wrapper">
            <BookOpen className="logo-icon" size={24} />
          </div>
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
          
          <button className="icon-btn action-circle mobile-only">
            <Search size={20} />
          </button>

          {user ? (
            <div className="user-section" ref={userMenuRef}>
              <div className="action-icons desktop-only">
                <button className="icon-btn action-circle">
                  <Bell size={20} />
                  <span className="dot-badge"></span>
                </button>
              </div>
              <div 
                className="avatar-wrapper"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                <img 
                  src={user.avatar || `https://ui-avatars.com/api/?name=${user.username}&background=6366f1&color=fff`} 
                  alt={user.username} 
                  className="user-avatar"
                />
              </div>

              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 15, scale: 0.95 }}
                    className="user-dropdown glass-card"
                  >
                    <div className="dropdown-header">
                      <div className="user-profile-header">
                        <img 
                          src={user.avatar || `https://ui-avatars.com/api/?name=${user.username}&background=6366f1&color=fff`} 
                          alt={user.username} 
                          className="dropdown-avatar"
                        />
                        <div className="user-meta">
                          <span className="username-display">{user.username}</span>
                          <span className="user-role">{user.role || 'Độc giả'}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="dropdown-divider"></div>
                    
                    <div className="dropdown-items">
                      <Link to="/profile" className="dropdown-item">
                        <User size={18} /> Thông tin cá nhân
                      </Link>
                      <Link to="/settings" className="dropdown-item">
                        <Settings size={18} /> Cài đặt
                      </Link>
                      <Link to="/history" className="dropdown-item">
                        <History size={18} /> Lịch sử đọc
                      </Link>
                      <Link to="/follow" className="dropdown-item">
                        <Heart size={18} /> Truyện đang theo dõi
                      </Link>

                      <div className="dropdown-divider"></div>
                      
                      <Link to="/create-manga" className="dropdown-item create-btn">
                        <PlusCircle size={18} /> Đăng truyện mới
                      </Link>

                      <button onClick={logout} className="dropdown-item logout">
                        <Power size={18} /> Đăng xuất
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link to="/login" className="login-btn-new">
              Đăng nhập
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
          background: transparent;
        }

        .navbar.scrolled {
          height: 70px;
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
        }

        .logo-icon-wrapper {
          background: linear-gradient(135deg, var(--primary), var(--accent));
          color: white;
          padding: 8px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 10px rgba(99, 102, 241, 0.3);
        }

        .nav-links {
          display: flex;
          gap: 2rem;
        }

        .nav-link {
          font-weight: 600;
          color: var(--text-secondary);
          font-size: 0.95rem;
        }

        .nav-link:hover, .nav-link.active {
          color: var(--primary);
        }

        .nav-actions {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }

        .search-bar {
          background: white;
          border: 1px solid var(--border);
          border-radius: var(--radius-full);
          padding: 0.6rem 1.2rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          width: 220px;
          transition: var(--transition);
          box-shadow: var(--shadow-sm);
        }

        .search-bar:focus-within {
          width: 280px;
          border-color: var(--primary);
          box-shadow: 0 0 0 4px var(--primary-light);
        }

        .search-bar input {
          background: none;
          border: none;
          color: var(--text-primary);
          width: 100%;
          outline: none;
        }

        .login-btn-new {
          background: var(--primary);
          color: white;
          padding: 0.7rem 1.5rem;
          border-radius: var(--radius-lg);
          font-weight: 700;
          box-shadow: 0 4px 15px rgba(99, 102, 241, 0.2);
        }

        .login-btn-new:hover {
          background: var(--primary-hover);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(99, 102, 241, 0.3);
        }

        .user-section {
          display: flex;
          align-items: center;
          gap: 1rem;
          position: relative;
        }

        .action-circle {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: white;
          border: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
        }

        .action-circle:hover {
          background: var(--primary-light);
          color: var(--primary);
          border-color: var(--primary);
        }

        .dot-badge {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 8px;
          height: 8px;
          background: var(--secondary);
          border-radius: 50%;
          border: 2px solid white;
        }

        .avatar-wrapper {
          cursor: pointer;
          border: 2px solid transparent;
          border-radius: 50%;
          padding: 2px;
          transition: var(--transition);
        }

        .avatar-wrapper:hover {
          border-color: var(--primary);
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
          box-shadow: var(--shadow-sm);
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid var(--border);
          box-shadow: var(--shadow-xl);
          border-radius: var(--radius-lg);
        }

        .user-dropdown {
          position: absolute;
          top: calc(100% + 15px);
          right: 0;
          width: 260px;
          overflow: hidden;
          z-index: 1001;
        }

        .user-profile-header {
          padding: 1.25rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .dropdown-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
        }

        .user-meta {
          display: flex;
          flex-direction: column;
        }

        .username-display {
          font-weight: 800;
          font-size: 1rem;
          color: var(--text-primary);
        }

        .user-role {
          font-size: 0.8rem;
          color: var(--text-secondary);
        }

        .dropdown-items {
          padding: 0.5rem;
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          color: var(--text-secondary);
          border-radius: var(--radius-md);
          font-weight: 600;
          font-size: 0.9rem;
          width: 100%;
        }

        .dropdown-item:hover {
          background: var(--primary-light);
          color: var(--primary);
        }

        .dropdown-item.logout { color: #f43f5e; }
        .dropdown-item.create-btn {
          background: linear-gradient(135deg, var(--primary), var(--accent));
          color: white;
          margin-bottom: 0.5rem;
        }
        
        .dropdown-item.create-btn:hover {
          transform: scale(1.02);
          color: white;
        }

        .dropdown-divider {
          height: 1px;
          background: var(--border);
          margin: 0.25rem 0;
        }

        @media (max-width: 1024px) {
          .desktop-only { display: none; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
