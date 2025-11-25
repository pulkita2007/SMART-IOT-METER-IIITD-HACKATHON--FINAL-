// routes/costEfficiencyRoutes.js
const express = require("express");
const router = express.Router();
const { getCostEfficiency } = require("../controllers/costEfficiencyController");

router.get("/", getCostEfficiency);

module.exports = router; // ✅ must export router, not {}
