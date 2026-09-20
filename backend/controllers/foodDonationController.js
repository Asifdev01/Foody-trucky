const FoodDonation = require("../models/FoodDonation");
const { getPagination, buildPaginationMeta } = require("../utils/pagination");

// @desc    Get available food donations (public - for charities)
// @route   GET /api/food-donations/available
// @access  Public
const getAvailableFoodDonations = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const filter = { status: { $in: ["Pending", "Accepted"] } };

    const [donations, total] = await Promise.all([
      FoodDonation.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      FoodDonation.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      count: donations.length,
      data: donations,
      pagination: buildPaginationMeta(page, limit, total),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get the logged-in donor's own food donations
// @route   GET /api/food-donations/mine
// @access  Private/Donor
const getMyDonations = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const filter = { donor: req.user.id };

    const [donations, total] = await Promise.all([
      FoodDonation.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      FoodDonation.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      count: donations.length,
      data: donations,
      pagination: buildPaginationMeta(page, limit, total),
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
    const { page, limit, skip } = getPagination(req.query);

    const [donations, total] = await Promise.all([
      FoodDonation.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit),
      FoodDonation.countDocuments({}),
    ]);

    res.status(200).json({
      success: true,
      count: donations.length,
      data: donations,
      pagination: buildPaginationMeta(page, limit, total),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a food donation
// @route   POST /api/food-donations
// @access  Private/Donor (or Admin, creating on a donor's behalf)
const createFoodDonation = async (req, res, next) => {
  try {
    const donation = await FoodDonation.create({
      ...req.body,
      donor: req.user.id,
      donorName: req.user.name,
      donorEmail: req.user.email,
      status: "Pending",
      charity: null,
    });
    res.status(201).json({
      success: true,
      message: "Food donation added successfully",
      data: donation
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Accept a pending food donation (claims it for the logged-in charity)
// @route   PATCH /api/food-donations/:id/accept
// @access  Private/Charity
const acceptFoodDonation = async (req, res, next) => {
  try {
    const donation = await FoodDonation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({ success: false, message: "Food donation not found" });
    }
    if (donation.status !== "Pending") {
      return res.status(409).json({ success: false, message: "This donation is no longer available" });
    }

    donation.status = "Accepted";
    donation.charity = req.user.id;
    await donation.save();

    res.status(200).json({ success: true, message: "Donation accepted", data: donation });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark an accepted donation as distributed (picked up) by the accepting charity
// @route   PATCH /api/food-donations/:id/distribute
// @access  Private/Charity
const distributeFoodDonation = async (req, res, next) => {
  try {
    const donation = await FoodDonation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({ success: false, message: "Food donation not found" });
    }
    if (donation.status !== "Accepted" || String(donation.charity) !== req.user.id) {
      return res.status(403).json({ success: false, message: "You can only distribute donations you accepted" });
    }

    donation.status = "Distributed";
    await donation.save();

    res.status(200).json({ success: true, message: "Donation marked as distributed", data: donation });
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
  getMyDonations,
  getFoodDonations,
  createFoodDonation,
  acceptFoodDonation,
  distributeFoodDonation,
  updateFoodDonation,
  deleteFoodDonation
};
