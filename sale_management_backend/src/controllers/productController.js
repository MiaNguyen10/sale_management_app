const Product = require("../models/productModel");

/**
 * Create a product
 */
exports.createProduct = async (req, res) => {
  try {
    const {
      organization_id,
      name,
      description,
      price,
      stockQuantity,
      category_id,
    } = req.body;

    if (
      !organization_id ||
      !name ||
      !description ||
      !price ||
      !stockQuantity ||
      !category_id
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (price < 0) {
      return res.status(400).json({ message: "Price must be greater than 0" });
    }

    if (stockQuantity < 0) {
      return res
        .status(400)
        .json({ message: "Stock quantity must be greater than 0" });
    }

    const productID = await Product.create(
      organization_id,
      name,
      description,
      price,
      stockQuantity,
      category_id
    );
    res
      .status(201)
      .json({ message: "Product created successfully", productID });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * Get all products by organization ID
 */
exports.getProductByOrganizationId = async (req, res) => {
  try {
    const { organization_id } = req.params;
    if (!organization_id) {
      return res.status(400).json({ message: "Organization ID is required" });
    }

    const products = await Product.getProductByOrganizationId(organization_id);

    res.status(200).json(products);
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * Get all products by organization ID and check if there is a discount for the product
 */
exports.getProductsWithDiscount = async (req, res) => {
  try {
    const { organization_id } = req.params;
    if (!organization_id) {
      return res.status(400).json({ message: "Organization ID is required" });
    }

    const products = await Product.getProductsWithDiscountByOrganization(
      organization_id
    );

    res.status(200).json(products);
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * Get product detail by product ID
 */
exports.getProductDetailByProductId = async (req, res) => {
  try {
    const { product_id } = req.params;
    if (!product_id) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const product = await Product.getProductDetailByProductId(product_id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * Update product detail
 */
exports.updateProductDetail = async (req, res) => {
  try {
    const { product_id } = req.params;
    const { name, description, price, stockQuantity, category_id } = req.body;

    if (
      !product_id ||
      !name ||
      !description ||
      !price ||
      !stockQuantity ||
      !category_id
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (price < 0) {
      return res.status(400).json({ message: "Price must be greater than 0" });
    }

    if (stockQuantity < 0) {
      return res
        .status(400)
        .json({ message: "Stock quantity must be greater than 0" });
    }

    const product = await Product.updateProductDetail(
      product_id,
      name,
      description,
      price,
      stockQuantity,
      category_id
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product update successfully" }, product);
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * Delete product
 */
exports.deleteProduct = async (req, res) => {
  try {
    // Parse and validate product_id
    const product_id = parseInt(req.params.product_id, 10);
    if (isNaN(product_id)) {
      return res
        .status(400)
        .json({ message: "Invalid Product ID. It must be a number." });
    }

    const rowsAffected = await Product.deleteProductByProductID(product_id);
    if (rowsAffected === 0) {
      return res.status(404).json({ message: "Product not found." });
    }
    res.status(200).json({ message: "Product deleted successfully." });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * Decrease stock of product when an order is placed
 */
exports.decreaseStockOfProduct = async (req, res) => {
  try {
    const { product_id, quantity } = req.body;

    if (!product_id || !quantity) {
      return res
        .status(400)
        .json({ message: "Product ID and quantity are required" });
    }

    await Product.decreaseStockOfProduct(product_id, quantity);

    res.status(200).json({ message: "Stock decreased successfully" });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * Get products with low stock levels from given organization
 */
exports.getLowStockProducts = async (req, res) => {
  try {
    const { organization_id } = req.params;
    if (!organization_id) {
      return res.status(400).json({ message: "Organization ID is required" });
    }

    const products = await Product.getProductWithLowStock(organization_id);

    res.status(200).json(products);
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
