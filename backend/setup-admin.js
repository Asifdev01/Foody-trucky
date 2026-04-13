#!/usr/bin/env node
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

async function run() {
  console.log("=== Admin Setup ===");
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected!");

    const email = "admin@share2serve.com";
    
    // Delete existing admin if any
    await User.deleteOne({ email });
    console.log("Cleared old admin");

    // Create new admin
    const admin = await User.create({
      name: "Admin User",
      email,
      password: "admin123",
      role: "admin",
    });

    console.log("✅ New admin created!");
    console.log("Email: " + email);
    console.log("Password: admin123");
  } catch (e) {
    console.error("Error:", e.message);
  } finally {
    await mongoose.disconnect();
    console.log("Done");
  }
}

run();
