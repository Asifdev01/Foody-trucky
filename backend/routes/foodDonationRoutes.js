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

// Public route - get available food donations
router.get("/available", getAvailableFoodDonations);

// All other food donation routes are protected and admin-only
router.use(protect);
router.use(adminOnly);

router.route("/")
  .get(getFoodDonations)
  .post(createFoodDonation);

router.route("/:id")
  .put(updateFoodDonation)
  .delete(deleteFoodDonation);

module.exports = router;
