const express = require("express");
const router = express.Router();
const {
  getAvailableFoodDonations,
  getMyDonations,
  getFoodDonations,
  createFoodDonation,
  acceptFoodDonation,
  distributeFoodDonation,
  updateFoodDonation,
  deleteFoodDonation
} = require("../controllers/foodDonationController");
const { protect, adminOnly, authorize } = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const { createFoodDonationValidators, updateFoodDonationValidators } = require("../validators/foodDonationValidators");
const { foodDonationCreateLimiter } = require("../middleware/rateLimiters");

// All food donation routes require a logged-in account
router.use(protect);

// Charities (and admin) browse donations still awaiting/undergoing pickup
router.get("/available", getAvailableFoodDonations);

// Donor's own submissions
router.get("/mine", authorize("donor"), getMyDonations);

// Donors (or admin, creating on a donor's behalf) submit a new donation
router.post(
  "/",
  authorize("donor", "admin"),
  foodDonationCreateLimiter,
  validate(createFoodDonationValidators),
  createFoodDonation
);

// Charities claim/complete a donation
router.patch("/:id/accept", authorize("charity"), acceptFoodDonation);
router.patch("/:id/distribute", authorize("charity"), distributeFoodDonation);

// Everything else (full listing, edit, delete) stays admin-only
router.use(adminOnly);

router.get("/", getFoodDonations);

router.route("/:id")
  .put(validate(updateFoodDonationValidators), updateFoodDonation)
  .delete(deleteFoodDonation);

module.exports = router;
