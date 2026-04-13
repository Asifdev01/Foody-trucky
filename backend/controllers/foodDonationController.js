const FoodDonation = require("../models/FoodDonation");

// @desc    Get available food donations (public - for charities)
// @route   GET /api/food-donations/available
// @access  Public
const getAvailableFoodDonations = async (req, res, next) => {
  try {
    const donations = await FoodDonation.find({ status: { $in: ["Pending", "Accepted"] } }).sort({ createdAt: -1 });
    res.status(200).json({ 
      success: true, 
      count: donations.length, 
      data: donations 
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all food donations
// @route   GET /api/food-donations
// @access  Private/Admin
const getFoodDonations = async (req, res, next) => {
  try {
    const donations = await FoodDonation.find({}).sort({ createdAt: -1 });
    res.status(200).json({ 
      success: true, 
      count: donations.length, 
      data: donations 
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a food donation
// @route   POST /api/food-donations
// @access  Private/Admin
const createFoodDonation = async (req, res, next) => {
  try {
    const donation = await FoodDonation.create(req.body);
    res.status(201).json({ 
      success: true, 
      message: "Food donation added successfully",
      data: donation 
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a food donation
// @route   PUT /api/food-donations/:id
// @access  Private/Admin
const updateFoodDonation = async (req, res, next) => {
  try {
    const donation = await FoodDonation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!donation) {
      return res.status(404).json({ 
        success: false, 
        message: "Food donation not found" 
      });
    }

    res.status(200).json({ 
      success: true, 
      message: "Food donation updated successfully",
      data: donation 
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a food donation
// @route   DELETE /api/food-donations/:id
// @access  Private/Admin
const deleteFoodDonation = async (req, res, next) => {
  try {
    const donation = await FoodDonation.findByIdAndDelete(req.params.id);

    if (!donation) {
      return res.status(404).json({ 
        success: false, 
        message: "Food donation not found" 
      });
    }

    res.status(200).json({ 
      success: true, 
      message: "Food donation deleted successfully",
      data: {} 
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { 
  getAvailableFoodDonations,
  getFoodDonations, 
  createFoodDonation, 
  updateFoodDonation, 
  deleteFoodDonation 
};
