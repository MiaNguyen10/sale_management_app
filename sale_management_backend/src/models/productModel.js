const db = require("../config/db");
const sql = db.sql;

const Product = {
  /**
   * Create a new product.
   */
  create: async (organization_id, name, description, price, stockQuantity) => {
    try {
      const pool = await db.poolPromise;
      const result = await pool
        .request()
        .input("OrganizationID", sql.Int, organization_id)
        .input("Name", sql.NVarChar(100), name)
        .input("Description", sql.NVarChar(500), description)
        .input("Price", sql.Decimal(18, 2), price)
        .input("StockQuantity", sql.Int, stockQuantity)
        .query(
          `INSERT INTO Products (OrganizationID, Name, Description, Price, StockQuantity)
            VALUES (@OrganizationID, @Name, @Description, @Price, @StockQuantity)
            SELECT SCOPE_IDENTITY() AS ProductID`
        );
      return (await result).recordset[0].ProductID;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get all products by organization ID.
   */
  getProductByOrganizationId: async (organization_id) => {
    try {
      const pool = await db.poolPromise;
      const result = await pool
        .request()
        .input("OrganizationID", sql.Int, organization_id).query(`
            SELECT * FROM Products WHERE OrganizationID = @OrganizationID
            `);

      return (await result).recordset;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get all products by organization ID and check if there is a discount for the product.
   */
  /** DiscountType = 1: Percentage , DiscountType = 2: Fixed amount */
  getProductsWithDiscountByOrganization: async (organization_id) => {
    try {
      const pool = await db.poolPromise;
      const query = `
          SELECT 
              p.ProductID,
              p.OrganizationID,
              p.Name AS ProductName,
              p.Description AS ProductDescription,
              p.Price AS OriginalPrice,
              p.StockQuantity,
              dp.DiscountID,
              d.Name AS DiscountName,
              d.Description AS DiscountDescription,
              d.DiscountValue,
              d.DiscountType,
              CASE 
                  WHEN d.DiscountType = 1 THEN p.Price - (p.Price * d.DiscountValue / 100)
                  WHEN d.DiscountType = 2 THEN p.Price - d.DiscountValue
                  ELSE p.Price
              END AS DiscountedPrice
          FROM 
              Products p
          LEFT JOIN 
              DiscountProducts dp ON p.ProductID = dp.ProductID
          LEFT JOIN 
              Discounts d ON dp.DiscountID = d.DiscountID
          WHERE 
              p.OrganizationID = @OrganizationID
          ORDER BY 
              p.ProductID;
        `;

      const result = await pool
        .request()
        .input("OrganizationID", sql.Int, organization_id)
        .query(query);

      return result.recordset;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get product details by product ID.
   */
  getProductDetailByProductId: async (product_id) => {
    try {
      const pool = await db.poolPromise;
      const result = await pool
        .request()
        .input("ProductID", sql.Int, product_id).query(`
            SELECT * FROM Products WHERE ProductID = @ProductID
            `);
      return result.recordset[0];
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update product details.
   */
  updateProductDetail: async (
    product_id,
    name,
    description,
    price,
    stockQuantity
  ) => {
    try {
      const pool = await db.poolPromise;
      result = await pool
        .request()
        .input("ProductID", sql.Int, product_id)
        .input("Name", sql.NVarChar(100), name)
        .input("Description", sql.NVarChar(500), description)
        .input("Price", sql.Decimal(18, 2), price)
        .input("StockQuantity", sql.Int, stockQuantity).query(`
            UPDATE Products
            SET Name = @Name, Description = @Description, Price = @Price, StockQuantity = @StockQuantity, UpdatedAt = GETDATE()
            WHERE ProductID = @ProductID
            `);
      const updatedProduct = await Product.getProductDetailByProductId(
        product_id
      );
      return updatedProduct;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Delete a product by product ID.
   */
  deleteProductByProductID: async (product_id) => {
    if (!Number.isInteger(product_id)) {
      throw new Error("Invalid product ID. It must be an integer.");
    }

    try {
      const pool = await db.poolPromise;
      const result = await pool
        .request()
        .input("ProductID", sql.Int, product_id)
        .query(`DELETE FROM Products WHERE ProductID = @ProductID`);

      return result.rowsAffected[0];
    } catch (error) {
      console.error(
        `Error deleting product with ProductID ${product_id}:`,
        error
      );
      throw new Error(error.message || "Database error occurred.");
    }
  },

  /**
   * Decrease stock when an order is placed
   */
  decreaseStockOfProduct: async (product_id, quantity) => {
    try {
      const pool = await db.poolPromise;
      await pool
        .request()
        .input("ProductID", sql.Int, product_id)
        .input("Quantity", sql.Int, quantity).query(`
            UPDATE Products
            SET StockQuantity = StockQuantity - @Quantity
            WHERE ProductID = @ProductID
            `);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Retrieve products with low stock levels of a given organization.
   */
  getProductWithLowStock: async (organization_id) => {
    try {
      const pool = await db.poolPromise;
      const result = await pool
        .request()
        .input("OrganizationID", sql.Int, organization_id)
        .query(
          `SELECT * FROM Products WHERE OrganizationID = @OrganizationID AND StockQuantity < 10`
        );
      return result.recordset;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = Product;
