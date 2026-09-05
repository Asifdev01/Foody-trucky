// Loaded via jest's `setupFiles` — runs before any test file/module is required,
// so env vars set here are visible when app.js/authController.js first read process.env.
process.env.NODE_ENV = "test";
process.env.JWT_SECRET = process.env.JWT_SECRET || "test_jwt_secret";
process.env.JWT_ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || "15m";
process.env.JWT_REFRESH_EXPIRES_IN_DAYS = process.env.JWT_REFRESH_EXPIRES_IN_DAYS || "7";
process.env.CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
// Rate limiting is exercised manually (see plan verification steps), not in Jest —
// keep limits high here so unrelated test assertions never trip a 429.
process.env.RATE_LIMIT_GLOBAL_MAX = "100000";
process.env.RATE_LIMIT_AUTH_MAX = "100000";
process.env.RATE_LIMIT_REFRESH_MAX = "100000";
process.env.RATE_LIMIT_FOOD_DONATION_MAX = "100000";

const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongod;

const connectTestDB = async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
};

const clearTestDB = async () => {
  const collections = mongoose.connection.collections;
  for (const key of Object.keys(collections)) {
    await collections[key].deleteMany({});
  }
};

const closeTestDB = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  if (mongod) await mongod.stop();
};

module.exports = { connectTestDB, clearTestDB, closeTestDB };
