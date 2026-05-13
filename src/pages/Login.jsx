import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, User, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      
      login(data.user, data.token);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-page-new">
      <div className="auth-visual desktop-only">
        <div className="visual-content">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="visual-logo"
          >
            <ShieldCheck size={64} />
          </motion.div>
          <h2>Bảo mật & Tin cậy</h2>
          <p>Chào mừng bạn quay trở lại với cộng đồng ManhwaHub. Hãy đăng nhập để tiếp tục hành trình của mình.</p>
        </div>
      </div>

      <div className="auth-form-side">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="auth-card-clean"
        >
          <div className="auth-header-vibrant">
            <h1 className="gradient-text">Chào mừng trở lại!</h1>
            <p>Vui lòng nhập thông tin đăng nhập của bạn</p>
          </div>

          {error && <div className="error-alert-clean">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form-vibrant">
            <div className="input-group-clean">
              <label>Tên đăng nhập</label>
              <div className="input-field">
                <User size={20} />
                <input 
                  type="text" 
                  placeholder="Nhập tên đăng nhập"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="input-group-clean">
              <label>Mật khẩu</label>
              <div className="input-field">
                <Lock size={20} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                />
                <button 
                  type="button" 
                  className="eye-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <Link to="/forgot-password" alt="Quên mật khẩu?" className="forgot-link">Quên mật khẩu?</Link>
            </div>

            <button type="submit" className="btn-auth-primary">
              Đăng nhập ngay <ArrowRight size={20} />
            </button>
          </form>

          <div className="auth-footer-clean">
            <span>Chưa có tài khoản?</span>
            <Link to="/register" className="switch-auth">Đăng ký miễn phí</Link>
          </div>
        </motion.div>
      </div>

      <style jsx="true">{`
        .auth-page-new {
          display: flex;
          min-height: 100vh;
          background: #ffffff;
        }

        .auth-visual {
          flex: 1;
          background: linear-gradient(135deg, var(--primary), var(--accent));
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4rem;
          color: white;
          text-align: center;
        }

        .visual-content h2 { font-size: 2.5rem; font-weight: 800; margin-bottom: 1rem; }
        .visual-content p { font-size: 1.1rem; opacity: 0.9; max-width: 400px; line-height: 1.6; }
        .visual-logo { margin-bottom: 2rem; color: rgba(255, 255, 255, 0.3); }

        .auth-form-side {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          background: #f8fafc;
        }

        .auth-card-clean {
          width: 100%;
          max-width: 450px;
          padding: 3rem;
          background: white;
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-xl);
        }

        .auth-header-vibrant { margin-bottom: 2.5rem; }
        .auth-header-vibrant h1 { font-size: 2rem; font-weight: 800; margin-bottom: 0.5rem; }
        .auth-header-vibrant p { color: var(--text-secondary); font-weight: 500; }

        .auth-form-vibrant { display: flex; flex-direction: column; gap: 1.5rem; }

        .input-group-clean { display: flex; flex-direction: column; gap: 0.5rem; }
        .input-group-clean label { font-weight: 700; font-size: 0.9rem; color: var(--text-primary); }

        .input-field {
          position: relative;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: #f1f5f9;
          padding: 0 1rem;
          border-radius: var(--radius-md);
          border: 2px solid transparent;
          transition: var(--transition);
        }

        .input-field:focus-within {
          border-color: var(--primary);
          background: white;
          box-shadow: 0 0 0 4px var(--primary-light);
        }

        .input-field input {
          width: 100%;
          padding: 1rem 0;
          background: none;
          border: none;
          outline: none;
          font-weight: 600;
          color: var(--text-primary);
        }

        .eye-toggle { color: var(--text-muted); }
        .forgot-link { align-self: flex-end; font-size: 0.85rem; font-weight: 600; color: var(--primary); }

        .btn-auth-primary {
          background: var(--primary);
          color: white;
          padding: 1rem;
          border-radius: var(--radius-md);
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
          margin-top: 1rem;
        }

        .btn-auth-primary:hover {
          background: var(--primary-hover);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(99, 102, 241, 0.3);
        }

        .error-alert-clean {
          background: #fff1f2;
          color: #e11d48;
          padding: 0.75rem;
          border-radius: var(--radius-md);
          margin-bottom: 1.5rem;
          font-size: 0.9rem;
          font-weight: 600;
          border: 1px solid #ffe4e6;
          text-align: center;
        }

        .auth-footer-clean {
          margin-top: 2rem;
          text-align: center;
          font-size: 0.95rem;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .switch-auth { color: var(--primary); font-weight: 700; margin-left: 0.5rem; }

        @media (max-width: 1024px) {
          .auth-visual { display: none; }
        }
      `}</style>
    </div>
  );
};

export default Login;
