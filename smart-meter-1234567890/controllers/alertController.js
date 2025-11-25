// const { validationResult } = require("express-validator");
// const Alert = require("../models/Alert");



// // @desc    Get all alerts (for dashboard display)
// // @route   GET /api/alerts
// // @access  Public or Private (depending on your setup)
// const getAllAlerts = async (req, res) => {
//   try {
//     const alerts = await Alert.find().sort({ createdAt: -1 });

//     res.status(200).json({
//       success: true,
//       count: alerts.length,
//       alerts
//     });
//   } catch (error) {
//     console.error("Get all alerts error:", error.message);
//     res.status(500).json({
//       success: false,
//       message: "Server error"
//     });
//   }
// };


// // @desc    Get user alerts
// // @route   GET /api/alerts/:userId
// // @access  Private
// const getUserAlerts = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const { limit = 50, page = 1, isRead, severity } = req.query;

//     const skip = (page - 1) * limit;
//     let query = { userId };

//     // Add filters
//     if (isRead !== undefined) {
//       query.isRead = isRead === "true";
//     }
//     if (severity) {
//       query.severity = severity;
//     }

//     const alerts = await Alert.find(query)
//       .sort({ createdAt: -1 })
//       .limit(parseInt(limit))
//       .skip(skip);

//     const total = await Alert.countDocuments(query);

//     res.json({
//       success: true,
//       count: alerts.length,
//       total,
//       alerts
//     });
//   } catch (error) {
//     console.error("Get alerts error:", error.message);
//     res.status(500).json({
//       success: false,
//       message: "Server error"
//     });
//   }
// };

// // @desc    Create alert
// // @route   POST /api/alerts/create
// // @access  Private
// const createAlert = async (req, res) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({
//         success: false,
//         errors: errors.array()
//       });
//     }

//     const { deviceId, message, alertType, severity, metadata } = req.body;

//     const alert = await Alert.create({
//       userId: req.user ? req.user._id : "000000000000000000000000", // fallback ID for system alerts
//       deviceId,
//       message,
//       alertType,
//       severity,
//       metadata
//     });

//         let aiMessage = null;

//     if (alertType === "voltage" && metadata?.voltage > 250) {
//       aiMessage = "⚡ Voltage spike detected — Check wiring connections and avoid overloading circuits.";
//     } 
//     else if (alertType === "current" && metadata?.current > 10) {
//       aiMessage = "💡 High current draw — Consider redistributing loads across devices.";
//     } 
//     else if (alertType === "power" && metadata?.power > 5000) {
//       aiMessage = "🔋 High power consumption — Turn off unused devices to reduce load.";
//     }

//     // 3️⃣ If AI suggestion exists, save it as a recommendation alert
//     if (aiMessage) {
//       await Alert.create({
//         userId: alert.userId,
//         deviceId,
//         message: aiMessage,
//         alertType: "recommendation",
//         severity: "info",
//         metadata: { fromAI: true }
//       });
//     }

//     res.status(201).json({
//       success: true,
//       alert
//     });
//   } catch (error) {
//     console.error("Create alert error:", error.message);
//     res.status(500).json({
//       success: false,
//       message: "Server error"
//     });
//   }
// };

// // @desc    Mark alert as read
// // @route   PUT /api/alerts/:id/read
// // @access  Private
// const markAlertAsRead = async (req, res) => {
//   try {
//     const alert = await Alert.findById(req.params.id);
    
//     if (!alert) {
//       return res.status(404).json({
//         success: false,
//         message: "Alert not found"
//       });
//     }

//     // Check if user owns the alert
//     if (alert.userId.toString() !== req.user._id.toString()) {
//       return res.status(401).json({
//         success: false,
//         message: "Not authorized to update this alert"
//       });
//     }

//     alert.isRead = true;
//     await alert.save();

//     res.json({
//       success: true,
//       alert
//     });
//   } catch (error) {
//     console.error("Mark alert as read error:", error.message);
//     res.status(500).json({
//       success: false,
//       message: "Server error"
//     });
//   }
// };

// // @desc    Resolve alert
// // @route   PUT /api/alerts/:id/resolve
// // @access  Private
// const resolveAlert = async (req, res) => {
//   try {
//     const alert = await Alert.findById(req.params.id);
    
