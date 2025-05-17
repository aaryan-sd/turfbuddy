import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Booking from './model.booking.js';

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  bookingId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Bookings',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },

  // Razorpay fields
  razorpayOrderId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  razorpayPaymentId: {
    type: DataTypes.STRING,
    allowNull: true,  // Populated after payment
  },
  razorpaySignature: {
    type: DataTypes.STRING,
    allowNull: true,  // Used to verify payment signature
  },

  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },

  currency: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'INR',
  },

  status: {
    type: DataTypes.ENUM('pending', 'completed', 'failed'),
    defaultValue: 'pending',
  },

  paymentDate: {
    type: DataTypes.DATE,
    allowNull: true,  // Filled when payment is completed
  },
}, {
  tableName: 'Payments',
  timestamps: true,
});

Booking.hasOne(Payment, { foreignKey: 'bookingId', as: 'payment' });
Payment.belongsTo(Booking, { foreignKey: 'bookingId', as: 'booking' });

export default Payment;
