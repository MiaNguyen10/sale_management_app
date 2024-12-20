const express = require("express");
const router = express.Router();
const discountController = require('../controllers/discountController');

// Create a discount
router.post("/create", discountController.createDiscount);

// Get all discounts by organization ID
router.get("/:organization_id", discountController.getAllDiscounts);

// Get discount detail by discount ID
router.get("/detail/:discount_id", discountController.getDiscountDetails);

//Update discount by discount ID
router.put("/update/:discount_id", discountController.updateDiscount);

//Delete discount by discount ID
router.delete("/delete/:discount_id", discountController.deleteDiscount);

//Get active discounts by organization ID
router.get("/active/:organization_id", discountController.getActiveDiscounts);

//Get inactive discounts by organization ID
router.get("/inactive/:organization_id", discountController.getInactiveDiscounts);

module.exports = router;