require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

console.log("Starting admin seed test...");
console.log("MONGODB_URI:", process.env.MONGODB_URI);

const seedAdmin = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    const adminEmail = "admin@share2serve.com";
    console.log("Checking if admin exists...");
    const adminExists = await User.findOne({ email: adminEmail });
    
    if (adminExists) {
      console.log(`ℹ️ Admin already exists`);
      await mongoose.disconnect();
      process.exit(0);
    }

    console.log("Creating new admin...");
    const newAdmin = await User.create({
      name: "Admin User",
      email: adminEmail,
      password: "admin123",
      role: "admin",
    });

    console.log(`✅ Admin created successfully!`);
    console.log(`📧 Email: ${adminEmail}`);
    console.log(`🔑 Password: admin123`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    console.error(error);
    process.exit(1);
  }
};

seedAdmin();
