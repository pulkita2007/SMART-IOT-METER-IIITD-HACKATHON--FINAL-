
// const express = require("express");
// const { body } = require("express-validator");
// const { getUserAlerts, createAlert, markAlertAsRead, resolveAlert } = require("../controllers/alertController");
// const auth = require("../middleware/auth");
// const Alert = require("../models/Alert");

// const router = express.Router();

// // @route   GET /api/alerts/:userId
// // @desc    Get user alerts
// // @access  Private
// router.get("/:userId", auth, getUserAlerts);

// // @route   POST /api/alerts/create
// router.post("/create", async (req, res) => {
//   try {
//     const { deviceId, message, alertType, severity, metadata } = req.body;
//     const alert = await Alert.create({
//       deviceId,
//       message,
//       alertType,
//       severity,
//       metadata,
//       timestamp: new Date()
//     });
//     res.status(201).json({ success: true, data: alert });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// });


// // @route   PUT /api/alerts/:id/read
// // @desc    Mark alert as read
// // @access  Private
// router.put("/:id/read", auth, markAlertAsRead);

// // @route   PUT /api/alerts/:id/resolve
// // @desc    Resolve alert
// // @access  Private
// router.put("/:id/resolve", auth, resolveAlert);

// module.exports = router;
const express = require("express");
const router = express.Router();
const Alert = require("../models/Alert");
const {
  getUserAlerts,
  createAlert,
  markAlertAsRead,
  resolveAlert,
} = require("../controllers/alertController");

// GET all alerts
router.get("/", async (req, res) => {
  try {
    const alerts = await Alert.find().sort({ createdAt: -1 });
    res.status(200).json({alerts});
  } catch (err) {
    console.error("Error fetching alerts:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ✅ Route setup
router.get("/:userId", getUserAlerts);
router.post("/create", createAlert);
router.put("/:id/read", markAlertAsRead);
router.put("/:id/resolve", resolveAlert);

module.exports = router;
