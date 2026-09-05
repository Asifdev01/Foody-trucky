const crypto = require("crypto");
const User = require("../models/User");
const RefreshToken = require("../models/RefreshToken");
const jwt = require("jsonwebtoken");

const REFRESH_TOKEN_BYTES = 40;
const REFRESH_TOKEN_EXPIRES_IN_DAYS = Number(process.env.JWT_REFRESH_EXPIRES_IN_DAYS) || 7;

// Helper: Generate short-lived JWT access token
const generateAccessToken = (user) =>
  jwt.sign(
    { id: user._id, name: user.name, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m" }
  );

const hashToken = (token) => crypto.createHash("sha256").update(token).digest("hex");

// Helper: Issue + persist an opaque refresh token, return the plaintext value
const generateRefreshToken = async (userId) => {
  const plainToken = crypto.randomBytes(REFRESH_TOKEN_BYTES).toString("hex");
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRES_IN_DAYS * 24 * 60 * 60 * 1000);

  await RefreshToken.create({
    user: userId,
    tokenHash: hashToken(plainToken),
    expiresAt,
  });

  return plainToken;
};

// ─── Signup ──────────────────────────────────────────────────────────────────
const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(409).json({ success: false, message: "User already exists with this email" });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: "user", // Default role
    });

    const [token, refreshToken] = await Promise.all([
      generateAccessToken(user),
      generateRefreshToken(user._id),
    ]);

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      token,
      refreshToken,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    next(error);
  }
};

// ─── Login ───────────────────────────────────────────────────────────────────
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const [token, refreshToken] = await Promise.all([
      generateAccessToken(user),
      generateRefreshToken(user._id),
    ]);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      refreshToken,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    next(error);
  }
};

// ─── Refresh ─────────────────────────────────────────────────────────────────
const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const tokenHash = hashToken(refreshToken);

    const stored = await RefreshToken.findOne({ tokenHash });
    if (!stored || stored.expiresAt < new Date()) {
      if (stored) await stored.deleteOne();
      return res.status(401).json({ success: false, message: "Refresh token invalid or expired" });
    }

    const user = await User.findById(stored.user);
    if (!user) {
      await stored.deleteOne();
      return res.status(401).json({ success: false, message: "Refresh token invalid or expired" });
    }

    // Rotate: delete the used token, issue a fresh pair
    await stored.deleteOne();
    const [newToken, newRefreshToken] = await Promise.all([
      generateAccessToken(user),
      generateRefreshToken(user._id),
    ]);

    res.status(200).json({
      success: true,
      token: newToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    next(error);
  }
};

// ─── Logout ──────────────────────────────────────────────────────────────────
const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (refreshToken) {
      await RefreshToken.deleteOne({ tokenHash: hashToken(refreshToken) });
    }
    res.status(200).json({ success: true, message: "Logged out" });
  } catch (error) {
    next(error);
  }
};

// ─── Get Me ───────────────────────────────────────────────────────
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

module.exports = { signup, login, refresh, logout, getMe };
