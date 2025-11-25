import React, { useEffect , useState } from 'react';
import { Link } from 'react-router-dom';
import api from "../services/api";
import { Zap, BarChart3, Shield, Brain, ArrowRight, Play } from 'lucide-react';
import './WelcomePage.css';

const WelcomePage = () => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);


  const features = [
    {
      icon: <BarChart3 className="feature-icon" />,
      title: "Live Usage Tracking",
      description: "See your electricity usage as it happens - no more surprises on your bill"
    },
    {
      icon: <Brain className="feature-icon" />,
      title: "Money-Saving Tips",
      description: "Get practical advice on how to reduce your monthly electricity costs"
    },
    {
      icon: <Shield className="feature-icon" />,
      title: "Bill Alerts",
      description: "Get notified when your usage is higher than usual"
    }
  ];
  useEffect(() => {
   const fetchSummary = async () => {
    try {
      const res = await api.get("/energy/summary");
      setSummary(res.data || {});
    } catch (err) {
      console.error("Error fetching summary data:", err);
    } finally {
      setLoading(false);
    }
   };
   fetchSummary();
  }, []);


  return (
    <div className="welcome-page">
      {/* Background Animation */}
      <div className="background-animation">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
        </div>
      </div>

      {/* Header */}
      <header className="welcome-header">
        <div className="logo">
          <Zap className="logo-icon" />
          <span className="logo-text">EchoTrack</span>
        </div>
        <nav className="nav-links">
          <a href="#features">Features</a>
          <a href="#about">About</a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Track Your
              <span className="gradient-text"> Energy Usage</span>
              <br />
              Save Money Daily
            </h1>
            <p className="hero-description">
              See exactly how much electricity you're using in real-time. 
              Get simple tips to cut your bills and track your savings month by month.
            </p>
            <div className="hero-buttons">
              <Link to="/login" className="btn btn-primary">
                Get Started
                <ArrowRight className="btn-icon" />
              </Link>
            </div>
          </div>
          {/*<div className="hero-visual">
            <div className="dashboard-preview">
              <div className="preview-header">
                <div className="preview-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span className="preview-title">EchoTrack Dashboard</span>
              </div>
              <div className="preview-content">
                {loading ? (
                  <p className="metric-loading">Loading data...</p>
                ) : (
                  <div className="preview-card">
                   <div className="preview-metric">
                    <span className="metric-value">
                     ₹{summary.todayCost || 0}
                    </span>
                    <span className="metric-label">Today's Cost</span>
                   </div>
                   <div className="preview-metric">
                    <span className="metric-value">
                     {summary.totalUsage ? `${summary.totalUsage} kWh` : "N/A"}
                    </span>
                    <span className="metric-label">Total Usage</span>
                   </div>
                   <div className="preview-metric">
                    <span className="metric-value">
                     {summary.efficiency ? `${summary.efficiency}%` : "N/A"}
                    </span>
                    <span className="metric-label">Efficiency</span>
                   </div>
                  </div>
               )}
              </div>
            </div>
          </div>*/}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="container">
          <h2 className="section-title">Why Choose EchoTrack?</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon-container">
                  {feature.icon}
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Transform Your Energy Usage?</h2>
            <p className="cta-description">
              Join thousands of users who are already saving energy and money with EchoTrack
            </p>
            <div className="cta-buttons">
              <Link to="/signup" className="btn btn-primary btn-large">
                Create Account
                <ArrowRight className="btn-icon" />
              </Link>
              <Link to="/login" className="btn btn-outline btn-large">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="welcome-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">
              <Zap className="logo-icon" />
              <span className="logo-text">EchoTrack</span>
            </div>
            <p className="footer-text">
              © 2024 EchoTrack. All rights reserved. Smart energy monitoring for a sustainable future.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WelcomePage;
