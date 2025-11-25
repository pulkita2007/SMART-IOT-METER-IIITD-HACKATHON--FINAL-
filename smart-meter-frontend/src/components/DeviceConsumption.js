import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import {
  Zap,
  Lightbulb,
  BarChart3,
  Settings,
  Bell,
  User,
  TrendingUp,
  MessageCircle,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import "./Dashboard.css";

const DeviceConsumption = () => {
  const [activeTab, setActiveTab] = useState("devices");
  const [devices, setDevices] = useState([]);
  const [summary, setSummary] = useState({});
  const [showChatbot, setShowChatbot] = useState(false);

  const COLORS = ["#00C49F", "#FFBB28", "#FF8042", "#0088FE", "#FF6666"];

  const navigationItems = [
    { id: "overview", label: "Overview", icon: BarChart3, path: "/dashboard" },
    { id: "trend", label: "Trend Analysis", icon: TrendingUp, path: "/trend-analysis" },
    { id: "devices", label: "Devices", icon: Lightbulb, path: "/devices" },
    { id: "cost", label: "Cost & Efficiency", icon: TrendingUp, path: "/cost-efficiency" },
    //{ id: "settings", label: "Settings", icon: Settings, path: "/settings" },
  ];

  useEffect(() => {
    const fetchDeviceData = async () => {
      try {
        // 🔹 1. Get device-wise consumption
        const res = await api.get("/api/energy/devices");
        setDevices(res.data?.devices || []);

        // 🔹 2. Get overall consumption summary (optional)
        const summaryRes = await api.get("/api/energy/summary");
        setSummary(summaryRes.data || {});
      } catch (error) {
        console.error("Error fetching device data:", error);
      }
    };

    fetchDeviceData();
  }, []);

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

        <div className="sidebar-footer">
          <button
            className="chatbot-button"
            onClick={() => setShowChatbot(!showChatbot)}
          >
            <MessageCircle className="chatbot-icon" />
            Ask our AI Assistant
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Header */}
        <header className="dashboard-header">
          <div className="header-left">
            <h1 className="dashboard-title">Device Consumption Overview</h1>
            <p className="dashboard-subtitle">
              Monitor energy usage across all connected devices.
            </p>
          </div>
          <div className="header-right">
            <button className="notification-button">
              <Bell className="notification-icon" />
            </button>
            <div className="user-profile">
              <User className="user-icon" />
            </div>
          </div>
        </header>

        {/* Summary Section */}
        <section className="summary-section">
          <div className="summary-cards">
            <div className="summary-card">
              <h3>Total Devices</h3>
              <p>{summary.totalDevices ?? devices.length}</p>
            </div>
            <div className="summary-card">
              <h3>Total Consumption</h3>
              <p>{summary.totalConsumption ? `${summary.totalConsumption} kWh` : "--"}</p>
            </div>
            <div className="summary-card">
              <h3>Average Load</h3>
              <p>{summary.avgLoad ? `${summary.avgLoad} kW` : "--"}</p>
            </div>
          </div>
        </section>

        {/* Charts Section */}
        <section className="charts-section">
          <div className="chart-container">
            <h2 className="section-title">Device-wise Consumption (kWh)</h2>
            {devices.length === 0 ? (
              <p className="no-data">No device consumption data available.</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={devices}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="deviceName" stroke="#ccc" />
                  <YAxis stroke="#ccc" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1a1a1a",
                      border: "1px solid #333",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  />
                  <Bar dataKey="consumption" fill="#00d4ff" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="chart-container">
            <h2 className="section-title">Consumption Share</h2>
            {devices.length === 0 ? (
              <p className="no-data">No data available for chart.</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={devices}
                    dataKey="consumption"
                    nameKey="deviceName"
                    outerRadius={120}
                    label
                  >
                    {devices.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1a1a1a",
                      border: "1px solid #333",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </section>
      </main>

      {/* Chatbot */}
      {showChatbot && (
        <div className="chatbot-overlay">
          <div className="chatbot-container">
            <div className="chatbot-header">
              <h3>AI Assistant</h3>
              <button
                className="chatbot-close"
                onClick={() => setShowChatbot(false)}
              >
                ×
              </button>
            </div>
            <div className="chatbot-messages">
              <div className="message ai-message">
                <p>
                  I can help you analyze device consumption and identify which
                  ones use the most power.
                </p>
              </div>
            </div>
            <div className="chatbot-input">
              <input
                type="text"
                placeholder="Ask about your device usage..."
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

export default DeviceConsumption;
