const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const mongoSanitize = require("express-mongo-sanitize");
const logger = require("./config/logger");
const { globalLimiter } = require("./middleware/rateLimiters");
const authRoutes = require("./routes/authRoutes");
const donorRoutes = require("./routes/donorRoutes");
const foodDonationRoutes = require("./routes/foodDonationRoutes");
const charityRoutes = require("./routes/charityRoutes");

const app = express();

// Security middlewares
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: "12mb" })); // accommodates base64 food-donation photos
app.use(mongoSanitize());

// Rate limiting (auth/food-donation-specific limiters are applied in their routers)
app.use("/api", globalLimiter);

// Access logging (combined format, written to logs/access.log)
if (process.env.NODE_ENV !== "test") {
  app.use(morgan("combined", { stream: logger.accessStream }));
}

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
  res.status(404).json({ success: false, message: "Resource not found" });
});

// Global Error Handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  logger.error(err.stack || err.message);

  let status = err.status || 500;
  let message = err.message || "Internal Server Error";

  if (err.name === "ValidationError") {
    status = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  } else if (err.name === "CastError") {
    status = 400;
    message = "Invalid ID format";
  } else if (err.code === 11000) {
    status = 409;
    const field = Object.keys(err.keyValue || {})[0] || "field";
    message = `Duplicate value for ${field}`;
  }

  res.status(status).json({
    success: false,
    message,
    error: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

module.exports = app;
