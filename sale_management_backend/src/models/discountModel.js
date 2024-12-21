const db = require("../config/db");
const sql = db.sql;

const Discount = {
  /**
   * Create a new discount.
   */
  createDiscount: async (
    organization_id,
    name,
    description,
    discountType,
    discountValue,
    scope,
    startDate,
    endDate
  ) => {
    try {
      const pool = await db.poolPromise;
      const result = await pool
        .request()
        .input("OrganizationID", sql.Int, organization_id)
        .input("Name", sql.NVarChar(100), name)
        .input("Description", sql.NVarChar(500), description)
        .input("DiscountType", sql.Int, discountType)
        .input("DiscountValue", sql.Float, discountValue)
        .input("Scope", sql.Int, scope)
        .input("StartDate", sql.DateTime, startDate)
        .input("EndDate", sql.DateTime, endDate).query(`
          INSERT INTO Discounts (OrganizationID, Name, Description, DiscountType, DiscountValue, StartDate, EndDate)
          VALUES (@OrganizationID, @Name, @Description, @DiscountType, @DiscountValue, @StartDate, @EndDate)
          SELECT SCOPE_IDENTITY() AS DiscountID
        `);
      return result.recordset[0].DiscountID;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get all discounts by organization ID.
   */
  getAllDiscounts: async (organization_id) => {
    try {
      const pool = await db.poolPromise;
      const result = await pool
        .request()
        .input("OrganizationID", sql.Int, organization_id)
        .query(
          `SELECT * FROM Discounts WHERE OrganizationID = @OrganizationID`
        );
      return result.recordset;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Find a discount by ID.
   */
  findDiscountById: async (discount_id) => {
    try {
      const pool = await db.poolPromise;
      const result = await pool
        .request()
        .input("DiscountID", sql.Int, discount_id).query(`
              SELECT * FROM Discounts WHERE DiscountID = @DiscountID
              `);
      return result.recordset[0];
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update a discount.
   */
  updateDiscount: async (
    discount_id,
    name,
    description,
    discountValue,
    discountType,
    scope,
    startDate,
    endDate
  ) => {
    try {
      const pool = await db.poolPromise;
      await pool
        .request()
        .input("DiscountID", sql.Int, discount_id)
        .input("Name", sql.NVarChar(100), name)
        .input("Description", sql.NVarChar(500), description)
        .input("DiscountValue", sql.Float, discountValue)
        .input("DiscountType", sql.Int, discountType)
        .input("Scope", sql.Int, scope)
        .input("StartDate", sql.DateTime, startDate)
        .input("EndDate", sql.DateTime, endDate).query(`
          UPDATE Discounts
          SET Name = @Name, Description = @Description, DiscountValue = @DiscountValue, DiscountType = @DiscountType, StartDate = @StartDate, EndDate = @EndDate, UpdatedAt = GETDATE()
          WHERE DiscountID = @DiscountID
        `);
      const updatedDiscount = await Discount.findDiscountById(discount_id);
      return updatedDiscount;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Delete a discount.
   */
  deleteDiscount: async (discount_id) => {
    if (!discount_id) {
      throw new Error("Discount ID is required.");
    }
    try {
      const pool = await db.poolPromise;
      const result = await pool
        .request()
        .input("DiscountID", sql.Int, discount_id).query(`
            DELETE FROM Discounts WHERE DiscountID = @DiscountID
          `);

      return result.rowsAffected[0];
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get all discounts that are active.
   */
  getActiveDiscounts: async (organization_id) => {
    try {
      const pool = await db.poolPromise;
      const result = await pool
        .request()
        .input("OrganizationID", sql.Int, organization_id)
        .query(
          `SELECT * FROM Discounts WHERE OrganizationID = @OrganizationID AND StartDate <= GETDATE() AND EndDate >= GETDATE()`
        );
      return result.recordset;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get all discounts that are inactive.
   */
  getInactiveDiscounts: async (organization_id) => {
    try {
      const pool = await db.poolPromise;
      const result = await pool
        .request()
        .input("OrganizationID", sql.Int, organization_id)
        .query(
          `SELECT * FROM Discounts WHERE OrganizationID = @OrganizationID AND (StartDate > GETDATE() OR EndDate < GETDATE())`
        );
      return result.recordset;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Validate a discount's applicability
   */
  validateDiscount: async (discount_id, organization_id) => {
    try {
      const pool = await db.poolPromise;
      const result = await pool
        .request()
        .input("DiscountID", sql.Int, discount_id)
        .input("OrganizationID", sql.Int, organization_id).query(`
          SELECT * FROM Discounts WHERE DiscountID = @DiscountID AND OrganizationID = @OrganizationID AND StartDate <= GETDATE() AND EndDate >= GETDATE()
        `);
      return result.recordset[0];
    } catch (error) {
      throw error;
    }
  },

  /**
   * Apply a discount to products.
   */
  assignDiscountToProducts: async (discount_id, product_ids) => {
    try {
      const pool = await db.poolPromise;

      // Create a table object for bulk insertion
      const table = new sql.Table("DiscountProducts"); // Specify the target table name
      table.create = false; // Set to false since the table already exists
      table.columns.add("DiscountID", sql.Int, { nullable: false });
      table.columns.add("ProductID", sql.Int, { nullable: false });

      // Add rows to the table object
      product_ids.forEach((product_id) => {
        table.rows.add(discount_id, product_id);
      });

      // Perform the bulk insert
      const request = pool.request();
      await request.bulk(table);
      
    } catch (error) {
      console.error("Error assigning discounts to products:", error);
      throw error;
    }
  },

  /**
   * Remove a discount from products.
   */
  removeDiscountFromProducts: async (discount_id, product_ids) => {
    try {
      const pool = await db.poolPromise;
      const ids = product_ids.join(", ");
      const result = await pool
        .request()
        .input("DiscountID", sql.Int, discount_id)
        .input("ProductID", sql.Int, product_id).query(`
      DELETE FROM DiscountProducts
      WHERE DiscountID = @DiscountID AND ProductID IN (${ids});
    `);
      return result.rowsAffected;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Remove all discounts from a product.
   */
  removeAllProductsFromDiscount: async (discount_id) => {
    try {
      const pool = await db.poolPromise;
      const result = await pool
        .request()
        .input("DiscountID", sql.Int, discount_id).query(`
        DELETE FROM DiscountProducts
        WHERE DiscountID = @DiscountID;
      `);
      console.log(`Rows affected: ${result.rowsAffected}`);
      return result.rowsAffected;
    } catch (error) {
      console.error("Error removing all products from discount:", error);
      throw error;
    }
  },
};

module.exports = Discount;
