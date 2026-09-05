const express = require("express");
const router = express.Router();
const { signup, login, refresh, logout, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const { signupValidators, loginValidators, refreshValidators } = require("../validators/authValidators");
const { authLimiter, refreshLimiter } = require("../middleware/rateLimiters");

// Public routes
router.post("/signup", authLimiter, validate(signupValidators), signup);
router.post("/login", authLimiter, validate(loginValidators), login);
router.post("/refresh", refreshLimiter, validate(refreshValidators), refresh);
router.post("/logout", logout);

// Protected route – get logged-in user info
router.get("/me", protect, getMe);

module.exports = router;
