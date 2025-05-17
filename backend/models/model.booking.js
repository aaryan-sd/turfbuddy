import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './model.user.js';
import Turf from './model.turf.js';

const Booking = sequelize.define('Booking', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  bookingDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  startHour: {
  type: DataTypes.INTEGER,
  allowNull: false,
  },
  endHour: {
  type: DataTypes.INTEGER,
  allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'cancelled'),
    defaultValue: 'pending',
    allowNull: false,
  }
}, {
  tableName: 'Bookings',
  timestamps: true,
});

// Associations
User.hasMany(Booking, { foreignKey: 'userId' });
Booking.belongsTo(User, { foreignKey: 'userId' });

Turf.hasMany(Booking, { foreignKey: 'turfId' });
Booking.belongsTo(Turf, { foreignKey: 'turfId' });

export default Booking;
