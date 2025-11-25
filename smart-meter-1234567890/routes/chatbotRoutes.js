/*const express = require("express");
const { handleChatbotQuery } = require("../controllers/llmChatbotController");

const router = express.Router();
router.post("/ask", handleChatbotQuery);

module.exports = router;*/

const express = require("express");
const { handleChatbotQuery } = require("../controllers/llmChatbotController");

const router = express.Router();

// POST /api/chatbot/ask
router.post("/ask", handleChatbotQuery);

module.exports = router;





