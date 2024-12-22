const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

//Create a new order
router.post('/create', orderController.createOrder);

//Get all orders by organization
router.get('/list/:organization_id', orderController.getOrdersByOrganization);

//Get all orders by organization and date range
router.get('/list_by_date_range/:organization_id', orderController.getOrdersByOrganizationAndDateRange);

//Get order details
router.get('/detail/:order_id', orderController.getOrderDetails);

//Delete an order
router.delete('/delete/:order_id', orderController.deleteOrder);

module.exports = router;