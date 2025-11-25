/*import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const handleChatbotQuery = async (req, res) => {
  try {
    const { query } = req.body;
    if (!query || query.trim() === "") {
      return res.status(400).json({ success: false, message: "Query is required" });
    }

    // ✅ Use correct, active Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
You are SmartEnergyBot — an AI assistant that helps users understand and reduce energy usage.
Be concise, friendly, and technically accurate.
User query: ${query}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({
      success: true,
      message: "Response generated successfully",
      reply: text,
    });
  } catch (error) {
    console.error("Gemini Chatbot Error:", error);
    res.status(500).json({
      success: false,
      message: "Error processing chatbot query",
      error: error.message,
    });
  }
};*/

const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
const EnergyReading = require("../models/EnergyReading");

dotenv.config();

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const handleChatbotQuery = async (req, res) => {
  try {
    const { query, deviceId } = req.body;

    // ✅ Debug request body
    console.log("Received request body:", req.body);
    console.log("Query:", query);
    console.log("DeviceId:", deviceId);

    // Validate input
    if (!query || query.trim() === "") {
      return res.status(400).json({ success: false, message: "Query is required" });
    }
    if (!deviceId) {
      return res.status(400).json({ success: false, message: "Device ID is required" });
    }

    // Fetch latest reading for the device
    const reading = await EnergyReading.findOne({ deviceId }).sort({ timestamp: -1 });

    let rawReply;
    if (reading) {
      rawReply = `
Device ID: ${reading.deviceId}
Current: ${reading.current} A
Voltage: ${reading.voltage} V
Power: ${reading.power} W
Temperature: ${reading.temperature} °C
Timestamp: ${reading.timestamp.toLocaleString()}
Estimated cost: ${(reading.power * 0.12).toFixed(2)} units
      `;
    } else {
      rawReply = "No live data available for this device.";
    }

    // Gemini prompt
    const prompt = `
You are SmartEnergyBot, an AI assistant.
Do NOT invent numbers. Only use the device data below.
User query: "${query}"

Device data:
${rawReply}

Answer in a friendly, concise chatbot style.
`;

    // ✅ FIXED model name
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    res.json({
      success: true,
      message: "Response generated successfully",
      reply: text || "No valid response from AI.",
    });

  } catch (error) {
    console.error("Chatbot Error:", error);
    res.status(500).json({
      success: false,
      message: "Error processing chatbot query",
      error: error.message,
    });
  }
};

module.exports = { handleChatbotQuery };







