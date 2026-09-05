const { body } = require("express-validator");
const xss = require("xss");

const CATEGORIES = ["Food", "Education", "Healthcare", "Housing", "Disaster Relief", "Other"];
const STATUSES = ["Active", "Inactive"];

const sanitizeText = (field, { optional = false } = {}) => {
  const chain = body(field);
  return (optional ? chain.optional({ values: "falsy" }) : chain.notEmpty().withMessage(`Please add ${field}`))
    .trim()
    .customSanitizer((value) => (value ? xss(value) : value));
};

const createCharityValidators = [
  body("name").trim().notEmpty().withMessage("Please add charity name"),
  body("category").trim().isIn(CATEGORIES).withMessage(`category must be one of: ${CATEGORIES.join(", ")}`),
  sanitizeText("description"),
  sanitizeText("mission"),
  body("email").trim().isEmail().withMessage("Please add a valid email").normalizeEmail(),
  body("phone").trim().notEmpty().withMessage("Please add a phone number"),
  body("address").trim().notEmpty().withMessage("Please add an address"),
  body("city").trim().notEmpty().withMessage("Please add a city"),
  body("zipCode").trim().notEmpty().withMessage("Please add a zip code"),
  body("website").optional({ values: "falsy" }).trim().isURL().withMessage("Please add a valid website URL"),
  body("yearEstablished").isInt({ min: 1800, max: new Date().getFullYear() }).withMessage("Please add a valid year established"),
];

const updateCharityValidators = [
  body("name").optional().trim().notEmpty().withMessage("Charity name cannot be empty"),
  body("category").optional().trim().isIn(CATEGORIES).withMessage(`category must be one of: ${CATEGORIES.join(", ")}`),
  sanitizeText("description", { optional: true }),
  sanitizeText("mission", { optional: true }),
  body("email").optional().trim().isEmail().withMessage("Please add a valid email").normalizeEmail(),
  body("phone").optional().trim().notEmpty().withMessage("Phone cannot be empty"),
  body("address").optional().trim().notEmpty().withMessage("Address cannot be empty"),
  body("city").optional().trim().notEmpty().withMessage("City cannot be empty"),
  body("zipCode").optional().trim().notEmpty().withMessage("Zip code cannot be empty"),
  body("website").optional({ values: "falsy" }).trim().isURL().withMessage("Please add a valid website URL"),
  body("yearEstablished").optional().isInt({ min: 1800, max: new Date().getFullYear() }).withMessage("Please add a valid year established"),
  body("status").optional().trim().isIn(STATUSES).withMessage(`status must be one of: ${STATUSES.join(", ")}`),
];

module.exports = { createCharityValidators, updateCharityValidators };
