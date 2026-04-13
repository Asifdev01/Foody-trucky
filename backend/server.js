require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const donorRoutes = require("./routes/donorRoutes");
const foodDonationRoutes = require("./routes/foodDonationRoutes");
const charityRoutes = require("./routes/charityRoutes");

// Connect to Database
connectDB();

// Validate essential environment variables
if (!process.env.JWT_SECRET) {
  console.error("❌ FATAL ERROR: JWT_SECRET is not defined.");
  process.exit(1);
}
if (!process.env.MONGODB_URI) {
  console.warn("⚠️ WARNING: MONGODB_URI is not defined. Database operations will fail.");
}

const app = express();

// Middlewares
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

// Request logger (basic)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/donors", donorRoutes);
app.use("/api/food-donations", foodDonationRoutes);
app.use("/api/charities", charityRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Share2Serve API is running ✅" });
});

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ message: "Resource not found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("🔥 Internal Server Error:", err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
