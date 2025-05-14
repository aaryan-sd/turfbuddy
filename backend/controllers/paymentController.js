import Payment from '../models/model.payment.js';

// export const createPayment = async (req, res) => {
//   try {
//     const { bookingId, amount, paymentDate, status } = req.body;
//     const payment = await Payment.create({ bookingId, amount, paymentDate, status });
//     res.status(201).json(payment);
//   } catch (error) {
//     console.error('Error creating payment:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };

// export const getPayments = async (req, res) => {
//   try {
//     const payments = await Payment.findAll();
//     res.status(200).json(payments);
//   } catch (error) {
//     console.error('Error fetching payments:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };
