const Discount = require("../models/discountModel");

/**
 * Create a discount
 */
exports.createDiscount = async (req, res) => {
  try {
    const {
      organization_id,
      name,
      description,
      discountType,
      discountValue,
      startDate,
      endDate,
    } = req.body;

    if (
      !organization_id ||
      !name ||
      !discountType ||
      !discountValue ||
      !startDate ||
      !endDate
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const discountID = await Discount.createDiscount(
      organization_id,
      name,
      description,
      discountType,
      discountValue,
      startDate,
      endDate
    );

    res
      .status(201)
      .json({ message: "Discount created successfully", discountID });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * Get all discounts by organization ID
 */
exports.getAllDiscounts = async (req, res) => {
  try {
    const { organization_id } = req.params;

    if (!organization_id) {
      return res.status(400).json({ message: "Organization ID is required" });
    }

    const discountList = await Discount.getAllDiscounts(organization_id);

    res.status(200).json(discountList);
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * get a discount by ID
 */
exports.getDiscountDetails = async (req, res) => {
  try {
    const { discount_id } = req.params;

    if (!discount_id) {
      return res.status(400).json({ message: "Discount ID is required" });
    }

    const discount = await Discount.findDiscountById(discount_id);

    res.status(200).json(discount);
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * Update a discount
 */
exports.updateDiscount = async (req, res) => {
  try {
    const { discount_id } = req.params;
    const {
      name,
      description,
      discountValue,
      discountType,
      startDate,
      endDate,
    } = req.body;

    if (!discount_id) {
      return res.status(400).json({ message: "Discount ID is required" });
    }

    if (
      !name &&
      !description &&
      !discountValue &&
      !discountType &&
      !startDate &&
      !endDate
    ) {
      return res
        .status(400)
        .json({ message: "At least one field is required" });
    }

    const discount = await Discount.updateDiscount(
      discount_id,
      name,
      description,
      discountValue,
      discountType,
      startDate,
      endDate
    );
    res
      .status(200)
      .json({ message: "Discount updated successfully", discount });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * Delete a discount
 */
exports.deleteDiscount = async (req, res) => {
  try {
    const { discount_id } = req.params;

    if (!discount_id) {
      return res.status(400).json({ message: "Discount ID is required" });
    }

    const rowAffected = await Discount.deleteDiscount(discount_id);

    if (rowAffected === 0) {
      return res.status(404).json({ message: "Discount not found" });
    }

    res.status(200).json({ message: "Discount deleted successfully" });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
