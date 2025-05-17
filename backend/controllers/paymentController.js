import Razorpay from 'razorpay';
import crypto from 'crypto';
import Payment from '../models/model.payment.js';
import Booking from '../models/model.booking.js';

// Init Razorpay instance
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

// PHASE 2a: Create Razorpay order (Frontend will call this before checkout)
export const createOrder = async (req, res) => {
  const { bookingId } = req.body;

  if (!bookingId) {
    return res.status(400).json({ message: 'Booking ID is required' });
  }

  try {
    const booking = await Booking.findByPk(bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    const amount = booking.totalCost * 100; // in paisa
    const currency = 'INR';

    const options = {
      amount,
      currency,
      receipt: `receipt_${bookingId}`,
      notes: { bookingId },
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // ✅ Make sure to include razorpayOrder.id here
    const payment = await Payment.create({
      bookingId,
      amount: amount / 100, // Store in INR
      currency,
      razorpayOrderId: razorpayOrder.id, // ✅ required field
      status: 'created',
    });

    return res.status(201).json({
      message: 'Order created',
      orderId: razorpayOrder.id,
      currency,
      amount: amount / 100,
    });

  } catch (err) {
    console.error('Error in createOrder:', err);
    return res.status(500).json({ message: 'Failed to create Razorpay order' });
  }
};

// PHASE 2b: Verify Razorpay signature and update DB
export const confirmPayment = async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    bookingId,
  } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !bookingId) {
    return res.status(400).json({ message: 'Incomplete payment information.' });
  }

  try {
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      // Signature mismatch – possible fraud
      await Payment.update(
        { status: 'failed' },
        { where: { bookingId } }
      );
      return res.status(400).json({ message: 'Payment verification failed. Invalid signature.' });
    }

    // Signature valid – mark payment completed
    await Payment.update(
      {
        status: 'completed',
        paymentDate: new Date(),
      },
      {
        where: { bookingId },
      }
    );

    // Update booking status to "confirmed"
    await Booking.update(
      { status: 'confirmed' },
      { where: { id: bookingId } }
    );

    return res.status(200).json({ message: 'Payment verified and booking confirmed.' });

  } catch (error) {
    console.error('Error in confirmPayment:', error);
    return res.status(500).json({ message: 'Error verifying payment.' });
  }
};
