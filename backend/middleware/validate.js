const { validationResult } = require("express-validator");

/**
 * Wraps an array of express-validator chains. Runs them, then short-circuits
 * with a 400 if any failed. `message` stays a top-level string so existing
 * frontend code (`throw new Error(data.message)`) keeps working unchanged.
 */
const validate = (chains) => [
  ...chains,
  (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    const errorList = errors.array();
    return res.status(400).json({
      success: false,
      message: errorList[0].msg,
      errors: errorList,
    });
  },
];

module.exports = validate;
