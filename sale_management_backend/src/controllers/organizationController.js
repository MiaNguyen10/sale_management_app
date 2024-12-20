const Organization = require("../models/organizationModel");

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
