const Charity = require("../models/Charity");
const { getPagination, buildPaginationMeta } = require("../utils/pagination");

const SORT_OPTIONS = {
  rating: { rating: -1 },
  newest: { yearEstablished: -1 },
  mostHelped: { peopleHelped: -1 },
};

// @desc    Get all charities
// @route   GET /api/charities
// @access  Public
const getCharities = async (req, res, next) => {
  try {
    const { category, sortBy } = req.query;
    const query = { status: "Active" };

    if (category) {
      query.category = category;
    }

    const sort = SORT_OPTIONS[sortBy] || { createdAt: -1 };
    const { page, limit, skip } = getPagination(req.query);

    const [charities, total] = await Promise.all([
      Charity.find(query).sort(sort).skip(skip).limit(limit),
      Charity.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: charities.length,
      data: charities,
      pagination: buildPaginationMeta(page, limit, total),
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
