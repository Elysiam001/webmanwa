import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Kiểm tra mật khẩu khớp nhau
    if (formData.password !== formData.confirmPassword) {
      return setError('Mật khẩu nhập lại không khớp');
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      
      alert('Đăng ký thành công! Hãy đăng nhập.');
      navigate('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container glass animate-fade-in">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="auth-header"
        >
          <h1 className="auth-title">Tham gia ngay</h1>
          <p className="auth-subtitle">Tạo tài khoản bằng tên đăng nhập</p>
          {error && <div className="error-alert">{error}</div>}
        </motion.div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Tên đăng nhập</label>
            <div className="input-wrapper">
              <User size={20} className="input-icon" />
              <input 
                type="text" 
                placeholder="Ví dụ: tencuaban123" 
                required 
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
              />
            </div>
          </div>

          <div className="input-group">
            <label>Mật khẩu</label>
            <div className="input-wrapper">
              <Lock size={20} className="input-icon" />
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                required 
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <div className="input-group">
            <label>Nhập lại mật khẩu</label>
            <div className="input-wrapper">
              <Lock size={20} className="input-icon" />
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                required 
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
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
            Tạo tài khoản <ArrowRight size={20} />
          </button>
        </form>

        <p className="auth-footer" style={{ marginTop: '2.5rem' }}>
          Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
        </p>
      </div>

      <style jsx="true">{`
        /* Kế thừa style từ Login.jsx (đã viết trong index.css hoặc dùng chung) */
        /* Ở đây tôi viết lại một số style đặc thù nếu cần */
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

        .auth-header { text-align: center; margin-bottom: 2.5rem; }
        .auth-title { font-size: 2rem; font-weight: 800; margin-bottom: 0.5rem; }
        .auth-subtitle { color: var(--text-secondary); }
        .auth-form { display: flex; flex-direction: column; gap: 1.5rem; }
        .input-group { display: flex; flex-direction: column; gap: 0.5rem; }
        .input-wrapper { position: relative; display: flex; align-items: center; }
        .input-icon { position: absolute; left: 1rem; color: var(--text-muted); }
        .input-wrapper input {
          width: 100%;
          background: var(--bg-surface-elevated);
          border: 1px solid var(--border);
          padding: 0.8rem 1rem 0.8rem 3rem;
          border-radius: var(--radius-md);
          color: white;
          outline: none;
        }
        .input-wrapper input:focus { border-color: var(--primary); }
        .eye-btn { position: absolute; right: 1rem; color: var(--text-muted); }
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
        }
        .auth-footer { text-align: center; color: var(--text-secondary); }
        .auth-footer a { color: var(--primary); font-weight: 600; }
      `}</style>
    </div>
  );
};

export default Register;
