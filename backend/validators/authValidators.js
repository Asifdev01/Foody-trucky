const { body } = require("express-validator");

const signupValidators = [
  body("name").trim().notEmpty().withMessage("Please add a name"),
  body("email").trim().isEmail().withMessage("Please provide a valid email address").normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .matches(/[A-Za-z]/)
    .withMessage("Password must contain at least one letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number"),
];

const loginValidators = [
  body("email").trim().isEmail().withMessage("Please provide a valid email address").normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
];

const refreshValidators = [
  body("refreshToken").trim().notEmpty().withMessage("Refresh token is required"),
];

module.exports = { signupValidators, loginValidators, refreshValidators };
