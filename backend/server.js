require("dotenv").config();
const connectDB = require("./config/db");
const logger = require("./config/logger");

// Validate essential environment variables
if (!process.env.JWT_SECRET) {
  logger.error("FATAL ERROR: JWT_SECRET is not defined.");
  process.exit(1);
}
if (!process.env.MONGODB_URI) {
  logger.warn("WARNING: MONGODB_URI is not defined. Database operations will fail.");
}

connectDB();

const app = require("./app");

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
});
