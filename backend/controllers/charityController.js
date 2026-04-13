const Charity = require("../models/Charity");

// @desc    Get all charities
// @route   GET /api/charities
// @access  Public
const getCharities = async (req, res, next) => {
  try {
    const { category, sortBy } = req.query;
    let query = { status: "Active" };

    if (category) {
      query.category = category;
    }

    let charities = await Charity.find(query);

    // Sorting options
    if (sortBy === "rating") {
      charities.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "newest") {
      charities.sort((a, b) => b.yearEstablished - a.yearEstablished);
    } else if (sortBy === "mostHelped") {
      charities.sort((a, b) => b.peopleHelped - a.peopleHelped);
    }

    res.status(200).json({
      success: true,
      count: charities.length,
      data: charities,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single charity
// @route   GET /api/charities/:id
// @access  Public
const getCharity = async (req, res, next) => {
  try {
    const charity = await Charity.findById(req.params.id);

    if (!charity) {
      return res.status(404).json({
        success: false,
        message: "Charity not found",
      });
    }

    res.status(200).json({
      success: true,
      data: charity,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a charity (Admin only)
// @route   POST /api/charities
// @access  Private/Admin
const createCharity = async (req, res, next) => {
  try {
    const charity = await Charity.create(req.body);
    res.status(201).json({
      success: true,
      message: "Charity added successfully",
      data: charity,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a charity (Admin only)
// @route   PUT /api/charities/:id
// @access  Private/Admin
const updateCharity = async (req, res, next) => {
  try {
    const charity = await Charity.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!charity) {
      return res.status(404).json({
        success: false,
        message: "Charity not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Charity updated successfully",
      data: charity,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a charity (Admin only)
// @route   DELETE /api/charities/:id
// @access  Private/Admin
const deleteCharity = async (req, res, next) => {
  try {
    const charity = await Charity.findByIdAndDelete(req.params.id);

    if (!charity) {
      return res.status(404).json({
        success: false,
        message: "Charity not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Charity deleted successfully",
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCharities,
  getCharity,
  createCharity,
  updateCharity,
  deleteCharity,
};
