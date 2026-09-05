const express = require("express");
const router = express.Router();
const { getDonors, createDonor } = require("../controllers/donorController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const { createDonorValidators } = require("../validators/donorValidators");

// All donor routes are protected and admin-only
router.use(protect);
router.use(adminOnly);

router.route("/")
  .get(getDonors)
  .post(validate(createDonorValidators), createDonor);

module.exports = router;
