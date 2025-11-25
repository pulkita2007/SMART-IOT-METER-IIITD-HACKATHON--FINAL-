// import React, { useEffect, useState } from "react";
// import api from "../services/api";
// import { Link } from "react-router-dom";
// import {
//   Zap,
//   BarChart3,
//   Lightbulb,
//   Settings,
//   Bell,
//   User,
//   TrendingUp,
//   DollarSign,
//   Star,
//   Thermometer,
//   Power,
//   Home,
//   MessageCircle,
// } from "lucide-react";
// import "./Dashboard.css";

// const CostEfficiency = () => {
//   const [activeTab, setActiveTab] = useState("cost");
//   const [showChatbot, setShowChatbot] = useState(false);

//   const navigationItems = [
//     { id: "overview", label: "Overview", icon: BarChart3, path: "/dashboard" },
//     { id: "trend", label: "Trend Analysis", icon: TrendingUp, path: "/trend-analysis" },
//     { id: "alerts", label: "Alerts", icon: Bell, path: "/alerts" },
//     { id: "devices", label: "Devices", icon: Lightbulb, path: "/devices" },
//     { id: "cost", label: "Cost & Efficiency", icon: DollarSign, path: "/cost-efficiency" },
//     //{ id: "settings", label: "Settings", icon: Settings, path: "/settings" },
//   ];

//   // 🔹 States
//   const [costData, setCostData] = useState([]);
//   const [efficiencyData, setEfficiencyData] = useState([]);

//   // 🔹 Fetch cost & efficiency data
//   useEffect(() => {
//     const fetchCostEfficiency = async () => {
//       try {
//         const res = await api.get("/api/cost-efficiency"); // ✅ corrected endpoint
//         setCostData(res.data.costData || []); // expects [{period, amount}]
//         setEfficiencyData(res.data.efficiencyData || []);
//       } catch (err) {
//         console.error("Error fetching cost & efficiency data:", err);
//       }
//     };
//     fetchCostEfficiency();
//   }, []);

//   // 🔹 AI suggestions
//   const aiSuggestions = [
//     {
//       icon: Thermometer,
//       title: "Thermostat Optimization",
//       description: "Adjust your thermostat by 2°C during peak hours.",
//       color: "#00d4ff",
//     },
//     {
//       icon: Power,
//       title: "Reduce Phantom Load",
//       description: "Unplug devices when not in use to eliminate standby power.",
//       color: "#00ff88",
//     },
//     {
//       icon: Home,
//       title: "Optimize Appliance Usage",
//       description: "Run washing machine & dishwasher only when fully loaded.",
//       color: "#ff6b6b",
//     },
//   ];

//   return (
//     <div className="dashboard">
//       {/* Sidebar */}
//       <aside className="sidebar">
//         <div className="sidebar-header">
//           <div className="logo">
//             <Zap className="logo-icon" />
//             <span className="logo-text">EchoTrack</span>
//           </div>
//         </div>

//         <nav className="sidebar-nav">
//           {navigationItems.map((item) => (
//             <Link
//               key={item.id}
//               to={item.path}
//               className={`nav-item ${activeTab === item.id ? "active" : ""}`}
//               onClick={() => setActiveTab(item.id)}
//             >
//               <item.icon className="nav-icon" />
//               <span className="nav-label">{item.label}</span>
//             </Link>
//           ))}
//         </nav>

//         <div className="sidebar-footer">
//           <button
//             className="chatbot-button"
//             onClick={() => setShowChatbot(!showChatbot)}
//           >
//             <MessageCircle className="chatbot-icon" />
//             Ask our AI Assistant
//           </button>
//         </div>
//       </aside>

