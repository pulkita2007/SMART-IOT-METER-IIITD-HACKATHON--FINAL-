/*import api from "./api";

export const sendChatQuery = async (query) => {
  try {
    // must match backend route
    const response = await api.post("/api/chatbot/ask", { query });
    return response.data;
  } catch (error) {
    console.error("Chatbot API Error:", error.response?.data || error.message);
    throw error;
  }
};*/


// services/chatbotService.js
export const sendChatQuery = async (query, deviceId) => {
  try {
    const response = await fetch("http://localhost:5000/api/chatbot/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // MUST have this
      },
      body: JSON.stringify({ query, deviceId }), // must match backend
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || "Server error");
    }

    return await response.json();
  } catch (err) {
    console.error("sendChatQuery error:", err);
    return { success: false, reply: "❌ Server not responding. Please check backend connection." };
  }
};







