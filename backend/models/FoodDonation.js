const mongoose = require("mongoose");

const foodDonationSchema = new mongoose.Schema(
  {
    donorName: {
      type: String,
      required: [true, "Please add donor name"],
    },
    donorEmail: {
      type: String,
      required: [true, "Please add donor email"],
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please add a valid email"],
    },
    foodType: {
      type: String,
      required: [true, "Please specify food type"],
      enum: ["Fruits", "Vegetables", "Grains", "Dairy", "Meat", "Bakery", "Cooked Food", "Other"],
    },
    quantity: {
      type: Number,
      required: [true, "Please add quantity"],
      min: 0.1,
    },
    unit: {
      type: String,
      required: true,
      enum: ["kg", "liter", "pieces", "boxes", "packets"],
      default: "kg",
    },
    description: {
      type: String,
      default: "",
    },
    donationDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Distributed", "Rejected"],
      default: "Pending",
    },
    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("FoodDonation", foodDonationSchema);
