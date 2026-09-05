const express = require("express");
const router = express.Router();
const {
  getAvailableFoodDonations,
  getFoodDonations,
  createFoodDonation,
  updateFoodDonation,
  deleteFoodDonation
} = require("../controllers/foodDonationController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const { createFoodDonationValidators, updateFoodDonationValidators } = require("../validators/foodDonationValidators");
const { foodDonationCreateLimiter } = require("../middleware/rateLimiters");

// Public route - get available food donations
router.get("/available", getAvailableFoodDonations);

// All other food donation routes are protected and admin-only
router.use(protect);
router.use(adminOnly);

router.route("/")
  .get(getFoodDonations)
  .post(foodDonationCreateLimiter, validate(createFoodDonationValidators), createFoodDonation);

router.route("/:id")
  .put(validate(updateFoodDonationValidators), updateFoodDonation)
  .delete(deleteFoodDonation);

module.exports = router;
