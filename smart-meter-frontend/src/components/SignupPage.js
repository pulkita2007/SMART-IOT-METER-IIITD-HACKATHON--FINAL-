import React, { useState } from 'react';
import api from "../services/api"; // optional wrapper
import { Link, useNavigate } from 'react-router-dom';
import { Zap, ArrowLeft, User, Mail, Phone, Lock } from 'lucide-react';
import './AuthPages.css';

const SignupPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirm: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErr = {};
    if (!form.name) newErr.name = 'Name required';
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) newErr.email = 'Valid email required';
    if (!form.password || form.password.length < 6) newErr.password = '6+ chars';
    if (form.password !== form.confirm) newErr.confirm = "Passwords don't match";
    setErrors(newErr);
    return Object.keys(newErr).length === 0;
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!validate()) return;
  //   setIsLoading(true);

  //   try {
  //     // ---------- REAL API (uncomment when backend ready) ----------
  //     const res = await api.post('/api/users/register', {
  //       name: form.name, email: form.email, password: form.password
  //     });
  //     if (res.data && res.data.token) {
  //       localStorage.setItem('token', res.data.token);
  //       navigate('/dashboard');
  //     }
  //     // ------------------------------------------------------------

  //     // Simulated:
  //     setTimeout(() => {
  //       setIsLoading(false);
  //       localStorage.setItem('token', 'dummy-token');
  //       navigate('/dashboard');
  //     }, 1000);
  //   } catch (err) {
  //     console.error('Signup error', err);
  //     setIsLoading(false);
  //     alert('Signup failed. Check console.');
  //   }
  // };


  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validate()) return;
  setIsLoading(true);

  try {
    const res = await api.post('/api/users/register', {
      name: form.name,
      email: form.email,
      password: form.password,
    });

    if (res.data && res.data.success) {
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } else {
      alert(res.data.message || 'Signup failed.');
    }
  } catch (err) {
    console.error('Signup error', err.response?.data || err);
    alert(err.response?.data?.message || 'Signup failed. Please try again.');
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <Link to="/" className="back-button">
              <ArrowLeft /> Back to Home
            </Link>
            <div className="auth-logo">
              <Zap className="logo-icon" />
              <span className="logo-text">EchoTrack</span>
            </div>
            <h1 className="auth-title">Create Account</h1>
            <p className="auth-subtitle">Sign up to start tracking and saving on energy</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label"><User className="input-icon" /> Full Name</label>
              <input name="name" value={form.name} onChange={handleChange} className={`form-input ${errors.name ? 'error' : ''}`} placeholder="Your name" />
              {errors.name && <div className="error-message">{errors.name}</div>}
            </div>

            <div className="form-group">
              <label className="form-label"><Mail className="input-icon" /> Email</label>
              <input name="email" value={form.email} onChange={handleChange} className={`form-input ${errors.email ? 'error' : ''}`} placeholder="you@example.com" />
              {errors.email && <div className="error-message">{errors.email}</div>}
            </div>

            <div className="form-group">
              <label className="form-label"><Phone className="input-icon" /> Phone (optional)</label>
              <input name="phone" value={form.phone} onChange={handleChange} className="form-input" placeholder="9999999999" />
            </div>

            <div className="form-group">
              <label className="form-label"><Lock className="input-icon" /> Password</label>
              <input name="password" type="password" value={form.password} onChange={handleChange} className={`form-input ${errors.password ? 'error' : ''}`} placeholder="Create a password" />
              {errors.password && <div className="error-message">{errors.password}</div>}
            </div>

            <div className="form-group">
              <label className="form-label"><Lock className="input-icon" /> Confirm Password</label>
              <input name="confirm" type="password" value={form.confirm} onChange={handleChange} className={`form-input ${errors.confirm ? 'error' : ''}`} placeholder="Confirm password" />
              {errors.confirm && <div className="error-message">{errors.confirm}</div>}
            </div>

            <button type="submit" className={`submit-button ${isLoading ? 'loading' : ''}`} disabled={isLoading}>
              {isLoading ? <> <div className="spinner"></div> Creating Account...</> : 'Create Account'}
            </button>
          </form>

          <div className="auth-footer">
            <p>Already have an account? <Link to="/login" className="auth-link">Sign in here</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
