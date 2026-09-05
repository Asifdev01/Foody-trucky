require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");

const DEV_DEFAULT_EMAIL = "admin@share2serve.com";
const DEV_DEFAULT_PASSWORD = "admin123";

const seedAdmin = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error("❌ MONGODB_URI is not defined in .env");
      process.exit(1);
    }

    const email = process.env.ADMIN_SEED_EMAIL || DEV_DEFAULT_EMAIL;
    const password = process.env.ADMIN_SEED_PASSWORD || DEV_DEFAULT_PASSWORD;

    if (!process.env.ADMIN_SEED_PASSWORD && process.env.NODE_ENV === "production") {
      console.error(
        "❌ Refusing to seed an admin with the fallback dev password in production. " +
          "Set ADMIN_SEED_EMAIL and ADMIN_SEED_PASSWORD in your environment."
      );
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("📡 Connected to MongoDB for seeding...");

    await User.deleteOne({ email });

    const admin = await User.create({
      name: "Admin User",
      email,
      password, // hashed automatically by User model's pre-save hook
      role: "admin",
    });

    console.log("✅ Admin account created successfully!");
    console.log(`📧 Email: ${email}`);
    if (!process.env.ADMIN_SEED_PASSWORD) {
      console.log(`🔑 Password: ${password} (dev default — set ADMIN_SEED_PASSWORD to override)`);
    }
    console.log(`🆔 ID: ${admin._id}`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding admin:", error.message);
    process.exit(1);
  }
};

seedAdmin();
