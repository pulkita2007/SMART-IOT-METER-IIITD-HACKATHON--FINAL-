const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    // Use process.env to access your .env variable
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ Database connection error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
