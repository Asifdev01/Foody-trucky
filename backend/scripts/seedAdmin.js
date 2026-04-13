require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");

const seedAdmin = async () => {
  try {
    // Check if MONGODB_URI exists
    if (!process.env.MONGODB_URI) {
        console.error("❌ MONGODB_URI is not defined in .env");
        process.exit(1);
    }

    console.log("Attempting to connect to:", process.env.MONGODB_URI);
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("📡 Connected to MongoDB for seeding...");

    const adminEmail = "admin@share2serve.com";
    console.log("Checking for existing admin...");
    const adminExists = await User.findOne({ email: adminEmail });
    
    if (adminExists) {
      console.log(`ℹ️ Admin account (${adminEmail}) already exists.`);
      console.log("Deleting old admin to create fresh one...");
      await User.deleteOne({ email: adminEmail });
      console.log("Old admin deleted.");
    }

    console.log("Creating new admin user...");
    const newAdmin = await User.create({
      name: "Admin User",
      email: adminEmail,
      password: "admin123", // The User model will hash this automatically
      role: "admin",
    });

    console.log(`✅ Admin account created successfully!`);
    console.log(`📧 Email: ${adminEmail}`);
    console.log(`🔑 Password: admin123`);
    console.log(`🆔 ID: ${newAdmin._id}`);
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding admin:", error.message);
    console.error("Full error:", error);
    process.exit(1);
  }
};

seedAdmin();
