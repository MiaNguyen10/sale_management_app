const Organization = require("../models/organizationModel");
const bcrypt = require("bcrypt"); // for hashing passwords
const { saltRounds } = require("../utils/Constant");

/**
 * Get all organizations
 */
exports.getOrganizations = async (req, res) => {
  try {
    const organizations = await Organization.getAllOrganization();
    res.status(200).json(organizations);
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * Get an organization by ID
 */
exports.getOrganizationByID = async (req, res) => {
  try {
    const { organization_id } = req.params;
    if (!organization_id) {
      return res.status(400).json({ message: "Organization ID is required" });
    }

    const organization = await Organization.getOrganizationByID(
      organization_id
    );
    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    res.status(200).json(organization);
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.updateOrganization = async (req, res) => {
  const organization_id = parseInt(req.params.organization_id, saltRounds);

  if (isNaN(organization_id)) {
    return res.status(400).json({ message: "Invalid Organization ID" });
  }

  const {
    name,
    address,
    phoneNumber,
    email,
    username,
    oldPassword,
    newPassword,
  } = req.body;

  if (!organization_id) {
    return res.status(400).json({ message: "Organization ID is required" });
  }

  if (!name || !address || !phoneNumber || !email || !username || !oldPassword) {
    return res
      .status(400)
      .json({ message: "All fields are required to update an organization" });
  }

  try {
    //find organization by username
    const organization = await Organization.getOrganizationByID(
      organization_id
    );
    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    // If username is changed, check uniqueness
    if (username !== organization.Username) {
      const existingUsername = await Organization.findByUsername(username);
      if (
        existingUsername &&
        existingUsername.OrganizationID !== organization_id
      ) {
        return res.status(400).json({ message: "Username already exists" });
      }
    }

    //check if email already exists
    if (email !== organization.Email) {
      const existingEmail = await Organization.findByEmail(email);
      if (
        existingEmail &&
        existingEmail.OrganizationID !== organization_id
      ) {
        return res.status(400).json({ message: "Email already exists" });
      }
    }

    let updatedPasswordHash = organization.PasswordHash;
    if (newPassword) {
      if (!oldPassword) {
        await transaction.rollback();
        return res
          .status(400)
          .json({ message: "Old password is required to set a new password" });
      }

      // Verify old password
      const isMatch = await bcrypt.compare(
        oldPassword,
        organization.PasswordHash
      );
      if (!isMatch) {
        await transaction.rollback();
        return res.status(400).json({ message: "Invalid old password" });
      }

      // Hash the new password
      updatedPasswordHash = await bcrypt.hash(newPassword, 10); // Adjust salt rounds as needed
    }

    const updateOrg = await Organization.updateOrganization(
      organization_id,
      name,
      address,
      phoneNumber,
      email,
      username,
      updatedPasswordHash
    );

    res.status(200).json({
      message: "Organization updated successfully",
      data: updateOrg,
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
