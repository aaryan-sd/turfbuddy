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
  const { amount, bookingId, currency = 'INR' } = req.body;

  if (!amount || !bookingId) {
    return res.status(400).json({ message: 'Amount and bookingId are required.' });
  }

  try {
    // Create order on Razorpay
    const options = {
      amount: Math.round(amount * 100), // Convert to paise
      currency,
      receipt: `receipt_booking_${bookingId}`,
    };

    const order = await razorpayInstance.orders.create(options);

    // Create payment entry in DB (status: pending)
    await Payment.create({
      bookingId,
      amount,
      status: 'pending',
    });

    return res.status(200).json({
      orderId: order.id,
      currency: order.currency,
      amount: order.amount,
    });

  } catch (error) {
    console.error('Error in createOrder:', error);
    return res.status(500).json({ message: 'Failed to create Razorpay order.' });
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
