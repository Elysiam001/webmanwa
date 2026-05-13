import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, User, UserPlus, ArrowRight, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setError('Mật khẩu nhập lại không khớp!');
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
      
      alert('Đăng ký thành công! Đang chuyển đến trang đăng nhập...');
      navigate('/login');
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
            <UserPlus size={64} />
          </motion.div>
          <h2>Tham gia cộng đồng</h2>
          <p>Tạo tài khoản ngay để theo dõi, đánh giá và chia sẻ niềm đam mê truyện tranh cùng hàng nghìn người khác.</p>
          <div className="feature-list">
             <div className="feature-item"><CheckCircle size={18} /> Lưu lịch sử đọc</div>
             <div className="feature-item"><CheckCircle size={18} /> Theo dõi bộ truyện hot</div>
             <div className="feature-item"><CheckCircle size={18} /> Nhận thông báo sớm nhất</div>
          </div>
        </div>
      </div>

      <div className="auth-form-side">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="auth-card-clean"
        >
          <div className="auth-header-vibrant">
            <h1 className="gradient-text">Tạo tài khoản</h1>
            <p>Bắt đầu hành trình của bạn ngay hôm nay</p>
          </div>

          {error && <div className="error-alert-clean">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form-vibrant">
            <div className="input-group-clean">
              <label>Tên đăng nhập</label>
              <div className="input-field">
                <User size={20} />
                <input 
                  type="text" 
                  placeholder="Chọn tên đăng nhập"
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
                  placeholder="Mật khẩu của bạn"
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
            </div>

            <div className="input-group-clean">
              <label>Xác nhận mật khẩu</label>
              <div className="input-field">
                <Lock size={20} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Nhập lại mật khẩu"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-auth-primary">
              Tạo tài khoản <ArrowRight size={20} />
            </button>
          </form>

          <div className="auth-footer-clean">
            <span>Đã có tài khoản?</span>
            <Link to="/login" className="switch-auth">Đăng nhập</Link>
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
        .visual-content p { font-size: 1.1rem; opacity: 0.9; max-width: 400px; line-height: 1.6; margin-bottom: 2rem; }
        .visual-logo { margin-bottom: 2rem; color: rgba(255, 255, 255, 0.3); }

        .feature-list { display: flex; flex-direction: column; gap: 0.75rem; align-items: center; }
        .feature-item { display: flex; align-items: center; gap: 0.5rem; font-weight: 600; opacity: 0.9; }

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

        .auth-header-vibrant { margin-bottom: 2rem; }
        .auth-header-vibrant h1 { font-size: 2rem; font-weight: 800; margin-bottom: 0.5rem; }
        .auth-header-vibrant p { color: var(--text-secondary); font-weight: 500; }

        .auth-form-vibrant { display: flex; flex-direction: column; gap: 1.25rem; }

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
          padding: 0.85rem 0;
          background: none;
          border: none;
          outline: none;
          font-weight: 600;
          color: var(--text-primary);
        }

        .eye-toggle { color: var(--text-muted); }

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

export default Register;
