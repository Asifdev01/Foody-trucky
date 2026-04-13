const express = require("express");
const router = express.Router();
const {
  getCharities,
  getCharity,
  createCharity,
  updateCharity,
  deleteCharity,
} = require("../controllers/charityController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// Public routes
router.get("/", getCharities);
router.get("/:id", getCharity);

// Admin routes
router.post("/", protect, adminOnly, createCharity);
router.put("/:id", protect, adminOnly, updateCharity);
router.delete("/:id", protect, adminOnly, deleteCharity);

module.exports = router;
