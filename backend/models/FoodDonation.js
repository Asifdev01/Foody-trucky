const mongoose = require("mongoose");

const foodDonationSchema = new mongoose.Schema(
  {
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    charity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    donorName: {
      type: String,
      required: [true, "Please add donor name"],
    },
    donorEmail: {
      type: String,
      required: [true, "Please add donor email"],
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please add a valid email"],
    },
    donorPhone: {
      type: String,
      default: "",
    },
    foodName: {
      type: String,
      default: "",
    },
    dietaryType: {
      type: String,
      enum: ["Vegetarian", "Non-Vegetarian", "Both"],
      default: "Vegetarian",
    },
    foodType: {
      type: String,
      required: [true, "Please specify food type"],
      enum: ["Fruits", "Vegetables", "Grains", "Dairy", "Meat", "Bakery", "Cooked Food", "Other"],
      default: "Other",
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
    address: {
      type: String,
      default: "",
    },
    timeSlot: {
      type: Date,
      default: null,
    },
    images: {
      type: [String],
      default: [],
      validate: {
        validator: (arr) => arr.length <= 5,
        message: "A maximum of 5 images is allowed",
      },
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
