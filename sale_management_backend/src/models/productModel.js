const db = require("../config/db");
const sql = db.sql;

const Product = {
  /**
   * @param {int} organization_id
   * @param {string} name
   * @param {string} description
   * @param {string} price
   * @param {string} stockQuantity
   * @returns {number} ProductID
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
   * @param {int} organization_id
   * @returns {object} Product records
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
   * @param {int} product_id
   * @returns {object} Product record
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
   * @param {int} product_id
   * @param {string} name
   * @param {string} description
   * @param {string} price
   * @param {string} stockQuantity
   * @returns {object} Product record
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
   * @param {int} product_id
   * @returns {number} Number of rows affected
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
};

module.exports = Product;
