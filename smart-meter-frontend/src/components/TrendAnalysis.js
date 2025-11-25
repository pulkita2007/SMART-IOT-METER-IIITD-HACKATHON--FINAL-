import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import {
  Zap,
  BarChart3,
  Lightbulb,
  Bell,
  TrendingUp,
  MessageCircle,
  DollarSign,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from "recharts";
import "./Dashboard.css";

const TrendAnalysis = () => {
  const [activeTab, setActiveTab] = useState("trend");
  const [showChatbot, setShowChatbot] = useState(false);
  const [consumptionTrends, setConsumptionTrends] = useState([]);
  const [aiPrediction, setAiPrediction] = useState({});
  const [insights, setInsights] = useState([]);
  const [historicalData, setHistoricalData] = useState([]);

  const navigationItems = [
    { id: "overview", label: "Overview", icon: BarChart3, path: "/dashboard" },
    { id: "trend", label: "Trend Analysis", icon: TrendingUp, path: "/trend-analysis" },
    { id: "alerts", label: "Alerts", icon: Bell, path: "/alerts" },
    { id: "devices", label: "Devices", icon: Lightbulb, path: "/devices" },
    { id: "cost", label: "Cost & Efficiency", icon: DollarSign, path: "/cost-efficiency" },
  ];

  const firstDeviceId = "METER001";

  const fetchTrendData = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      // Fetch user's devices
      const devicesRes = await api.get(`/api/devices/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const devices = devicesRes.data.devices;
      if (!devices || devices.length === 0) return;

      // Fetch consumption trends
      const trendRes = await api.get(`/api/energy/trends?deviceId=${firstDeviceId}&period=24h`);
      setConsumptionTrends(trendRes.data?.trends || []);

      // Fetch AI predictions
      const aiRes = await api.get(`/api/ai/predictions/${firstDeviceId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAiPrediction(aiRes.data || {});

      // Fetch historical data (FIXED INVALID DATE)
      const histRes = await api.get(`/api/energy/history?deviceId=${firstDeviceId}`);
      const formattedHistory = (histRes.data?.history || []).map((item) => ({
        time: new Date(item.time).toLocaleTimeString([], {
              day: "2-digit",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
        }),
        power: item.power || 0,
      }));

      setHistoricalData(formattedHistory);

      // Fetch insights
      const insightRes = await api.get(`/api/energy/insights?deviceId=${firstDeviceId}`);
      setInsights(insightRes.data?.insights || []);
    } catch (err) {
      console.error("Error fetching trend analysis data:", err);
    }
  };

  useEffect(() => {
    fetchTrendData();
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
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="dashboard-header">
          <div className="header-left">
            <h1 className="dashboard-title">Trend and Historical Analysis</h1>
            <p className="dashboard-subtitle">
              Analyze your energy consumption patterns and AI predictions
            </p>
          </div>
        </header>

        {/* Consumption Trends */}
        <section className="trends-section">
          <div className="trends-header">
            <h2 className="section-title">Consumption Trends</h2>

            <button
              onClick={fetchTrendData}
              className="refresh-btn"
              style={{
                background: "#00d4ff",
                borderRadius: "8px",
                padding: "8px 14px",
                border: "none",
                cursor: "pointer",
              }}
            >
              Refresh Data
            </button>
          </div>

          {consumptionTrends.length === 0 ? (
            <p className="no-data">No trend data available.</p>
          ) : (
            <div className="trends-grid">
              {consumptionTrends.map((trend, index) => (
                <div key={index} className="trend-card">
                  <div className="trend-header">
                    <h3>{trend.title || "Trend"}</h3>
                    <span>{trend.value ?? "--"}</span>
                  </div>

                  {trend.data && (
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={trend.data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis dataKey="label" stroke="#666" />
                        <YAxis stroke="#666" />
                        <Tooltip />
                        <Bar dataKey="avgPower" fill="#00d4ff" />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Historical Analysis */}
        <section className="historical-section">
          <h2 className="section-title">Historical Analysis</h2>
          {historicalData.length === 0 ? (
            <p className="no-data">No historical data.</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="time" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip />
                <Line type="monotone" dataKey="power" stroke="#00d4ff" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </section>
      </main>
    </div>
  );
};

export default TrendAnalysis;
