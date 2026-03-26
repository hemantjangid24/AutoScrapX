import orderModel from './../models/orderModel.js';
import userModel from './../models/userModel.js';

// [1] Place a new order from the frontend (now supports payment_id)
const placeOrder = async (req, res) => {
  try {
    // Debug log
    console.log("ORDER CREATE body:", req.body);

    const { userId, items, amount, address, payment_id, promoApplied } = req.body;

    // Validation: Make sure basic fields are present
    if (!userId) {
      console.log("Missing userId");
      return res.status(400).json({ success: false, message: "Missing userId" });
    }
    if (!Array.isArray(items) || items.length === 0) {
      console.log("Missing or empty items array");
      return res.status(400).json({ success: false, message: "Missing or empty items" });
    }
    if (typeof amount !== 'number') {
      console.log("Missing or invalid amount");
      return res.status(400).json({ success: false, message: "Missing or invalid amount" });
    }
    if (!address || typeof address !== 'object') {
      console.log("Missing or invalid address");
      return res.status(400).json({ success: false, message: "Missing or invalid address" });
    }

    // Create and save the order
    const newOrder = new orderModel({
      userId,
      items,
      amount,
      address,
      payment_id,
      promoApplied,
      payment: !!payment_id,
      status: payment_id ? "placed" : "pending"
    });

    console.log("About to save order:", newOrder);
    await newOrder.save();
    console.log("Order saved successfully");

    res.json({
      success: true,
      order: newOrder,
      message: "Order placed successfully"
    });
  } catch (error) {
    console.log("ORDER PLACEMENT ERROR:", error);
    console.log("Error details:", error.message);
    if (error.errors) {
      console.log("Validation errors:", error.errors);
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// [2] Mark order as paid after payment verified
const verifyOrder = async (req, res) => {
  const { orderId } = req.body;
  try {
    const updated = await orderModel.findByIdAndUpdate(orderId, { payment: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    res.json({ success: true, message: "Order Payment Verified & Paid" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// [3] Fetch user orders
// In orderController.js - userOrders function
const userOrders = async (req, res) => {
  try {
    console.log("MyOrders request received, body:", req.body);
    const orders = await orderModel.find({ userId: req.body.userId }).sort({ date: -1 });
    console.log("MyOrders DB orders found:", orders.length);
    return res.json({ success: true, data: orders });
  } catch (error) {
   return res.status(500).json({ success: false, message: error.message });
  }
};

// [4] List all orders for admin
const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({}).sort({ date: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// [5] Update status (admin or delivery action)
const updateStatus = async (req, res) => {
  try {
    const updated = await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
    if (!updated) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };
