import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import Chatbot from "./Chatbot";
import {
  Zap,
  BarChart3,
  Lightbulb,
  FileText,
  Settings,
  Bell,
  User,
  TrendingUp,
  TrendingDown,
  Activity,
  DollarSign,
  Leaf,
  Clock,
  MessageCircle,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./Dashboard.css";

const Dashboard = () => {
  const [energyData, setEnergyData] = useState(null);
  const [historicalData, setHistoricalData] = useState([]); // for charts

  // 🔹 Fetch live data from backend
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // const deviceId = "ESP32_01"; // or whatever is in your database
//         const energyRes = await api.get(`/api/energy/${firstDeviceId}`, {
//   headers: { Authorization: `Bearer ${token}` },
// });
//  // ensure backend route matches
//         setEnergyData(res.data);
//         // optional: if backend returns chart data
//         if (res.data.historicalData) {
//           setHistoricalData(res.data.historicalData);
//         }
//       } catch (err) {
//         console.error("Error fetching energy data:", err);
//       }
//     };
//     fetchData();
//   }, []);

//   useEffect(() => {

// const fetchData = async () => {
//   try {
//     const token = localStorage.getItem("token");
//     const userId = localStorage.getItem("userId"); // if stored after login

//     if (!token || !userId) {
//       console.warn("Missing token or user ID");
//       return;
//     }

//     const devicesRes = await api.get(`/api/devices/${userId}`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     const devices = devicesRes.data.devices;
//     if (!devices || devices.length === 0) {
//       console.warn("No devices found for this user");
//       return;
//     }

//     console.log("Devices:", devices);
//   } catch (err) {
//     console.error("Error fetching devices:", err);
//   }
// };


//   fetchData();
// }, []);

// useEffect(() => {
//   const fetchData = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const userId = localStorage.getItem("userId");

//       if (!token || !userId) {
//         console.warn("Missing token or user ID");
//         return;
//       }

//       // 1️⃣ Fetch devices for the logged-in user
//       const devicesRes = await api.get(`/api/devices/${userId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const devices = devicesRes.data.devices;
//       if (!devices || devices.length === 0) {
//         console.warn("No devices found for this user");
//         return;
//       }

//       console.log("Devices:", devices);

//       // 2️⃣ Take the first device’s ID
//       const firstDeviceId = devices[0].deviceId;

//       // 3️⃣ Fetch energy data for that device
//       const energyRes = await api.get(`/api/energy/${firstDeviceId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       console.log(firstDeviceId);

//       console.log("Energy Data:", energyRes.data);
//     //   if (res.data && res.data.readings.length > 0) {
//     //   setEnergyData({
//     //     current_power_usage: res.data.readings[res.data.readings.length - 1].power,
//     //     energy_consumed_today: res.data.total,
//     //     estimated_cost: (res.data.total * 0.012).toFixed(2), // cost estimate
//     //     carbon_emission: (res.data.total * 0.0007).toFixed(2), // optional
//     //   });

//     //   // Optional: if backend sends chart data
//     //   if (energyRes.data.historicalData) {
//     //     setHistoricalData(energyRes.data.historicalData);
//     //   }
//     // }
//     // }
//      if (energyRes.data && energyRes.data.readings.length > 0) {
//       setEnergyData({
//         current_power_usage: energyRes.data.readings[energyRes.data.readings.length - 1].power,
//         energy_consumed_today: energyRes.data.total,
//         estimated_cost: (energyRes.data.total * 0.012).toFixed(2), // cost estimate
//         carbon_emission: (energyRes.data.total * 0.0007).toFixed(2), // optional
//       });

//       // For charts
//  setHistoricalData(
//   (energyRes.data.readings || []).map((r) => ({
//     time: new Date(r.timestamp).toLocaleTimeString(),
//     power: r.power,
//   }))
// );

//     } else {
//       setEnergyData(null);
//     }
//   }
//     catch (err) {
//       console.error("Error fetching energy data:", err);
//     }
//   };

//   fetchData();
// }, []);
useEffect(() => {
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) return;

      const devicesRes = await api.get(`/api/devices/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // const firstDeviceId = devicesRes.data.devices[0]?.deviceId;
      // if (!firstDeviceId) return;

      const firstDeviceId = "METER001"; // 👈 Use this

      {/* const energyRes = await api.get(`/api/energy/${firstDeviceId}`, {
        headers: { Authorization: `Bearer ${token}` },
      }); */}
      // 1️⃣ Fetch all readings for historical chart
      const allReadingsRes = await api.get(`/api/energy/${firstDeviceId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // 2️⃣ Fetch today's energy
      const todayRes = await api.get(`/api/energy/today?deviceId=${firstDeviceId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });


      {/* if (energyRes.data?.readings?.length) {
        const last = energyRes.data.readings.at(-1);
        setEnergyData({
          current_power_usage: last.power,
          energy_consumed_today: energyRes.data.total,
          estimated_cost: (energyRes.data.total * 0.012).toFixed(2),
          carbon_emission: (energyRes.data.total * 0.0007).toFixed(2),
        });
        setHistoricalData(
          energyRes.data.readings.map((r) => ({
            time: new Date(r.timestamp).toLocaleTimeString(),
            power: r.power,
          }))
        );
      } */}
      if (allReadingsRes.data?.readings?.length) {
       const sortedReadings = [...allReadingsRes.data.readings].sort(
        (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
       );
       const last = sortedReadings.at(-1);

       setEnergyData({
        current_power_usage: last.power,                     // last reading
        energy_consumed_today: todayRes.data.totalEnergyToday, // ✅ today only
        estimated_cost: (todayRes.data.totalEnergyToday * 0.012).toFixed(2),
        carbon_emission: (todayRes.data.totalEnergyToday * 0.0007).toFixed(2),
       });

       setHistoricalData(
        sortedReadings.map((r) => ({
         time: new Date(r.timestamp).toLocaleTimeString(),
         power: r.power,
        }))
       );
      }

    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  // Run once immediately
  fetchData();

  // Then poll every 5 seconds
  // const interval = setInterval(fetchData, 5000);
  // return () => clearInterval(interval);
}, []);


  const [activeTab, setActiveTab] = useState("overview");
  const [showChatbot, setShowChatbot] = useState(false);
  // 🧠 Chatbot states
const [messages, setMessages] = useState([
  {
    from: "ai",
    text: "Hello! I’m your AI energy assistant. How can I help you optimize your energy usage today?",
  },
]);
const [input, setInput] = useState("");
const [loading, setLoading] = useState(false);
  const navigationItems = [
    { id: "overview", label: "Overview", icon: BarChart3, path: "/dashboard" },
    { id: "trend", label: "Trend Analysis", icon: TrendingUp, path: "/trend-analysis" },
    { id: "alerts", label: "Alerts", icon: Bell, path: "/alerts" },
    { id: "devices", label: "Devices", icon: Lightbulb, path: "/devices" },
    { id: "cost", label: "Cost & Efficiency", icon: DollarSign, path: "/cost-efficiency" },
    //{ id: "settings", label: "Settings", icon: Settings, path: "/settings" },
  ];

  const kpiCards = [
    {
      title: "Current Power Usage",
      value: energyData ? energyData.current_power_usage : "Loading...",
      icon: Activity,
      color: "#00d4ff",
      change: "+5%",
      changeType: "positive",
    },
    {
      title: "Energy Consumed Today",
      value: energyData ? energyData.energy_consumed_today : "Loading...",
      icon: Zap,
      color: "#00ff88",
      change: "+12%",
      changeType: "positive",
    },
    {
      title: "Estimated Costs",
      value: energyData ? energyData.estimated_cost : "Loading...",
      icon: DollarSign,
      color: "#ff6b6b",
      change: "-2%",
      changeType: "negative",
    },
  ];

  const highlights = [
    //{
    //  title: "Highest Consumption Time",
    //  value: "3 PM",
    //  change: "+10% vs. yesterday",
    //  changeType: "positive",
    //  icon: Clock,
    //},
    {
      title: "Carbon Emissions",
      value: energyData ? energyData.carbon_emission : "Loading...",
      change: "-16% vs. last week",
      changeType: "positive",
      icon: Leaf,
    },
  ];

  const aiSuggestions = [
    {
      icon: Lightbulb,
      title: "Optimize Device Usage",
      description: "Shift Dishwasher to off-peak hours to save 15%",
      action: "Apply",
      color: "#00d4ff",
    },
    {
      icon: Activity,
      title: "Thermostat Adjustment",
      description: "Adjust thermostat by 2°C to save 10% on heating",
      action: "Apply",
      color: "#00ff88",
    },
  ];

  const handleSuggestion = (suggestion) => {
    alert(`Applied suggestion: ${suggestion.title}`);
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
        <header className="dashboard-header">
          <div className="header-left">
            <h1 className="dashboard-title">Energy Dashboard</h1>
            <p className="dashboard-subtitle">
              Monitor your energy usage in real-time and optimize for efficiency
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

        {/* KPI Cards */}
        <section className="kpi-section">
          <div className="kpi-grid">
            {kpiCards.map((card, index) => (
              <div key={index} className="kpi-card">
                <div className="kpi-header">
                  <div
                    className="kpi-icon-container"
                    style={{ backgroundColor: card.color + "20" }}
                  >
                    <card.icon className="kpi-icon" style={{ color: card.color }} />
                  </div>
                  <div className={`kpi-change ${card.changeType}`}>
                    {card.changeType === "positive" ? (
                      <TrendingUp className="change-icon" />
                    ) : (
                      <TrendingDown className="change-icon" />
                    )}
                    {card.change}
                  </div>
                </div>
                <div className="kpi-content">
                  <h3 className="kpi-title">{card.title}</h3>
                  <p className="kpi-value">{card.value}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Real-time chart */}
        <section className="charts-section">
          <div className="chart-card">
            <div className="chart-header">
              <h3 className="chart-title">Real-time Consumption</h3>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="time" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1a1a1a",
                      border: "1px solid #333",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="power"
                    stroke="#00d4ff"
                    strokeWidth={3}
                    dot={{ fill: "#00d4ff", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* Highlights */}
        <section className="highlights-section">
          <div className="highlights-grid">
            {highlights.map((h, i) => (
              <div key={i} className="highlight-card">
                <div className="highlight-header">
                  <h.icon className="highlight-icon" />
                  <h3 className="highlight-title">{h.title}</h3>
                </div>
                <div className="highlight-content">
                  <p className="highlight-value">{h.value}</p>
                  <div className={`highlight-change ${h.changeType}`}>
                    {h.change}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* AI Suggestions 
        <section className="suggestions-section">
          <h2 className="section-title">AI-Powered Suggestions</h2>
          <div className="suggestions-grid">
            {aiSuggestions.map((s, i) => (
              <div key={i} className="suggestion-card">
                <div className="suggestion-header">
                  <div
                    className="suggestion-icon-container"
                    style={{ backgroundColor: s.color + "20" }}
                  >
                    <s.icon className="suggestion-icon" style={{ color: s.color }} />
                  </div>
                  <h3 className="suggestion-title">{s.title}</h3>
                </div>
                <p className="suggestion-description">{s.description}</p>
                <button
                  className="suggestion-button"
                  onClick={() => handleSuggestion(s)}
                  style={{ backgroundColor: s.color }}
                >
                  {s.action}
                </button>
              </div>
            ))}
          </div>
        </section> */}
      </main>

      {/* Chatbot */}
      {showChatbot && <Chatbot onClose={() => setShowChatbot(false)} />}
    </div> 
  );
};

export default Dashboard;




