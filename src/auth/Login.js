import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { FaUser, FaLock, FaGoogle, FaFacebook, FaEye, FaEyeSlash } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        toast.success('Сәтті кірдіңіз!');
        navigate('/');
      } else {
        toast.error(result.error || 'Кіру қатесі');
      }
    } catch (error) {
      toast.error('Желі қатесі');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    toast.success(`${provider} арқылы кіру жақында қосылады`);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <div className="auth-logo">
            <span className="logo-icon">💰</span>
            <h1>CoinKeeper</h1>
          </div>
          <p className="auth-subtitle">Жеке қаржыңызды басқарыңыз</p>
        </div>

        <div className="auth-card">
          <h2>Жүйеге кіру</h2>
          
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Электрондық пошта</label>
              <div className="input-with-icon">
                <FaUser className="input-icon" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="email@example.com"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Құпиясөз</label>
              <div className="input-with-icon">
                <FaLock className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="form-options">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={(e) => setFormData({...formData, rememberMe: e.target.checked})}
                  disabled={isLoading}
                />
                <span>Мені есте сақтау</span>
              </label>
              <Link to="/forgot-password" className="forgot-link">
                Құпиясөзді ұмыттыңыз ба?
              </Link>
            </div>

            <button
              type="submit"
              className="btn btn-primary auth-btn"
              disabled={isLoading}
            >
              {isLoading ? 'Кіру...' : 'Кіру'}
            </button>

            <div className="social-login">
              <p className="divider">Немесе әлеуметтік желілермен</p>
              <div className="social-buttons">
                <button
                  type="button"
                  className="social-btn google"
                  onClick={() => handleSocialLogin('Google')}
                  disabled={isLoading}
                >
                  <FaGoogle /> Google
                </button>
                <button
                  type="button"
                  className="social-btn facebook"
                  onClick={() => handleSocialLogin('Facebook')}
                  disabled={isLoading}
                >
                  <FaFacebook /> Facebook
                </button>
              </div>
            </div>
          </form>

          <div className="auth-footer">
            <p>
              Тіркелмегенсіз бе?{' '}
              <Link to="/register" className="auth-link">
                Тіркелу
              </Link>
            </p>
          </div>
        </div>

        <div className="auth-features">
          <div className="feature">
            <h4>📊 Толық статистика</h4>
            <p>Қаржылық көрсеткіштерді бақылаңыз</p>
          </div>
          <div className="feature">
            <h4>💰 Бюджет басқару</h4>
            <p>Шығындарыңызды бақылаңыз</p>
          </div>
          <div className="feature">
            <h4>🔒 Қауіпсіздік</h4>
            <p>Деректеріңіз қорғалған</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
