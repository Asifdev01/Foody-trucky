const { body } = require("express-validator");
const xss = require("xss");

const FOOD_TYPES = ["Fruits", "Vegetables", "Grains", "Dairy", "Meat", "Bakery", "Cooked Food", "Other"];
const UNITS = ["kg", "liter", "pieces", "boxes", "packets"];
const STATUSES = ["Pending", "Accepted", "Distributed", "Rejected"];

const sanitizeText = (field, { optional = false } = {}) => {
  const chain = body(field);
  return (optional ? chain.optional({ values: "falsy" }) : chain.notEmpty().withMessage(`Please add ${field}`))
    .trim()
    .customSanitizer((value) => (value ? xss(value) : value));
};

const createFoodDonationValidators = [
  body("donorName").trim().notEmpty().withMessage("Please add donor name"),
  body("donorEmail").trim().isEmail().withMessage("Please add a valid donor email").normalizeEmail(),
  body("foodType").trim().isIn(FOOD_TYPES).withMessage(`foodType must be one of: ${FOOD_TYPES.join(", ")}`),
  body("quantity").isFloat({ min: 0.1 }).withMessage("Quantity must be a number greater than 0"),
  body("unit").trim().isIn(UNITS).withMessage(`unit must be one of: ${UNITS.join(", ")}`),
  sanitizeText("description", { optional: true }),
  sanitizeText("notes", { optional: true }),
];

const updateFoodDonationValidators = [
  body("donorName").optional().trim().notEmpty().withMessage("Donor name cannot be empty"),
  body("donorEmail").optional().trim().isEmail().withMessage("Please add a valid donor email").normalizeEmail(),
  body("foodType").optional().trim().isIn(FOOD_TYPES).withMessage(`foodType must be one of: ${FOOD_TYPES.join(", ")}`),
  body("quantity").optional().isFloat({ min: 0.1 }).withMessage("Quantity must be a number greater than 0"),
  body("unit").optional().trim().isIn(UNITS).withMessage(`unit must be one of: ${UNITS.join(", ")}`),
  body("status").optional().trim().isIn(STATUSES).withMessage(`status must be one of: ${STATUSES.join(", ")}`),
  sanitizeText("description", { optional: true }),
  sanitizeText("notes", { optional: true }),
];

module.exports = { createFoodDonationValidators, updateFoodDonationValidators };
