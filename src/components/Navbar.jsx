import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, User, Menu, X, BookOpen, Compass, History, 
  Bookmark, Settings, Power, Heart, Book, Layers, PlusCircle, CreditCard
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
      setIsScrolled(window.scrollY > 20);
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
            <div className="user-section" ref={userMenuRef}>
              <div 
                className="avatar-wrapper"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                <img 
                  src={user.avatar || `https://ui-avatars.com/api/?name=${user.username}&background=random`} 
                  alt={user.username} 
                  className="user-avatar"
                />
                <div className="notification-badge">208</div>
              </div>

              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="user-dropdown glass"
                  >
                    <div className="dropdown-header">
                      <span className="username-display">{user.username}•</span>
                    </div>
                    
                    <div className="dropdown-divider"></div>
                    
                    <div className="dropdown-items">
                      <Link to="/profile" className="dropdown-item">
                        <User size={18} /> Thông tin cá nhân
                      </Link>
                      <Link to="/settings" className="dropdown-item">
                        <Settings size={18} /> Cài đặt
                      </Link>
                      <Link to="/stats" className="dropdown-item">
                        <Layers size={18} /> Thế lực
                      </Link>
                      
                      <button onClick={logout} className="dropdown-item logout">
                        <Power size={18} /> Đăng xuất
                      </button>

                      <div className="dropdown-divider"></div>
                      
                      <Link to="/donate" className="dropdown-item donate">
                        <CreditCard size={18} /> Donate
                      </Link>

                      <div className="dropdown-divider"></div>

                      <Link to="/bookmarks" className="dropdown-item">
                        <Bookmark size={18} /> Truyện đánh dấu
                      </Link>
                      <Link to="/history" className="dropdown-item">
                        <History size={18} /> Truyện đã đọc
                      </Link>
                      <Link to="/following" className="dropdown-item">
                        <Heart size={18} /> Truyện theo dõi
                      </Link>
                      <Link to="/my-manga" className="dropdown-item">
                        <Book size={18} /> Truyện tôi thầu
                      </Link>

                      <div className="dropdown-divider"></div>

                      <Link to="/create-manga" className="dropdown-item create-btn">
                        <PlusCircle size={18} /> Đăng truyện
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
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
          border-bottom: 1px solid var(--border);
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
        }

        .logo-icon { color: var(--primary); }

        .nav-links {
          display: flex;
          gap: 2rem;
        }

        .nav-link {
          font-weight: 500;
          color: var(--text-secondary);
          position: relative;
        }

        .nav-link.active { color: var(--text-primary); }

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
          width: 200px;
          transition: var(--transition);
        }

        .search-bar:focus-within { width: 250px; border-color: var(--primary); }

        .search-bar input {
          background: none;
          border: none;
          color: var(--text-primary);
          width: 100%;
          outline: none;
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
        }

        /* User Section & Dropdown Styles */
        .user-section {
          position: relative;
        }

        .avatar-wrapper {
          position: relative;
          cursor: pointer;
          transition: var(--transition);
        }

        .avatar-wrapper:hover {
          transform: scale(1.05);
        }

        .user-avatar {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          border: 2px solid var(--border);
          object-fit: cover;
        }

        .notification-badge {
          position: absolute;
          top: -5px;
          right: -5px;
          background: #ef4444;
          color: white;
          font-size: 0.65rem;
          padding: 2px 6px;
          border-radius: 10px;
          border: 2px solid var(--bg-body);
        }

        .user-dropdown {
          position: absolute;
          top: calc(100% + 15px);
          right: 0;
          width: 240px;
          padding: 0.5rem;
          border-radius: var(--radius-lg);
          border: 1px solid var(--border);
          box-shadow: var(--shadow-xl);
          background: rgba(15, 15, 18, 0.95);
        }

        .dropdown-header {
          padding: 0.75rem 1rem;
        }

        .username-display {
          font-weight: 700;
          font-size: 1.1rem;
          color: var(--text-primary);
        }

        .dropdown-divider {
          height: 1px;
          background: var(--border);
          margin: 0.5rem 0;
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          color: var(--text-secondary);
          border-radius: var(--radius-md);
          font-weight: 500;
          transition: var(--transition);
          width: 100%;
          text-align: left;
        }

        .dropdown-item:hover {
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-primary);
        }

        .dropdown-item.logout { color: #ef4444; }
        .dropdown-item.donate { color: #3b82f6; }
        .dropdown-item.create-btn { 
          color: #ef4444; 
          font-weight: 600;
        }

        .dropdown-item.create-btn:hover {
          background: rgba(239, 68, 68, 0.1);
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
          background: var(--bg-body);
        }

        .mobile-only { display: none; }

        @media (max-width: 1024px) {
          .desktop-only { display: none; }
          .mobile-only { display: flex; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
