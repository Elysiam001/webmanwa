import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, User, Menu, X, BookOpen, Compass, History, 
  Bookmark, Settings, Power, Heart, Book, Layers, PlusCircle, CreditCard, Bell, ChevronRight, TrendingUp
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

  const closeAllMenus = () => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled glass' : ''}`}>
      <div className="container nav-content">
        <Link to="/" className="logo" onClick={closeAllMenus}>
          <div className="logo-icon-wrapper">
            <BookOpen className="logo-icon" size={20} />
          </div>
          <span className="logo-text">Manhwa<span className="gradient-text">Hub</span></span>
        </Link>

        {/* Desktop Links - Main Nav */}
        <div className="nav-links desktop-only">
          <Link to="/" className="nav-link active">Trang chủ</Link>
          <Link to="/genres" className="nav-link">Thể loại</Link>
          <Link to="/ranking" className="nav-link">Xếp hạng</Link>
        </div>

        <div className="nav-actions">
          <div className="search-bar desktop-only">
            <Search size={18} className="search-icon" />
            <input type="text" placeholder="Tìm kiếm truyện..." />
          </div>
          
          {user ? (
            <div className="user-section" ref={userMenuRef}>
              <button className="icon-btn action-circle desktop-only">
                <Bell size={20} />
                <span className="dot-badge"></span>
              </button>
              
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

              {/* User Dropdown (DESKTOP - NOW SYNCED WITH MOBILE SIDEBAR) */}
              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 15, scale: 0.95 }}
                    className="user-dropdown glass-card desktop-only"
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
                    
                    <div className="dropdown-body">
                      <p className="menu-label">Cá nhân</p>
                      <Link to="/profile" className="dropdown-item" onClick={closeAllMenus}>
                        <User size={18} /> Thông tin cá nhân
                      </Link>
                      <Link to="/settings" className="dropdown-item" onClick={closeAllMenus}>
                        <Settings size={18} /> Cài đặt
                      </Link>

                      <p className="menu-label">Thư viện của bạn</p>
                      <Link to="/history" className="dropdown-item" onClick={closeAllMenus}>
                        <History size={18} /> Lịch sử đọc
                      </Link>
                      <Link to="/follow" className="dropdown-item" onClick={closeAllMenus}>
                        <Heart size={18} /> Đang theo dõi
                      </Link>
                      <Link to="/stats" className="dropdown-item" onClick={closeAllMenus}>
                        <Layers size={18} /> Thế lực
                      </Link>

                      <p className="menu-label">Quản lý & Hỗ trợ</p>
                      <Link to="/donate" className="dropdown-item donate-item" onClick={closeAllMenus}>
                        <CreditCard size={18} /> Donate ủng hộ
                      </Link>
                      
                      <div className="dropdown-divider"></div>
                      
                      <Link to="/create-manga" className="dropdown-item create-btn" onClick={closeAllMenus}>
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
            <div className="auth-btns desktop-only">
               <Link to="/login" className="login-btn-new">Đăng nhập</Link>
               <Link to="/register" className="register-btn-outline">Đăng ký</Link>
            </div>
          )}

          <button 
            className="menu-btn mobile-only"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* MOBILE SIDEBAR (ALREADY HAS COMPLETE STRUCTURE) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mobile-overlay"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="mobile-sidebar glass"
            >
              <div className="sidebar-header">
                 <div className="logo">
                    <div className="logo-icon-wrapper">
                      <BookOpen className="logo-icon" size={18} />
                    </div>
                    <span className="logo-text">Manhwa<span className="gradient-text">Hub</span></span>
                  </div>
                  <button onClick={() => setIsMobileMenuOpen(false)}><X size={24} /></button>
              </div>

              {user ? (
                <div className="sidebar-user-info">
                  <img 
                    src={user.avatar || `https://ui-avatars.com/api/?name=${user.username}&background=6366f1&color=fff`} 
                    alt={user.username} 
                    className="sidebar-avatar"
                  />
                  <div className="user-meta">
                    <span className="username-display">{user.username}</span>
                    <span className="user-role">{user.role || 'Độc giả'}</span>
                  </div>
                </div>
              ) : (
                <div className="sidebar-auth-btns">
                  <Link to="/login" className="btn-sidebar-primary" onClick={closeAllMenus}>Đăng nhập</Link>
                  <Link to="/register" className="btn-sidebar-outline" onClick={closeAllMenus}>Đăng ký</Link>
                </div>
              )}

              <div className="sidebar-links">
                <p className="sidebar-label">Danh mục</p>
                <Link to="/" className="sidebar-link active" onClick={closeAllMenus}><Compass size={20} /> Trang chủ <ChevronRight size={16} /></Link>
                <Link to="/genres" className="sidebar-link" onClick={closeAllMenus}><Layers size={20} /> Thể loại <ChevronRight size={16} /></Link>
                <Link to="/ranking" className="sidebar-link" onClick={closeAllMenus}><TrendingUp size={20} /> Xếp hạng <ChevronRight size={16} /></Link>
                
                <p className="sidebar-label">Thư viện của bạn</p>
                <Link to="/history" className="sidebar-link" onClick={closeAllMenus}><History size={20} /> Lịch sử đọc</Link>
                <Link to="/follow" className="sidebar-link" onClick={closeAllMenus}><Heart size={20} /> Đang theo dõi</Link>
                <Link to="/stats" className="sidebar-link" onClick={closeAllMenus}><Layers size={20} /> Thế lực</Link>

                {user && (
                  <>
                    <p className="sidebar-label">Quản lý & Hỗ trợ</p>
                    <Link to="/create-manga" className="sidebar-link create-highlight" onClick={closeAllMenus}><PlusCircle size={20} /> Đăng truyện mới</Link>
                    <Link to="/donate" className="sidebar-link" onClick={closeAllMenus}><CreditCard size={20} /> Donate ủng hộ</Link>
                    <button onClick={logout} className="sidebar-link logout-btn-mobile"><Power size={20} /> Đăng xuất</button>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style jsx="true">{`
        .navbar { position: fixed; top: 0; left: 0; right: 0; height: 70px; z-index: 1000; transition: var(--transition); display: flex; align-items: center; background: transparent; }
        .navbar.scrolled { height: 60px; box-shadow: var(--shadow-md); }
        .nav-content { display: flex; align-items: center; justify-content: space-between; width: 100%; }
        .logo { display: flex; align-items: center; gap: 0.5rem; font-size: 1.25rem; font-weight: 800; }
        .logo-icon-wrapper { background: linear-gradient(135deg, var(--primary), var(--accent)); color: white; padding: 6px; border-radius: 10px; display: flex; }
        .nav-links { display: flex; gap: 1.5rem; }
        .nav-link { font-weight: 600; color: var(--text-secondary); font-size: 0.9rem; }
        .nav-link.active { color: var(--primary); }
        .nav-actions { display: flex; align-items: center; gap: 1rem; }
        .search-bar { background: white; border: 1px solid var(--border); border-radius: var(--radius-full); padding: 0.5rem 1rem; display: flex; align-items: center; gap: 0.5rem; width: 220px; }
        .search-bar input { background: none; border: none; width: 100%; outline: none; font-size: 0.85rem; }
        
        .auth-btns { display: flex; gap: 0.75rem; }
        .login-btn-new { background: var(--primary); color: white; padding: 0.6rem 1.2rem; border-radius: var(--radius-md); font-weight: 700; font-size: 0.9rem; }
        .register-btn-outline { border: 1px solid var(--border); color: var(--text-primary); padding: 0.6rem 1.2rem; border-radius: var(--radius-md); font-weight: 700; font-size: 0.9rem; }

        .user-section { display: flex; align-items: center; gap: 0.75rem; position: relative; }
        .user-avatar { width: 36px; height: 36px; border-radius: 50%; object-fit: cover; cursor: pointer; border: 2px solid transparent; }
        .user-avatar:hover { border-color: var(--primary); }

        .glass-card { background: white; border: 1px solid var(--border); box-shadow: 0 10px 40px rgba(0,0,0,0.15); border-radius: var(--radius-lg); overflow: hidden; }
        .user-dropdown { position: absolute; top: calc(100% + 15px); right: 0; width: 280px; z-index: 1001; }
        .dropdown-header { padding: 1.25rem; background: #f8fafc; }
        .user-profile-header { display: flex; align-items: center; gap: 1rem; }
        .dropdown-avatar { width: 48px; height: 48px; border-radius: 50%; }
        .username-display { font-weight: 800; color: var(--text-primary); font-size: 1rem; }
        .user-role { font-size: 0.8rem; color: var(--text-secondary); }
        
        .dropdown-body { padding: 1rem; }
        .menu-label { font-size: 0.7rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; margin: 1rem 0 0.5rem 0.5rem; }
        .dropdown-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1rem; color: var(--text-secondary); border-radius: var(--radius-md); font-weight: 600; font-size: 0.9rem; }
        .dropdown-item:hover { background: var(--primary-light); color: var(--primary); }
        .dropdown-item.create-btn { background: var(--primary); color: white; margin-top: 0.5rem; }
        .dropdown-item.logout { color: #f43f5e; border-top: 1px solid var(--border); border-radius: 0; margin-top: 0.5rem; }
        .donate-item { color: #0ea5e9; }

        .mobile-only { display: none; }
        .mobile-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); backdrop-filter: blur(4px); z-index: 2000; }
        .mobile-sidebar { position: fixed; top: 0; right: 0; bottom: 0; width: 85%; max-width: 320px; background: white; z-index: 2001; padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; overflow-y: auto; }
        .sidebar-header { display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--border); padding-bottom: 1rem; }
        .sidebar-user-info { display: flex; align-items: center; gap: 1rem; padding: 1.25rem; background: #f8fafc; border-radius: var(--radius-lg); }
        .sidebar-avatar { width: 50px; height: 50px; border-radius: 50%; }
        .sidebar-label { font-size: 0.75rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; margin: 1.5rem 0 0.75rem; }
        .sidebar-link { display: flex; align-items: center; justify-content: space-between; padding: 0.85rem; color: var(--text-secondary); font-weight: 600; border-radius: var(--radius-md); }
        .sidebar-link svg { color: var(--text-muted); }
        .sidebar-link.active { background: var(--primary-light); color: var(--primary); }
        .create-highlight { background: linear-gradient(135deg, var(--primary), var(--accent)); color: white !important; }
        .logout-btn-mobile { width: 100%; color: #f43f5e; border-top: 1px solid var(--border); border-radius: 0; margin-top: 1rem; }

        @media (max-width: 1024px) {
          .desktop-only { display: none; }
          .mobile-only { display: flex; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
