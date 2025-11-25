/*import React, { useState, useRef, useEffect } from "react";
import { Send, X } from "lucide-react";
import { sendChatQuery } from "../services/chatbotService";
import "./Chatbot.css";

const Chatbot = ({ onClose }) => {
  const [messages, setMessages] = useState([
    {
      from: "ai",
      text: "👋 Hi! I'm your AI Energy Assistant. How can I help you optimize your energy usage today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { from: "user", text: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await sendChatQuery(userMessage.text);
      if (res.success && res.reply) {
        setMessages((prev) => [...prev, { from: "ai", text: res.reply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { from: "ai", text: "⚠️ Sorry, I couldn’t understand that. Try again?" },
        ]);
      }
    } catch (error) {
      console.error("Chatbot error:", error);
      setMessages((prev) => [
        ...prev,
        { from: "ai", text: "❌ Server not responding. Please check backend connection." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot-overlay">
      <div className="chatbot-container">
        <div className="chatbot-header">
          <h3>AI Energy Assistant ⚡</h3>
          <button className="chatbot-close" onClick={onClose}>
            <X />
          </button>
        </div>

        <div className="chatbot-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`message ${msg.from}`}>
              <p>{msg.text}</p>
            </div>
          ))}
          {loading && (
            <div className="message ai">
              <p>Thinking...</p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="chatbot-input">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask me about energy saving, cost, or device usage..."
            disabled={loading}
          />
          <button onClick={handleSend} disabled={loading}>
            <Send />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;*/

import React, { useState, useRef, useEffect } from "react";
import "./Chatbot.css";
import { sendChatQuery } from "../services/chatbotService";

const Chatbot = ({ onClose }) => {
  const [messages, setMessages] = useState([
    { from: "ai", text: "👋 Hi! I'm your AI Energy Assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { from: "user", text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");

    const response = await sendChatQuery(input, "METER001");
    const botReply = response.success
      ? response.reply
      : "⚠️ Sorry, I couldn’t understand that. Try again?";
    setMessages(prev => [...prev, { from: "ai", text: botReply }]);
  };

  return (
    <div className="chatbot-overlay">
      <div className="chatbot-container">
        <div className="chatbot-header">
          Smart Energy Assistant
          <button className="chatbot-close" onClick={onClose}>✖</button>
        </div>

        <div className="chatbot-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`message ${msg.from}`}>
              {msg.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="chatbot-input">
          <input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button onClick={handleSend}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;