//     if (!alert) {
//       return res.status(404).json({
//         success: false,
//         message: "Alert not found"
//       });
//     }

//     // Check if user owns the alert
//     if (alert.userId.toString() !== req.user._id.toString()) {
//       return res.status(401).json({
//         success: false,
//         message: "Not authorized to resolve this alert"
//       });
//     }

//     alert.isResolved = true;
//     alert.resolvedAt = new Date();
//     await alert.save();

//     res.json({
//       success: true,
//       alert
//     });
//   } catch (error) {
//     console.error("Resolve alert error:", error.message);
//     res.status(500).json({
//       success: false,
//       message: "Server error"
//     });
//   }
// };

// module.exports = {
//   getUserAlerts,
//   getAllAlerts,
//   createAlert,
//   markAlertAsRead,
//   resolveAlert
// };

const { validationResult } = require("express-validator");
const Alert = require("../models/Alert");
const { sendEnergyAlert } = require("../utils/notificationService");



// @desc    Get all alerts (for dashboard display)
// @route   GET /api/alerts
// @access  Public or Private (depending on your setup)
const getAllAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: alerts.length,
      alerts
    });
  } catch (error) {
    console.error("Get all alerts error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


// @desc    Get user alerts
// @route   GET /api/alerts/:userId
// @access  Private
const getUserAlerts = async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 50, page = 1, isRead, severity } = req.query;

    const skip = (page - 1) * limit;
    let query = { userId };

    // Add filters
    if (isRead !== undefined) {
      query.isRead = isRead === "true";
    }
    if (severity) {
      query.severity = severity;
    }

    const alerts = await Alert.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Alert.countDocuments(query);

    res.json({
      success: true,
      count: alerts.length,
      total,
      alerts
    });
  } catch (error) {
    console.error("Get alerts error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// @desc    Create alert
// @route   POST /api/alerts/create
// @access  Private
// const createAlert = async (req, res) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({
//         success: false,
//         errors: errors.array()
//       });
//     }

//     const { deviceId, message, alertType, severity, metadata } = req.body;

//     const alert = await Alert.create({
//       userId: req.user ? req.user._id : "000000000000000000000000", // fallback ID for system alerts
//       deviceId,
//       message,
//       alertType,
//       severity,
//       metadata
//     });

//         let aiMessage = null;

//     if (alertType === "voltage" && metadata?.voltage > 250) {
//       aiMessage = "⚡ Voltage spike detected — Check wiring connections and avoid overloading circuits.";
//     } 
//     else if (alertType === "current" && metadata?.current > 10) {
//       aiMessage = "💡 High current draw — Consider redistributing loads across devices.";
//     } 
//     else if (alertType === "power" && metadata?.power > 5000) {
//       aiMessage = "🔋 High power consumption — Turn off unused devices to reduce load.";
//     }

//     // 3️⃣ If AI suggestion exists, save it as a recommendation alert
//     if (aiMessage) {
//       await Alert.create({
//         userId: alert.userId,
//         deviceId,
//         message: aiMessage,
//         alertType: "recommendation",
//         severity: "info",
//         metadata: { fromAI: true }
//       });
//     }

//     res.status(201).json({
//       success: true,
//       alert
//     });
//   } catch (error) {
//     console.error("Create alert error:", error.message);
//     res.status(500).json({
//       success: false,
//       message: "Server error"
//     });
//   }
// };

const createAlert = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { deviceId, message, alertType, severity, metadata } = req.body;

    const userId = req.user ? req.user._id : "000000000000000000000000";

    // 1️⃣ Save original alert
    const alert = await Alert.create({
      userId,
      deviceId,
      message,
      alertType,
      severity,
      metadata
    });

    // 2️⃣ Send EMAIL + PUSH notification
    if (req.user?.email) {
      console.log("⚡ Sending energy alert email to:", req.user.email);

      await sendEnergyAlert({
        email: req.user.email,
        fcmToken: req.user.fcmToken, // if you have tokens
        deviceName: deviceId,
        alertType,
        message,
        energyData: metadata
      });
    }

    // 3️⃣ AI auto recommendation
//     let aiMessage = null;
//     if (alertType === "voltage" && metadata?.voltage > 255) {
//       aiMessage = "⚡ Voltage spike detected — Check wiring load.";}
//     // VOLTAGE ALERTS
//     if (alertType === "voltage") {
//   if (metadata?.voltage > 270) {
//     aiMessage = "⚡ Over-voltage detected — possible grid surge.";
//   } else if (metadata?.voltage < 160) {
//     aiMessage = "⚠️ Low voltage detected — possible brownout.";
// }

//     } else if (alertType === "current" && metadata?.current > 20) {
//       aiMessage = "💡 High current draw — redistribute load.";
//     } else if (alertType === "power" && metadata?.power > 5000) {
//       aiMessage = "🔋 Heavy power usage — turn off unused devices.";
//     }

// let aiMessage = null;

// if (alertType === "voltage") {
//   const voltage = metadata?.voltage;

//   if (voltage > 270) {
//     aiMessage = "⚡ Over-voltage detected — possible grid surge.";
//   } else if (voltage > 255) {
//     aiMessage = "⚡ Voltage spike detected — Check wiring load.";
//   } else if (voltage < 160) {
//     aiMessage = "⚠️ Low voltage detected — possible brownout.";
//   }
// }

// else if (alertType === "current") {
//   const current = metadata?.current;
//   if (current > 20) {
//     aiMessage = "💡 High current draw — redistribute load.";
//   }
// }

// else if (alertType === "power") {
//   const power = metadata?.power;
//   if ( power > 5000) {
//     aiMessage = "🔋 Heavy power usage — turn off unused devices.";
//   }
// }

let aiMessage = null;
    if (alertType === "voltage" && metadata?.voltage > 250) {
      aiMessage = "⚡ Voltage spike detected — Check wiring load.";
    } else if (alertType === "current" && metadata?.current > 10) {
      aiMessage = "💡 High current draw — redistribute load.";
    } else if (alertType === "power" && metadata?.power > 5000) {
      aiMessage = "🔋 Heavy power usage — turn off unused devices.";
    }


// 3️⃣ AI auto recommendation
// let aiMessage = null;

// if (alertType === "voltage") {
//   const v = metadata?.voltage;

//   if (v > 270) {
//     aiMessage = "⚡ Over-voltage detected — possible grid surge.";
//   } else if (v < 160) {
//     aiMessage = "⚠️ Low voltage detected — possible brownout.";
//   }
// }

// else if (alertType === "current" && metadata?.current > 20) {
//   aiMessage = "💡 High current draw — redistribute load.";
// }

// else if (alertType === "power" && metadata?.power > 5000) {
//   aiMessage = "🔋 Heavy power usage — turn off unused devices.";
// }


    if (aiMessage) {
      await Alert.create({
        userId,
        deviceId,
        message: aiMessage,
        alertType: "recommendation",
        severity: "info",
        metadata: { fromAI: true }
      });

      // AI suggestion email also
      if (req.user?.email) {
        await sendEnergyAlert({
          email: req.user.email,
          fcmToken: req.user.fcmToken,
          deviceName: deviceId,
          alertType: "AI Recommendation",
          message: aiMessage
        });
      }
    }

    res.status(201).json({ success: true, alert });

  } catch (error) {
    console.error("Create alert error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Mark alert as read
// @route   PUT /api/alerts/:id/read
// @access  Private
const markAlertAsRead = async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);
    
    if (!alert) {
      return res.status(404).json({
        success: false,
        message: "Alert not found"
      });
    }

    // Check if user owns the alert
    if (alert.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to update this alert"
      });
    }

    alert.isRead = true;
    await alert.save();

    res.json({
      success: true,
      alert
    });
  } catch (error) {
    console.error("Mark alert as read error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// @desc    Resolve alert
// @route   PUT /api/alerts/:id/resolve
// @access  Private
const resolveAlert = async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);
    
    if (!alert) {
      return res.status(404).json({
        success: false,
        message: "Alert not found"
      });
    }

    // Check if user owns the alert
    if (alert.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to resolve this alert"
      });
    }

    alert.isResolved = true;
    alert.resolvedAt = new Date();
    await alert.save();

    res.json({
      success: true,
      alert
    });
  } catch (error) {
    console.error("Resolve alert error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

module.exports = {
  getUserAlerts,
  getAllAlerts,
  createAlert,
  markAlertAsRead,
  resolveAlert
};
