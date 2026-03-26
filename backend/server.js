import 'dotenv/config'; // Load environment variables from .env file
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import itemRouter from './routes/itemRoute.js';
import userRouter from './routes/userRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
import paymentRoute from './routes/paymentRoute.js';
import { placeOrder } from './controllers/orderController.js';
import { userOrders } from './controllers/orderController.js';

// App configuration
const app = express();
// Use process.env.PORT for deployment, fallback to 4000 for local dev
const port = process.env.PORT || 4000;

// Middleware
app.use(express.json());

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173', // Local React (Vite)
  'http://localhost:5174', // Local Admin (if different port)
  'https://autoscrapx.vercel.app', // Your future Vercel Frontend
  'https://autoscrapx-admin.vercel.app'     // Your future Vercel Admin
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

// Database connection
connectDB();

// API endpoints
app.use("/api/item", itemRouter);
app.use("/images", express.static('uploads'));
app.use('/api/user', userRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);
app.use('/api/payment', paymentRoute);
app.use('/uploads', express.static('uploads'));
app.post('/api/orders/create', placeOrder);
app.post('/api/orders/user', userOrders);

// Root endpoint
app.get("/", (req, res) => {
  res.send("API working");
});

// Start server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});