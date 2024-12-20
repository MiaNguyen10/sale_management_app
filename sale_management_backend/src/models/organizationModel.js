//  handles database operations related to the Organizations table

const db = require("../config/db");
const sql = db.sql;

const Organization = {
  /**
   * Create a new organization.
   * @param {string} name
   * @param {string} address
   * @param {string} phoneNumber
   * @param {string} email
   * @param {string} username
   * @param {Buffer} passwordHash
   * @returns {number} OrganizationID
   */
  create: async (name, address, phoneNumber, email, username, passwordHash) => {
    try {
      const pool = await db.poolPromise;
      const result = await pool
        .request()
        .input("Name", sql.NVarChar(100), name)
        .input("Address", sql.NVarChar(255), address)
        .input("PhoneNumber", sql.NVarChar(20), phoneNumber)
        .input("Email", sql.NVarChar(100), email)
        .input("Username", sql.NVarChar(50), username)
        .input("PasswordHash", sql.NVarChar(64), passwordHash).query(`
          INSERT INTO Organizations (Name, Address, PhoneNumber, Email, Username, PasswordHash)
          VALUES (@Name, @Address, @PhoneNumber, @Email, @Username, @PasswordHash)
          SELECT SCOPE_IDENTITY() AS OrganizationID
        `);
      return result.recordset[0].OrganizationID;
    } catch (err) {
      throw err;
    }
  },

  /**
   * Find an organization by username.
   * @param {string} username
   * @returns {object} Organization record
   */
  findByUsername: async (username) => {
    try {
      const pool = await db.poolPromise;
      const result = await pool
        .request()
        .input("Username", sql.NVarChar(50), username).query(`
          SELECT * FROM Organizations WHERE Username = @Username
        `);
      return result.recordset[0];
    } catch (err) {
      throw err;
    }
  },

  /**
   * Find an organization by email.
   * @param {string} email
   * @returns {object} Organization record
   */
  findByEmail: async (email) => {
    try {
      const pool = await db.poolPromise;
      const result = await pool
        .request()
        .input("Email", sql.NVarChar(100), email).query(`
          SELECT * FROM Organizations WHERE Email = @Email
        `);
      return result.recordset[0];
    } catch (err) {
      throw err;
    }
  },

  /**
   * Get all organizations
   */
  getAllOrganization: async () => {
    try {
      const pool = await db.poolPromise;
      const result = await pool
        .request()
        .query(
          `SELECT OrganizationID, Name, Address, PhoneNumber, Email, Username FROM Organizations`
        );
      return result.recordset;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get an organization by ID
   * @param {number} organizationID
   * @returns {object} Organization record
   */
  getOrganizationByID: async (organization_id) => {
    try {
      const pool = await db.poolPromise;
      const result = await pool
        .request()
        .input("OrganizationID", sql.Int, organization_id)
        .query(
          `SELECT OrganizationID, Name, Address, PhoneNumber, Email, Username FROM Organizations WHERE OrganizationID = @OrganizationID`
        );

      return result.recordset[0];
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update an organization
   * @param {number} organizationID
   * @param {string} name
   * @param {string} address
   * @param {string} phoneNumber
   * @param {string} email
   * @param {string} username
   */
  updateOrganization: async (
    organization_id,
    name,
    address,
    phoneNumber,
    email,
    username,
    passwordHash
  ) => {
    try {
      const pool = await db.poolPromise;
      await pool
        .request()
        .input("OrganizationID", sql.Int, organization_id)
        .input("Name", sql.NVarChar(100), name)
        .input("Address", sql.NVarChar(255), address)
        .input("PhoneNumber", sql.NVarChar(20), phoneNumber)
        .input("Email", sql.NVarChar(100), email)
        .input("Username", sql.NVarChar(50), username)
        .input("PasswordHash", sql.NVarChar(64), passwordHash).query(`
        UPDATE Organizations
        SET Name = @Name, Address = @Address, PhoneNumber = @PhoneNumber, Email = @Email, Username = @Username, PasswordHash = @PasswordHash, UpdatedAt = GETDATE()
        WHERE OrganizationID = @OrganizationID
      `);
      const updatedOrganization = await Organization.getOrganizationByID(organization_id);
      return updatedOrganization;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = Organization;
