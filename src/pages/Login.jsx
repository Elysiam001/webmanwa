import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Globe, Smartphone, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Giả lập đăng nhập thành công
    navigate('/');
  };

  return (
    <div className="auth-page">
      <div className="auth-container glass animate-fade-in">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="auth-header"
        >
          <h1 className="auth-title">Chào mừng trở lại</h1>
          <p className="auth-subtitle">Đăng nhập để theo dõi bộ truyện yêu thích của bạn</p>
        </motion.div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email</label>
            <div className="input-wrapper">
              <Mail size={20} className="input-icon" />
              <input type="email" placeholder="name@example.com" required />
            </div>
          </div>

          <div className="input-group">
            <div className="label-row">
              <label>Mật khẩu</label>
              <Link to="/forgot-password" size={12} className="forgot-link">Quên mật khẩu?</Link>
            </div>
            <div className="input-wrapper">
              <Lock size={20} className="input-icon" />
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                required 
              />
              <button 
                type="button" 
                className="eye-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button type="submit" className="submit-btn">
            Đăng nhập <ArrowRight size={20} />
          </button>
        </form>

        <div className="auth-divider">
          <span>Hoặc tiếp tục với</span>
        </div>

        <div className="social-btns">
          <button className="social-btn glass">
            <Globe size={20} /> Google
          </button>
          <button className="social-btn glass">
            <Smartphone size={20} /> Facebook
          </button>
        </div>

        <p className="auth-footer">
          Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
        </p>
      </div>

      <style jsx="true">{`
        .auth-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          background: radial-gradient(circle at top right, rgba(139, 92, 246, 0.15), transparent 40%),
                      radial-gradient(circle at bottom left, rgba(6, 182, 212, 0.15), transparent 40%);
        }

        .auth-container {
          width: 100%;
          max-width: 450px;
          padding: 3rem;
          border-radius: var(--radius-lg);
        }

        .auth-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .auth-title {
          font-size: 2rem;
          font-weight: 800;
          margin-bottom: 0.5rem;
        }

        .auth-subtitle {
          color: var(--text-secondary);
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .forgot-link {
          font-size: 0.85rem;
          color: var(--primary);
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 1rem;
          color: var(--text-muted);
        }

        .input-wrapper input {
          width: 100%;
          background: var(--bg-surface-elevated);
          border: 1px solid var(--border);
          padding: 0.8rem 1rem 0.8rem 3rem;
          border-radius: var(--radius-md);
          color: white;
          outline: none;
          transition: var(--transition);
        }

        .input-wrapper input:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.1);
        }

        .eye-btn {
          position: absolute;
          right: 1rem;
          color: var(--text-muted);
        }

        .submit-btn {
          background: var(--primary);
          color: white;
          padding: 1rem;
          border-radius: var(--radius-md);
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          margin-top: 0.5rem;
        }

        .submit-btn:hover {
          background: var(--primary-hover);
          transform: translateY(-2px);
        }

        .auth-divider {
          margin: 2rem 0;
          display: flex;
          align-items: center;
          gap: 1rem;
          color: var(--text-muted);
          font-size: 0.85rem;
        }

        .auth-divider::before, .auth-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: var(--border);
        }

        .social-btns {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .social-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem;
          border-radius: var(--radius-md);
          color: white;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .auth-footer {
          text-align: center;
          color: var(--text-secondary);
          font-size: 0.95rem;
        }

        .auth-footer a {
          color: var(--primary);
          font-weight: 600;
        }

        @media (max-width: 480px) {
          .auth-container { padding: 2rem; }
          .social-btns { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default Login;
