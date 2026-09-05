const rateLimit = require("express-rate-limit");

const windowMs = (minutes) => minutes * 60 * 1000;

const rateLimitResponse = (req, res) => {
  res.status(429).json({
    success: false,
    message: "Too many requests, please try again later",
  });
};

const globalLimiter = rateLimit({
  windowMs: windowMs(15),
  max: Number(process.env.RATE_LIMIT_GLOBAL_MAX) || 300,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitResponse,
});

const authLimiter = rateLimit({
  windowMs: windowMs(Number(process.env.RATE_LIMIT_AUTH_WINDOW_MIN) || 15),
  max: Number(process.env.RATE_LIMIT_AUTH_MAX) || 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitResponse,
});

const refreshLimiter = rateLimit({
  windowMs: windowMs(15),
  max: Number(process.env.RATE_LIMIT_REFRESH_MAX) || 30,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitResponse,
});

const foodDonationCreateLimiter = rateLimit({
  windowMs: windowMs(15),
  max: Number(process.env.RATE_LIMIT_FOOD_DONATION_MAX) || 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitResponse,
});

module.exports = { globalLimiter, authLimiter, refreshLimiter, foodDonationCreateLimiter };
