import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import {
  Zap,
  BarChart3,
  Lightbulb,
  Bell,
  User,
  AlertTriangle,
  AlertCircle,
  MapPin,
  Thermometer,
  MessageCircle,
  CheckCircle,
  XCircle,
  DollarSign,
} from "lucide-react";
import "./Dashboard.css";

const AlertsPage = () => {
  const [activeTab, setActiveTab] = useState("alerts");
  const [showChatbot, setShowChatbot] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  // 🔹 Fetch existing alerts
  // useEffect(() => {
  //   const fetchAlerts = async () => {
  //     try {
  //       const res = await api.get("/api/alerts");
  //       setAlerts(res.data);
  //     } catch (err) {
  //       console.error("Error fetching alerts:", err);
  //     }
  //   };
  //   fetchAlerts();
  // }, []);
//   useEffect(() => {
//   const fetchAlerts = async () => {
//     try {
//       const res = await api.get("/api/alerts");
//       const allAlerts = res.data?.alerts || [];

//       // Split normal alerts and AI ones
//       const aiAlerts = allAlerts.filter(a => a.alertType === "recommendation");
//       const normalAlerts = allAlerts.filter(a => a.alertType !== "recommendation");

//       setAlerts(normalAlerts);
//       setSuggestions(
//         aiAlerts.map((a, i) => ({
//           id: a._id || i,
//           title: "AI Recommendation",
//           description: a.message,
//           color: "#00d4ff",
//           applied: false,
//         }))
//       );
//     } catch (err) {
//       console.error("Error fetching alerts:", err);
//     }
//   };
//   fetchAlerts();
// }, []);

useEffect(() => {
  const fetchAlerts = async () => {
    try {
      const res = await api.get("/api/alerts");
      const allAlerts = Array.isArray(res.data) ? res.data : res.data.alerts || [];

      const aiAlerts = allAlerts.filter(a => a.alertType === "recommendation");
      const normalAlerts = allAlerts.filter(a => a.alertType !== "recommendation");

      setAlerts(
        normalAlerts.map(a => ({
          id: a._id,
          title: a.alertType || "Alert",
          description: a.message,
          severity: a.severity || "medium",
          color:
            a.alertType === "voltage"
              ? "#ff4444"
              : a.alertType === "current"
              ? "#ffa726"
              : "#00c851",
          timestamp: new Date(a.timestamp).toLocaleString(),
        }))
      );

      setSuggestions(
        aiAlerts.map((a, i) => ({
          id: a._id || i,
          title: "AI Recommendation",
          description: a.message,
          color: "#00d4ff",
          applied: false,
        }))
      );
    } catch (err) {
      console.error("Error fetching alerts:", err);
    }
  };
  fetchAlerts();
}, []);



  // 🔹 Fetch AI Suggestions dynamically from Python model
  // useEffect(() => {
  //   const fetchAISuggestions = async () => {
  //     try {
  //       const res = await api.post("/api/ai/predict-recommendation", {
  //         powerConsumption: [120, 135, 150, 160, 170],
  //         electricalParameters: {
  //           voltage: [230, 231, 229, 232, 230],
  //           current: [1.2, 1.3, 1.4, 1.5, 1.6],
  //         },
  //         environmentalData: {
  //           temperature: [25, 26, 27, 28, 29],
  //           humidity: [45, 50, 48, 52, 49],
  //         },
  //       });

  //       if (res.data?.aiResult?.data?.recommendations) {
  //         const aiRecs = res.data.aiResult.data.recommendations.map((rec, i) => ({
  //           id: i + 1,
  //           title: `AI Suggestion ${i + 1}`,
  //           description: rec,
  //           color: "#00d4ff",
  //           applied: false,
  //         }));
  //         setSuggestions(aiRecs);
  //       }
  //     } catch (err) {
  //       console.error("Error fetching AI suggestions:", err);
  //     }
  //   };

  //   fetchAISuggestions();
  // }, []);

// 🔹 Fetch AI-generated alerts from backend
// useEffect(() => {
//   const fetchAISuggestions = async () => {
//     try {
//       const res = await api.get("/api/alerts"); // Fetch all alerts
//       const aiAlerts = res.data.filter(
//         (a) => a.deviceId === "AI_RECOMMENDER" || a.alertType === "recommendation"
//       );

//       const formatted = aiAlerts.map((a, i) => ({
//         id: a._id || i + 1,
//         title: `AI Suggestion ${i + 1}`,
//         description: a.message,
//         color: "#00d4ff",
//         applied: false,
//       }));

//       setSuggestions(formatted);
//     } catch (err) {
//       console.error("Error fetching AI alerts:", err);
//     }
//   };

//   fetchAISuggestions();
// }, []);


  const navigationItems = [
    { id: "overview", label: "Overview", icon: BarChart3, path: "/dashboard" },
    { id: "trend", label: "Trend Analysis", icon: BarChart3, path: "/trend-analysis" },
    { id: "alerts", label: "Alerts", icon: Bell, path: "/alerts" },
    { id: "devices", label: "Devices", icon: Lightbulb, path: "/devices" },
    { id: "cost", label: "Cost & Efficiency", icon: DollarSign, path: "/cost-efficiency" },
  ];

  const handleDismissAlert = (alertId) => {
    setAlerts(alerts.filter((alert) => alert.id !== alertId));
  };

  const handleApplySuggestion = (suggestionId) => {
    setSuggestions(
      suggestions.map((suggestion) =>
        suggestion.id === suggestionId ? { ...suggestion, applied: true } : suggestion
      )
    );
    alert("Suggestion applied successfully!");
  };

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <Zap className="logo-icon" />
            <span className="logo-text">EchoTrack</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navigationItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className={`nav-item ${activeTab === item.id ? "active" : ""}`}
              onClick={() => setActiveTab(item.id)}
            >
              <item.icon className="nav-icon" />
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* <div className="sidebar-footer">
          <button className="chatbot-button" onClick={() => setShowChatbot(!showChatbot)}>
            <MessageCircle className="chatbot-icon" />
            Ask our AI Assistant
          </button>
        </div> */}
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Header */}
        <header className="dashboard-header">
          <div className="header-left">
            <h1 className="dashboard-title">Alerts & Notifications</h1>
            <p className="dashboard-subtitle">
              Stay informed about your energy consumption and system status
            </p>
          </div>
          {/* <div className="header-right">
            <button className="notification-button">
              <Bell className="notification-icon" />
            </button>
            <div className="user-profile">
              <User className="user-icon" />
            </div>
          </div> */}
        </header>

        {/* Active Alerts */}
        <section className="alerts-section">
          <h2 className="section-title">Active Alerts</h2>
          <div className="alerts-list">
            {alerts.map((alert) => (
              <div key={alert.id} className={`alert-card ${alert.severity}`}>
                <div className="alert-header">
                  <div
                    className="alert-icon-container"
                    style={{ backgroundColor: alert.color + "20" }}
                  >
                    <AlertTriangle className="alert-icon" style={{ color: alert.color || "#ff4444" }} />

                  </div>
                  <div className="alert-content">
                    <h3 className="alert-title">{alert.title}</h3>
                    <p className="alert-description">{alert.description}</p>
                  </div>
                  <div className="alert-actions">
                    <span className="alert-timestamp">{alert.timestamp}</span>
                    <button className="alert-dismiss" onClick={() => handleDismissAlert(alert.id)}>
                      <XCircle className="dismiss-icon" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* AI Suggestions (Dynamic from Python) */}
        <section className="suggestions-section">
          <h2 className="section-title">AI Suggestions</h2>
          <div className="suggestions-list">
            {suggestions.map((suggestion) => (
              <div key={suggestion.id} className={`suggestion-card ${suggestion.applied ? "applied" : ""}`}>
                <div className="suggestion-header">
                  <div
                    className="suggestion-icon-container"
                    style={{ backgroundColor: suggestion.color + "20" }}
                  >
                    <MapPin className="suggestion-icon" style={{ color: suggestion.color }} />
                  </div>
                  <div className="suggestion-content">
                    <h3 className="suggestion-title">{suggestion.title}</h3>
                    <p className="suggestion-description">{suggestion.description}</p>
                  </div>
                  <div className="suggestion-actions">
                    {suggestion.applied ? (
                      <div className="applied-indicator">
                        <CheckCircle className="applied-icon" />
                        <span>Applied</span>
                      </div>
                    ) : (
                      <button
                        className="suggestion-apply"
                        onClick={() => handleApplySuggestion(suggestion.id)}
                        style={{ backgroundColor: suggestion.color }}
                      >
                        Apply
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Alert History */}
        <section className="history-section">
          <h2 className="section-title">Alert History</h2>
          <div className="history-list">
            <div className="history-item">
              <div className="history-icon">
                <AlertTriangle className="history-icon-svg" />
              </div>
              <div className="history-content">
                <h4 className="history-title">High Consumption Alert</h4>
                <p className="history-description">Energy usage exceeded normal levels</p>
                <span className="history-timestamp">3 days ago</span>
              </div>
              <div className="history-status resolved">
                <CheckCircle className="status-icon" />
                <span>Resolved</span>
              </div>
            </div>

            <div className="history-item">
              <div className="history-icon">
                <AlertCircle className="history-icon-svg" />
              </div>
              <div className="history-content">
                <h4 className="history-title">Device Offline</h4>
                <p className="history-description">Smart meter connection lost</p>
                <span className="history-timestamp">1 week ago</span>
              </div>
              <div className="history-status resolved">
                <CheckCircle className="status-icon" />
                <span>Resolved</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* AI Chatbot */}
      {showChatbot && (
        <div className="chatbot-overlay">
          <div className="chatbot-container">
            <div className="chatbot-header">
              <h3>AI Assistant</h3>
              <button className="chatbot-close" onClick={() => setShowChatbot(false)}>
                ×
              </button>
            </div>
            <div className="chatbot-messages">
              <div className="message ai-message">
                <p>
                  I can help you understand your alerts and provide recommendations to optimize
                  your energy usage. What would you like to know?
                </p>
              </div>
            </div>
            <div className="chatbot-input">
              <input
                type="text"
                placeholder="Ask about your alerts..."
                className="chatbot-input-field"
              />
              <button className="chatbot-send">Send</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertsPage;
