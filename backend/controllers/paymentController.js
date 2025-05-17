import Razorpay from 'razorpay';
import crypto from 'crypto';
import Payment from '../models/model.payment.js';
import Booking from '../models/model.booking.js';


// PHASE 2a: Create Razorpay order (Frontend will call this before checkout)
// controllers/paymentController.js

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createOrder = async (req, res) => {
  try {
    const { bookingId, amount } = req.body;

    if (!bookingId || !amount) {
      return res.status(400).json({ message: 'bookingId and amount are required.' });
    }

    // Create order in Razorpay
    const options = {
      amount: amount * 100, // Razorpay works in paise
      currency: 'INR',
      receipt: `receipt_order_${bookingId}`,
    };

    const order = await razorpay.orders.create(options);

    // Save in DB
    const payment = await Payment.create({
      bookingId,
      razorpayOrderId: order.id,
      amount,
      currency: 'INR',
      status: 'pending',
    });

    res.status(201).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      bookingId,
      paymentId: payment.id,
    });
  } catch (err) {
    console.error('Error in createOrder:', err);
    res.status(500).json({ message: 'Failed to create Razorpay order.' });
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
