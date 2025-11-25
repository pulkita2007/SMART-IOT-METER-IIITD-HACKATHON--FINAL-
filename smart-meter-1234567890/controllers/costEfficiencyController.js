{/*
const axios = require("axios");
const Energy = require("../models/EnergyReading");

const getCostEfficiency = async (req, res) => {
  try {
    // Get latest 10 readings
    const readings = await Energy.find().sort({ timestamp: -1 }).limit(10);

    if (!readings || readings.length === 0) {
      return res.json({
        success: true,
        costData: [],
        efficiencyData: { actualEfficiency: 0, predictedUsage: 0 },
        aiRecommendations: []
      });
    }

//     const totalUnits = readings.reduce(
//   (acc, r) => acc + (r.energy || r.energyConsumed || r.power || r.value || 0),
//   0
// );

// const costData = [
//   {
//     period: new Date().toISOString().split("T")[0],
//     amount: (totalUnits * 7.5).toFixed(2)
//   }
// ];

// assume each reading is taken every minute
const totalPower = readings.reduce(
  (acc, r) => acc + (r.power || 0),
  0
);

// Convert from W-minutes to kWh
// 1 kWh = 1000 watts * 60 minutes
const totalEnergyKWh = (totalPower / 1000) * (1 / 60) * readings.length;

const costData = [
  {
    period: new Date().toISOString().split("T")[0],
    amount: (totalEnergyKWh * 7.5).toFixed(2)
  }
];



    // --------------------------
    // ✅ EFFICIENCY CALCULATION
    // --------------------------
    const totalActual = readings.reduce(
      (acc, r) =>
        acc +
        (r.energy || r.energyConsumed || r.power || r.value || 0),
      0
    );

    // --------------------------
    // ✅ PREDICTED USAGE (Python AI)
    // --------------------------
    let predictedUsage = null;
    try {
      const aiRes = await axios.get("http://localhost:5000/api/predict");
      predictedUsage = aiRes.data.predicted_usage;
    } catch (err) {
      console.log("AI predictor down → using fallback.");
      //predictedUsage = totalActual * 1.05; // fallback
      // Convert predicted power to kWh (same formula as cost)
      const avgPower = totalActual / readings.length;

      // 1-minute interval → convert W → kWh
      predictedUsage = (avgPower / 1000) * (1 / 60) * readings.length * 1.05;
    }

    const actualEfficiency =
      predictedUsage > 0
        ? ((predictedUsage - totalActual) / predictedUsage) * 100
        : 0;

    // --------------------------
    // ✅ AI RECOMMENDATIONS
    // --------------------------
    let aiRecommendations = [];
    try {
      const recRes = await axios.get("http://localhost:5000/api/recommendations");
      aiRecommendations = recRes.data.recommendations;
    } catch (err) {
      aiRecommendations = [
        { title: "Unplug idle devices", description: "Save up to 10% energy." },
        { title: "Use LED bulbs", description: "LEDs consume 80% less power." }
      ];
    }

    // --------------------------
    // ✅ SEND DATA TO FRONTEND
    // --------------------------
    res.json({
      success: true,
      costData,
      efficiencyData: {
        actualEfficiency: actualEfficiency.toFixed(2),
        predictedUsage: predictedUsage.toFixed(2)
      },
      aiRecommendations
    });

  } catch (error) {
    console.error("Cost efficiency error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch cost & efficiency data"
    });
  }
};

module.exports = { getCostEfficiency };
*/}

const axios = require("axios");
const Energy = require("../models/EnergyReading");

const getCostEfficiency = async (req, res) => {
  try {
    // Get latest 10 readings
    const readings = await Energy.find().sort({ timestamp: -1 }).limit(10);

    if (!readings || readings.length === 0) {
      return res.json({
        success: true,
        costData: [],
        efficiencyData: { actualEfficiency: 0, predictedUsage: 0 },
        aiRecommendations: []
      });
    }

    // ----------------------------
    // ✅ CALCULATE TOTAL ENERGY (kWh)
    // ----------------------------
    // power readings = Watts
    // interval = 1 minute
    const totalPowerWatts = readings.reduce(
      (acc, r) => acc + (r.power || 0),
      0
    );

    // Convert W-minutes → kWh
    const totalEnergyKWh = (totalPowerWatts / 1000) * (1 / 60);
    console.log("totalEnergyKWh=", totalEnergyKWh);

    // ----------------------------
    // ✅ COST CALCULATION
    // ----------------------------
    const costData = [
      {
        period: new Date().toISOString().split("T")[0],
        amount: (totalEnergyKWh * 10).toFixed(2) // ₹10 per kWh
      }
    ];

    // ----------------------------
    // ✅ PREDICTED USAGE (Python AI + fallback)
    // ----------------------------
    let predictedUsage;

    try {
      const aiRes = await axios.get("http://localhost:5000/api/predict");
      predictedUsage = aiRes.data.predicted_usage;  // must be in kWh
    } catch (err) {
      console.log("AI predictor down → using fallback prediction.");

      // Fallback: add 5% margin to actual consumption
      predictedUsage = totalEnergyKWh * 1.05;
    }

    // ----------------------------
    // ✅ EFFICIENCY CALCULATION
    // ----------------------------
    const actualEfficiency =
      predictedUsage > 0
        ? (((predictedUsage - totalEnergyKWh) / predictedUsage) * 100)
        : 0;

    // ----------------------------
    // ✅ AI RECOMMENDATIONS
    // ----------------------------
    let aiRecommendations = [];

    try {
      const recRes = await axios.get("http://localhost:5000/api/recommendations");
      aiRecommendations = recRes.data.recommendations;
    } catch (err) {
      aiRecommendations = [
        { title: "Unplug idle devices", description: "Save up to 10% energy." },
        { title: "Use LED bulbs", description: "LEDs consume 80% less power." }
      ];
    }

    // ----------------------------
    // ✅ SEND RESPONSE TO FRONTEND
    // ----------------------------
    res.json({
      success: true,
      costData,
      efficiencyData: {
        actualEfficiency: actualEfficiency.toFixed(2),
        predictedUsage: predictedUsage.toFixed(2)
      },
      aiRecommendations
    });

  } catch (error) {
    console.error("Cost efficiency error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch cost & efficiency data"
    });
  }
};

module.exports = {getCostEfficiency} ;
