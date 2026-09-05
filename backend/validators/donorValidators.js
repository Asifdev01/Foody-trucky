const { body } = require("express-validator");

const TYPES = ["Individual", "Business"];
const STATUSES = ["Active", "Inactive"];

const createDonorValidators = [
  body("name").trim().notEmpty().withMessage("Please add donor name"),
  body("email").trim().isEmail().withMessage("Please add a valid email").normalizeEmail(),
  body("type").trim().isIn(TYPES).withMessage(`type must be one of: ${TYPES.join(", ")}`),
  body("status").optional().trim().isIn(STATUSES).withMessage(`status must be one of: ${STATUSES.join(", ")}`),
];

module.exports = { createDonorValidators };
