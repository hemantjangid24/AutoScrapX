import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    items: [{
        id: String,         // asset (id) or admin (_id)
        name: String,
        price: Number,
        quantity: Number,
        source: String      // 'asset' or 'admin'
    }],
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { type: String, default: "Product Shipping" },
    date: { type: Date, default: Date.now },
    payment: { type: Boolean, default: false },
    payment_id: { type: String },      // Razorpay or future gateways
    promoApplied: { type: String }
});

const orderModel = mongoose.models.Order || mongoose.model("Order", orderSchema);
export default orderModel;
