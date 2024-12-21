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
      scope,
      startDate,
      endDate,
      product_ids, // Added this field to specify products when scope = 1
    } = req.body;

    // Validate required fields
    if (
      !organization_id ||
      !name ||
      !discountType ||
      !discountValue ||
      !scope || 
      !startDate ||
      !endDate
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Create the discount and get the discount ID
    const discountID = await Discount.createDiscount(
      organization_id,
      name,
      description,
      discountType,
      discountValue,
      scope,
      startDate,
      endDate
    );

    // Handle the scope: 1 = Specific Product, 2 = Whole Order
    if (scope === 1) {
      // Validate product_ids for Specific Product scope
      if (
        !product_ids ||
        !Array.isArray(product_ids) ||
        product_ids.length === 0
      ) {
        return res
          .status(400)
          .json({
            message: "Products are required for Specific Product scope",
          });
      }

      // Assign the discount to the specified products
      await Discount.assignDiscountToProducts(discountID, product_ids);

      res.status(201).json({
        message: "Discount created and assigned to products successfully",
        discountID,
      });
    } else if (scope === 2) {
      // Whole Order scope, no further action needed
      res
        .status(201)
        .json({
          message: "Discount created successfully for whole order",
          discountID,
        });
    } else {
      // Invalid scope
      return res.status(400).json({ message: "Invalid scope" });
    }
  } catch (error) {
    console.error("Error:", error);
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
      scope,
      product_ids, // Include product IDs for specific product scope
    } = req.body;

    // Validate the discount ID
    if (!discount_id) {
      return res.status(400).json({ message: "Discount ID is required" });
    }

    // Ensure at least one field is provided for the update
    if (
      !name &&
      !description &&
      !discountValue &&
      !discountType &&
      !startDate &&
      !endDate &&
      !scope
    ) {
      return res
        .status(400)
        .json({ message: "At least one field is required" });
    }

    // Update the discount details
    await Discount.updateDiscount(
      discount_id,
      name,
      description,
      discountValue,
      discountType,
      scope,
      startDate,
      endDate
    );

    // Handle scope updates
    if (scope === 1) {
      // Specific Product scope
      if (
        !product_ids ||
        !Array.isArray(product_ids) ||
        product_ids.length === 0
      ) {
        return res
          .status(400)
          .json({
            message: "Product IDs are required for Specific Product scope",
          });
      }

      // Remove existing product associations
      await Discount.removeAllProductsFromDiscount(discount_id);

      // Assign new products to the discount
      await Discount.assignDiscountToProducts(discount_id, product_ids);

      res
        .status(200)
        .json({
          message: "Discount updated successfully and assigned to products",
        });
    } else if (scope === 2) {
      // Whole Order scope
      // Remove all associated products, as it's no longer specific to products
      await Discount.removeAllProductsFromDiscount(discount_id);

      res
        .status(200)
        .json({ message: "Discount updated successfully for whole order" });
    } else {
      // Invalid scope
      return res.status(400).json({ message: "Invalid scope" });
    }
  } catch (error) {
    console.error("Error:", error);
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

/**
 * Get all discounts that are active.
 */
exports.getActiveDiscounts = async (req, res) => {
  try {
    const { organization_id } = req.params;

    if (!organization_id) {
      return res.status(400).json({ message: "Organization ID is required" });
    }

    const activeDiscounts = await Discount.getActiveDiscounts(organization_id);

    res.status(200).json(activeDiscounts);
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * Get all discounts that are inactive.
 */
exports.getInactiveDiscounts = async (req, res) => {
  try {
    const { organization_id } = req.params;

    if (!organization_id) {
      return res.status(400).json({ message: "Organization ID is required" });
    }

    const inactiveDiscounts = await Discount.getInactiveDiscounts(
      organization_id
    );

    res.status(200).json(inactiveDiscounts);
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
