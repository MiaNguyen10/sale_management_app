const db = require("../config/db");
const sql = db.sql;

const Discount = {
  /**
   * Create a new discount.
   * @param {number} organization_id
   * @param {string} name
   * @param {string} description
   * @param {number} discountValue
   * @param {string} discountType
   * @param {string} startDate
   * @param {string} endDate
   * @returns {number} DiscountID
   */
  createDiscount: async (
    organization_id,
    name,
    description,
    discountType,
    discountValue,
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
        .input("DiscountType", sql.NVarChar(50), discountType)
        .input("DiscountValue", sql.Float, discountValue)
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
   * Update a discount.
   */
  updateDiscount: async (
    discount_id,
    name,
    description,
    discountValue,
    discountType,
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
        .input("DiscountType", sql.NVarChar(50), discountType)
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
};

module.exports = Discount;
