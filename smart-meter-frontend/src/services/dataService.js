// Sample data for the dashboard
export const sampleData = {
  current_power_usage: "288.1 W",
  energy_consumed_today: "1.85 kWh",
  estimated_cost: "₹11.10",
  carbon_emission: "1.52 kg CO₂",
  predicted_peak_time: "19:00 - 21:00",
  per_device_consumption: {
    bulb: "0.90 kWh",
    fan: "0.60 kWh",
    others: "0.35 kWh"
  },
  alerts: [
    "High consumption detected at 11:00",
    "Unusual spike compared to yesterday"
  ],
  ai_suggestions: [
    "Consider turning off idle devices during afternoon",
    "Switch to energy-efficient bulbs to reduce cost"
  ],
  historical_analysis: {
    yesterday: "2.1 kWh",
    last_week_avg: "1.7 kWh/day"
  }
};

// Historical data for charts
export const historicalData = [
  { time: "00:00", power: 91.8, energy_today: 0.18, carbon_emission: 0.15, cost: 1.1 },
  { time: "02:00", power: 80.5, energy_today: 0.34, carbon_emission: 0.28, cost: 2.0 },
  { time: "04:00", power: 69.3, energy_today: 0.48, carbon_emission: 0.39, cost: 2.9 },
  { time: "06:00", power: 115.4, energy_today: 0.71, carbon_emission: 0.58, cost: 4.2 },
  { time: "08:00", power: 275.8, energy_today: 1.26, carbon_emission: 1.03, cost: 7.6 },
  { time: "10:00", power: 322.6, energy_today: 1.91, carbon_emission: 1.56, cost: 11.5 },
  { time: "12:00", power: 289.0, energy_today: 2.48, carbon_emission: 2.03, cost: 14.9 },
  { time: "14:00", power: 252.9, energy_today: 2.99, carbon_emission: 2.45, cost: 17.9 },
  { time: "16:00", power: 218.8, energy_today: 3.43, carbon_emission: 2.81, cost: 20.6 },
  { time: "18:00", power: 310.1, energy_today: 4.06, carbon_emission: 3.33, cost: 24.3 },
  { time: "20:00", power: 345.9, energy_today: 4.74, carbon_emission: 3.89, cost: 28.4 },
  { time: "22:00", power: 184.2, energy_today: 5.11, carbon_emission: 4.19, cost: 30.7 }
];

// Device consumption data
export const deviceData = [
  { device: "Refrigerator", usage: "1.2 kWh", percentage: 75, color: "#3b82f6" },
  { device: "Air Conditioner", usage: "0.8 kWh", percentage: 50, color: "#06b6d4" },
  { device: "Lighting", usage: "0.5 kWh", percentage: 25, color: "#10b981" },
  { device: "Television", usage: "0.3 kWh", percentage: 19, color: "#f59e0b" },
  { device: "Dishwasher", usage: "0.2 kWh", percentage: 10, color: "#ef4444" }
];

// Cost analysis data
export const costData = {
  today: "$12.50",
  thisWeek: "$75.00",
  thisMonth: "$300.00",
  nextMonth: "$320.00"
};

// Efficiency metrics
export const efficiencyData = {
  actualVsPredicted: 95,
  efficiencyText: "5% more efficient",
  isPositive: true
};

// AI suggestions data
export const aiSuggestionsData = [
  {
    icon: "🌡️",
    title: "Thermostat Optimization",
    description: "Adjust your thermostat by 2 degrees during peak hours.",
    savings: "15%"
  },
  {
    icon: "🔌",
    title: "Reduce Phantom Load",
    description: "Unplug electronics when not in use to eliminate standby power.",
    savings: "10%"
  },
  {
    icon: "🧺",
    title: "Optimize Appliance Usage",
    description: "Run your dishwasher and washing machine only when fully loaded.",
    savings: "8%"
  }
];

// Alerts data
export const alertsData = [
  {
    type: "error",
    icon: "⚠️",
    title: "Device Malfunction",
    description: "Device HVAC Unit is not functioning properly. Please check the device.",
    time: "2 hours ago"
  },
  {
    type: "warning",
    icon: "⚡",
    title: "Overconsumption Warning",
    description: "Your energy consumption has exceeded the set limit. Consider reducing usage.",
    time: "Yesterday"
  }
];

// AI suggestions for alerts page
export const aiSuggestionsAlerts = [
  {
    icon: "📍",
    title: "Optimize Device Usage",
    description: "Shift device Dishwasher to off-peak hours to save 15%.",
    action: "Apply"
  },
  {
    icon: "🌡️",
    title: "Thermostat Adjustment",
    description: "Adjust your thermostat by 2°C to save 10% on heating costs.",
    action: "Apply"
  }
];

// Trend analysis data
export const trendData = {
  dailyConsumption: {
    value: "120 kWh",
    change: "-2%",
    isPositive: false,
    period: "vs last week"
  },
  weeklyTrend: {
    value: "480 kWh",
    change: "+12%",
    isPositive: true,
    period: "vs last month"
  },
  aiPrediction: {
    value: "1500 kWh",
    change: "-1%",
    isPositive: false,
    period: "vs prediction"
  }
};

// Key highlights data
export const keyHighlights = [
  {
    title: "Peak Load Hours",
    value: "17:00 - 20:00",
    icon: "🕐"
  },
  {
    title: "High Consumption",
    value: "HVAC system on Wednesday",
    icon: "⚡"
  },
  {
    title: "Anomaly Detected",
    value: "Unexpected spike on 2024-03-16",
    icon: "⚠️"
  },
  {
    title: "Efficiency Tip",
    value: "Shift laundry to off-peak hours",
    icon: "🌱"
  }
];
