import crypto from 'crypto';
import Booking from '../models/model.booking.js'; // Import Booking model

export const razorpayWebhook = async (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

  const receivedSignature = req.headers['x-razorpay-signature'];
  const body = JSON.stringify(req.body);

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');

  if (expectedSignature !== receivedSignature) {
    console.warn('❌ Invalid signature');
    return res.status(400).json({ message: 'Invalid signature' });
  }

  console.log('✅ Webhook verified:', req.body);

  const event = req.body.event;

  try {
    if (event === 'payment.captured') {
      const paymentEntity = req.body.payload.payment.entity;
      const bookingId = paymentEntity.notes?.bookingId || paymentEntity.receipt?.split('_')[1];

      if (bookingId) {
        await Booking.update(
          { status: 'confirmed' },
          { where: { id: bookingId } }
        );
        return res.status(200).json({ status: 'booking confirmed' });
      }
    }

    if (event === 'payment.failed') {
      const paymentEntity = req.body.payload.payment.entity;
      const bookingId = paymentEntity.notes?.bookingId || paymentEntity.receipt?.split('_')[1];

      if (bookingId) {
        await Booking.update(
          { status: 'failed' },
          { where: { id: bookingId } }
        );
        return res.status(200).json({ status: 'booking marked as failed' });
      }
    }

    return res.status(200).json({ status: 'event received but not processed' });
  } catch (err) {
    console.error('Webhook processing error:', err);
    return res.status(500).json({ message: 'Error processing webhook' });
  }
};
