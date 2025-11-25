import React, { useState } from 'react';
import api from "../services/api"; // optional, your api wrapper. Keep if present.
import { Link, useNavigate } from 'react-router-dom';
import { Zap, Eye, EyeOff, ArrowLeft, Mail, Lock } from 'lucide-react';
import './AuthPages.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email';

    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be 6+ chars';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      // ---------- REAL API (uncomment when backend + JWT ready) ----------
      const res = await api.post('/api/users/login', {
        email: formData.email,
        password: formData.password
      });
      // save token to localStorage (example)
      if (res.data && res.data.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem("userId", res.data.user.id);
        // redirect to dashboard
        navigate('/dashboard');
      }
      // -------------------------------------------------------------------
      // SIMULATED success (for frontend testing without backend)
      // setTimeout(() => {
      //   setIsLoading(false);
      //   // simulated: store dummy token and go to dashboard
      //   localStorage.setItem('token', 'dummy-token');
      //   navigate('/dashboard');
      // }, 900);
    } catch (err) {
      console.error('Login error', err);
      setIsLoading(false);
      alert('Login failed. Check console for details.');
    }
  };

  const handleForgotPassword = () => {
    alert('Password reset link will be sent (simulated).');
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <Link to="/" className="back-button">
              <ArrowLeft className="back-icon" /> Back to Home
            </Link>
            <div className="auth-logo">
              <Zap className="logo-icon" />
              <span className="logo-text">EchoTrack</span>
            </div>
            <h1 className="auth-title">Welcome Back</h1>
            <p className="auth-subtitle">Sign in to continue monitoring your energy usage</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">
                <Mail className="input-icon" /> Email Address
              </label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="Enter your email"
                disabled={isLoading}
              />
              {errors.email && <div className="error-message">{errors.email}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">
                <Lock className="input-icon" /> Password
              </label>
              <div className="password-input-container">
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(prev => !prev)}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
              {errors.password && <div className="error-message">{errors.password}</div>}
            </div>

            <div className="form-options">
              <label className="checkbox-container">
                <input type="checkbox" />
                <span className="checkmark"></span> Remember me
              </label>
              <button type="button" className="forgot-password" onClick={handleForgotPassword}>
                Forgot Password?
              </button>
            </div>

            <button type="submit" className={`submit-button ${isLoading ? 'loading' : ''}`} disabled={isLoading}>
              {isLoading ? (<><div className="spinner"></div> Signing In...</>) : 'Sign In'}
            </button>
          </form>

          <div className="auth-footer">
            <p>Don't have an account? <Link to="/signup" className="auth-link">Create one</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
