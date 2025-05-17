// routes/paymentRoutes.js

import express from 'express';
import { confirmPayment } from '../controllers/paymentController.js';

const router = express.Router();

// 1. Create Razorpay Order (Phase 2a - called before Razorpay checkout starts)
router.post('/create-order', createOrder);

// Phase 2: Confirm payment and booking
router.post('/confirmpayment', confirmPayment);

export default router;
