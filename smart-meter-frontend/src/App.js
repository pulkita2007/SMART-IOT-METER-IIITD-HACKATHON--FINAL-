import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomePage from './components/WelcomePage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import Dashboard from './components/Dashboard';
import TrendAnalysis from './components/TrendAnalysis';
import AlertsPage from './components/AlertsPage';
import DeviceConsumption from './components/DeviceConsumption';
import CostEfficiency from './components/CostEfficiency';
import Chatbot from './components/Chatbot';
//import SettingsPage from './components/SettingsPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/trend-analysis" element={<TrendAnalysis />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/devices" element={<DeviceConsumption />} />
          <Route path="/cost-efficiency" element={<CostEfficiency />} />
          <Route path="/chatbot" element={<Chatbot />} />
          {/*<Route path="/settings" element={<SettingsPage />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;


