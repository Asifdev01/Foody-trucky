const { body } = require("express-validator");
const xss = require("xss");

const FOOD_TYPES = ["Fruits", "Vegetables", "Grains", "Dairy", "Meat", "Bakery", "Cooked Food", "Other"];
const DIETARY_TYPES = ["Vegetarian", "Non-Vegetarian", "Both"];
const UNITS = ["kg", "liter", "pieces", "boxes", "packets"];
const STATUSES = ["Pending", "Accepted", "Distributed", "Rejected"];
const MAX_IMAGES = 5;
const MAX_IMAGE_LENGTH = 2_000_000; // ~1.5MB decoded, generous for a base64 data URI

const sanitizeText = (field, { optional = false } = {}) => {
  const chain = body(field);
  return (optional ? chain.optional({ values: "falsy" }) : chain.notEmpty().withMessage(`Please add ${field}`))
    .trim()
    .customSanitizer((value) => (value ? xss(value) : value));
};

const createFoodDonationValidators = [
  sanitizeText("foodName"),
  body("dietaryType").trim().isIn(DIETARY_TYPES).withMessage(`dietaryType must be one of: ${DIETARY_TYPES.join(", ")}`),
  body("foodType").optional().trim().isIn(FOOD_TYPES).withMessage(`foodType must be one of: ${FOOD_TYPES.join(", ")}`),
  body("quantity").isFloat({ min: 0.1 }).withMessage("Quantity must be a number greater than 0"),
  body("unit").trim().isIn(UNITS).withMessage(`unit must be one of: ${UNITS.join(", ")}`),
  body("donorPhone").trim().notEmpty().withMessage("Please add a contact phone number").isLength({ max: 20 }),
  sanitizeText("address"),
  body("timeSlot").optional({ values: "falsy" }).isISO8601().withMessage("timeSlot must be a valid date/time"),
  body("images").optional().isArray({ max: MAX_IMAGES }).withMessage(`A maximum of ${MAX_IMAGES} images is allowed`),
  body("images.*")
    .optional()
    .isString()
    .isLength({ max: MAX_IMAGE_LENGTH })
    .withMessage("Each image is too large")
    .matches(/^data:image\/(jpeg|png|jpg|webp);base64,/)
    .withMessage("Images must be JPG, PNG, or WebP"),
  sanitizeText("description", { optional: true }),
  sanitizeText("notes", { optional: true }),
];

const updateFoodDonationValidators = [
  body("donorName").optional().trim().notEmpty().withMessage("Donor name cannot be empty"),
  body("donorEmail").optional().trim().isEmail().withMessage("Please add a valid donor email").normalizeEmail(),
  body("donorPhone").optional().trim().isLength({ max: 20 }),
  body("dietaryType").optional().trim().isIn(DIETARY_TYPES).withMessage(`dietaryType must be one of: ${DIETARY_TYPES.join(", ")}`),
  body("foodType").optional().trim().isIn(FOOD_TYPES).withMessage(`foodType must be one of: ${FOOD_TYPES.join(", ")}`),
  body("quantity").optional().isFloat({ min: 0.1 }).withMessage("Quantity must be a number greater than 0"),
  body("unit").optional().trim().isIn(UNITS).withMessage(`unit must be one of: ${UNITS.join(", ")}`),
  body("status").optional().trim().isIn(STATUSES).withMessage(`status must be one of: ${STATUSES.join(", ")}`),
  body("timeSlot").optional({ values: "falsy" }).isISO8601().withMessage("timeSlot must be a valid date/time"),
  body("images").optional().isArray({ max: MAX_IMAGES }).withMessage(`A maximum of ${MAX_IMAGES} images is allowed`),
  sanitizeText("foodName", { optional: true }),
  sanitizeText("address", { optional: true }),
  sanitizeText("description", { optional: true }),
  sanitizeText("notes", { optional: true }),
];

module.exports = { createFoodDonationValidators, updateFoodDonationValidators };
