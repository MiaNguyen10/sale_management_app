const express = require("express");
const router = express.Router();
const organizationController = require("../controllers/organizationController");

//Organization list endpoint
router.get("/list", organizationController.getOrganizations);

//Organization by ID endpoint
router.get("/:organization_id", organizationController.getOrganizationByID);

module.exports = router;