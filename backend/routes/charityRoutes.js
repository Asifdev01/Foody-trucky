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
const validate = require("../middleware/validate");
const { createCharityValidators, updateCharityValidators } = require("../validators/charityValidators");

// Public routes
router.get("/", getCharities);
router.get("/:id", getCharity);

// Admin routes
router.post("/", protect, adminOnly, validate(createCharityValidators), createCharity);
router.put("/:id", protect, adminOnly, validate(updateCharityValidators), updateCharity);
router.delete("/:id", protect, adminOnly, deleteCharity);

module.exports = router;
