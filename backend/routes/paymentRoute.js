import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';

const router = express.Router();

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay order
router.post('/orders', async (req, res) => {
  console.log('Received payment request:', req.body);
  const { amount } = req.body;
  if (!amount || isNaN(amount)) {
    return res.status(400).json({ success: false, message: "Amount required" });
  }
  const options = {
    amount: Math.round(amount * 100), // rupees to paise
    currency: "INR",
    payment_capture: 1,
  };
  try {
    const order = await razorpayInstance.orders.create(options);
    res.status(200).json({
      success: true,
      order,
      key_id: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment order',
      error: error.message
    });
  }
});

router.post('/verify', (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ status: 'failure', message: 'Missing payment fields' });
  }
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(razorpay_order_id + '|' + razorpay_payment_id)
    .digest('hex');
  if (razorpay_signature === expectedSignature) {
    res.json({
      status: 'success',
      message: 'Payment verified successfully',
      payment_id: razorpay_payment_id,
      order_id: razorpay_order_id
    });
  } else {
    console.error('Payment verification failed for order:', razorpay_order_id);
    res.status(400).json({ status: 'failure', message: 'Payment verification failed' });
  }
});

export default router;