//       {/* Main Content */}
//       <main className="main-content">
//         {/* Header */}
//         <header className="dashboard-header">
//           <div className="header-left">
//             <h1 className="dashboard-title">Cost & Efficiency</h1>
//             <p className="dashboard-subtitle">
//               Track your energy costs and optimize for maximum efficiency
//             </p>
//           </div>
//           <div className="header-right">
//             <button className="notification-button">
//               <Bell className="notification-icon" />
//             </button>
//             <div className="user-profile">
//               <User className="user-icon" />
//             </div>
//           </div>
//         </header>

//         {/* Cost Analysis */}
//         <section className="cost-section">
//           <h2 className="section-title">Cost Analysis</h2>
//           <div className="cost-grid">
//             {costData.length > 0 ? (
//               costData.map((cost, index) => (
//                 <div key={index} className="cost-card">
//                   <div className="cost-header">
//                     <h3 className="cost-title">{cost.period}</h3>
//                   </div>
//                   <div className="cost-value">
//                     <span className="currency">₹</span>
//                     <span className="amount">
//                       {parseFloat(cost.amount).toFixed(2)}
//                     </span>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <p className="loading-text">Loading cost data...</p>
//             )}
//           </div>
//         </section>

//         {/* Efficiency Metrics */}
//         <section className="efficiency-section">
//           <h2 className="section-title">Efficiency Metrics</h2>
//           <div className="efficiency-grid">
//             <div className="efficiency-card">
//               <h3 className="efficiency-title">Actual vs. Predicted Usage</h3>
//               <div className="efficiency-content">
//                 <div className="efficiency-value">
//                   <span className="value">95%</span>
//                   <span className="change positive">(5% more efficient)</span>
//                 </div>
//                 <div className="efficiency-bar">
//                   <div className="bar-fill" style={{ width: "95%" }}></div>
//                 </div>
//               </div>
//             </div>

//             <div className="efficiency-card">
//               <h3 className="efficiency-title">Energy Saving Insights</h3>
//               <div className="efficiency-content">
//                 <div className="suggestions-header">
//                   <Star className="star-icon" />
//                   <span className="suggestions-title">AI-Powered Tips</span>
//                 </div>
//                 <p className="suggestions-description">
//                   Your energy usage is 5% more efficient than predicted. Keep it up!
//                   For further savings, try the following tips:
//                 </p>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/*  AI Suggestions 
//         <section className="ai-suggestions-section">
//           <h2 className="section-title">AI-Generated Suggestions</h2>
//           <div className="suggestions-grid">
//             {aiSuggestions.map((suggestion, index) => (
//               <div key={index} className="suggestion-card">
//                 <div className="suggestion-header">
//                   <div
//                     className="suggestion-icon-container"
//                     style={{ backgroundColor: suggestion.color + "20" }}
//                   >
//                     <suggestion.icon
//                       className="suggestion-icon"
//                       style={{ color: suggestion.color }}
//                     />
//                   </div>
//                   <h3 className="suggestion-title">{suggestion.title}</h3>
//                 </div>
//                 <p className="suggestion-description">{suggestion.description}</p>
//               </div>
//             ))}
//           </div>
//         </section> */}
//       </main>

//       {/* AI Chatbot */}
//       {showChatbot && (
//         <div className="chatbot-overlay">
//           <div className="chatbot-container">
//             <div className="chatbot-header">
//               <h3>AI Assistant</h3>
//               <button
//                 className="chatbot-close"
//                 onClick={() => setShowChatbot(false)}
//               >
//                 ×
//               </button>
//             </div>
//             <div className="chatbot-messages">
//               <div className="message ai-message">
//                 <p>
//                   I can help you optimize your energy costs and provide efficiency
//                   recommendations. What would you like to know?
//                 </p>
//               </div>
//             </div>
//             <div className="chatbot-input">
//               <input
//                 type="text"
//                 placeholder="Ask about cost optimization..."
//                 className="chatbot-input-field"
//               />
//               <button className="chatbot-send">Send</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CostEfficiency;
import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import {
  Zap,
  BarChart3,
  Lightbulb,
  Bell,
  TrendingUp,
  DollarSign,
  MessageCircle,
} from "lucide-react";
import "./Dashboard.css";

