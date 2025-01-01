const express = require("express");
const router = express.Router();
const organizationController = require("../controllers/organizationController");

//Organization list endpoint
router.get("/list", organizationController.getOrganizations);

//Organization by ID endpoint
router.get("/:organization_id", organizationController.getOrganizationByID);

//Update organization endpoint
router.put("/:organization_id", organizationController.updateOrganization);

module.exports = router;