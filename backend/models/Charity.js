const mongoose = require("mongoose");

const charitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add charity name"],
      unique: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["Food", "Education", "Healthcare", "Housing", "Disaster Relief", "Other"],
    },
    description: {
      type: String,
      required: [true, "Please add charity description"],
    },
    mission: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please add a valid email"],
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    zipCode: {
      type: String,
      required: true,
    },
    website: {
      type: String,
      required: false,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 4.5,
    },
    reviews: {
      type: Number,
      default: 0,
    },
    yearEstablished: {
      type: Number,
      required: true,
    },
    peopleHelped: {
      type: Number,
      default: 0,
    },
    certified: {
      type: Boolean,
      default: true,
    },
    image: {
      type: String,
      default: "https://via.placeholder.com/300x200?text=Charity",
    },
    socialLinks: {
      facebook: String,
      twitter: String,
      instagram: String,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Charity", charitySchema);
