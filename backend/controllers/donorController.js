const Donor = require("../models/Donor");
const { getPagination, buildPaginationMeta } = require("../utils/pagination");

// @desc    Get all donors
// @route   GET /api/donors
// @access  Private/Admin
const getDonors = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);

    const [donors, total] = await Promise.all([
      Donor.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Donor.countDocuments({}),
    ]);

    res.status(200).json({
      success: true,
      count: donors.length,
      data: donors,
      pagination: buildPaginationMeta(page, limit, total),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a donor
// @route   POST /api/donors
// @access  Private/Admin
const createDonor = async (req, res, next) => {
  try {
    const donor = await Donor.create(req.body);
    res.status(201).json({ success: true, message: "Donor added successfully", data: donor });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDonors, createDonor };
