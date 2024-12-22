const Order = require("../models/orderModel");
const Discount = require("../models/discountModel");

/**
 * Create a new order.
 */
exports.createOrder = async (req, res) => {
  try {
    const { organizationId, orderDate, items, discounts } = req.body;

    // Input validation
    if (!organizationId || !items || items.length === 0) {
      return res.status(400).json({
        message: "Organization and order items are required",
      });
    }

    if (!items.every((item) => item.ProductID && item.Quantity > 0)) {
      return res.status(400).json({
        message: "Each item must have a valid product ID and positive quantity",
      });
    }

    // Create complete order with transaction
    const orderId = await Order.createCompleteOrder(
      organizationId,
      orderDate || new Date(),
      items,
      discounts
    );

    res.status(201).json({
      message: "Order created successfully",
      orderId,
    });
  } catch (error) {
    console.error("Error creating order:", error);

    if (
      error.message.includes("not found") ||
      error.message.includes("insufficient") ||
      error.message.includes("not valid")
    ) {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * Get all orders by organization.
 */
exports.getOrdersByOrganization = async (req, res) => {
  try {
    const { organization_id } = req.params;

    // Input validation
    if (!organization_id) {
      return res.status(400).json({
        message: "Organization ID is required",
      });
    }

    const orders = await Order.getOrdersByOrganization({ organization_id });

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error getting orders:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * Get all orders by organization and date range.
 */
exports.getOrdersByOrganizationAndDateRange = async (req, res) => {
  try {
    const { organization_id } = req.params;
    const { startDate, endDate } = req.query;

    // Input validation
    if (!organization_id || !startDate || !endDate) {
      return res.status(400).json({
        message: "Organization, start date, and end date are required",
      });
    }

    const orders = await Order.getOrdersByOrganizationAndDateRange({
      organization_id,
      order_date_start: startDate,
      order_date_end: endDate,
    });

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error getting orders:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * Get order by ID.
 */
exports.getOrderDetail = async (req, res) => {
  try {
    const { order_id } = req.params;

    // Input validation
    if (!order_id) {
      return res.status(400).json({
        message: "Order ID is required",
      });
    }

    const order = await Order.getOrderDetail({ order_id });

    res.status(200).json(order);
  } catch (error) {
    console.error("Error getting order:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * Delete order by ID.
 */
exports.deleteOrder = async (req, res) => {
  try {
    const { order_id } = req.params;

    // Input validation
    if (!order_id) {
      return res.status(400).json({
        message: "Order ID is required",
      });
    }

    const rowAffected = await Order.deleteOrder({ order_id });

    if (rowAffected === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