const CostEfficiency = () => {
  const [activeTab, setActiveTab] = useState("cost");
  const [showChatbot, setShowChatbot] = useState(false);

  const [costData, setCostData] = useState([]);
  const [efficiencyData, setEfficiencyData] = useState({});
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [predictedUsage, setPredictedUsage] = useState(null);

  useEffect(() => {
    const fetchCostEfficiency = async () => {
      try {
        const res = await api.get("/api/cost-efficiency");

        setCostData(res.data.costData || []);
        setEfficiencyData(res.data.efficiencyData || {});
        setAiSuggestions(res.data.aiRecommendations || []);
        // setPredictedUsage(res.data.predictedUsage || null);
        setPredictedUsage(res.data.efficiencyData?.predictedUsage || null)

      } catch (err) {
        console.error("Error fetching cost & efficiency data:", err);
      }
    };
    fetchCostEfficiency();
  }, []);

  // ✅ FIX: safely read efficiency value (works for object OR array)
  const efficiencyPercent =
    Array.isArray(efficiencyData)
      ? (efficiencyData.find((e) => e.metric === "usage")?.value || 95)
      : efficiencyData.usage || 95;

  const navigationItems = [
    { id: "overview", label: "Overview", icon: BarChart3, path: "/dashboard" },
    { id: "trend", label: "Trend Analysis", icon: TrendingUp, path: "/trend-analysis" },
    { id: "alerts", label: "Alerts", icon: Bell, path: "/alerts" },
    { id: "devices", label: "Devices", icon: Lightbulb, path: "/devices" },
    { id: "cost", label: "Cost & Efficiency", icon: DollarSign, path: "/cost-efficiency" },
  ];

  return (
    <div className="dashboard">

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">
          <Zap className="logo-icon" />
          <span className="logo-text">EchoTrack</span>
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
              {item.label}
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

      {/* Main */}
      <main className="main-content">

        <header className="dashboard-header">
          <h1 className="dashboard-title">Cost & Efficiency</h1>
          <p className="dashboard-subtitle">
            Track your energy costs and optimize for maximum efficiency
          </p>
        </header>

        {/* Cost Analysis */}
        <section className="cost-section">
          <h2 className="section-title">Cost Analysis</h2>

          <div className="cost-grid">
            {costData.length > 0 ? (
              costData.map((cost, idx) => (
                <div key={idx} className="cost-card">
                  <h3>{cost.period}</h3>
                  <p>₹{parseFloat(cost.amount).toFixed(2)}</p>
                </div>
              ))
            ) : (
              <p className="loading-text">Loading cost data...</p>
            )}
          </div>
        </section>

        {/* Efficiency Metrics */}
        <section className="efficiency-section">
          <h2 className="section-title">Efficiency Metrics</h2>

          <div className="efficiency-card">
            <h3>Actual vs Predicted Usage</h3>
            <p><strong>Predicted Usage:</strong> {predictedUsage ? `${predictedUsage} kWh` : "Loading..."}</p>
            <p><strong>Actual Efficiency:</strong> {efficiencyPercent}%</p>

            <div className="efficiency-bar">
              <div className="bar-fill" style={{ width: `${efficiencyPercent}%` }}></div>
            </div>
          </div>
        </section>

        {/* AI Recommendations */}
        <section className="ai-suggestions-section">
          <h2 className="section-title">AI Recommendations</h2>

          <div className="suggestions-grid">
            {aiSuggestions.length > 0 ? (
              aiSuggestions.map((tip, index) => (
                <div key={index} className="suggestion-card">
                  <h3>{tip.title}</h3>
                  <p>{tip.description}</p>
                </div>
              ))
            ) : (
              <p className="loading-text">Fetching AI recommendations...</p>
            )}
          </div>
        </section>

      </main>
    </div>
  );
};

export default CostEfficiency;
