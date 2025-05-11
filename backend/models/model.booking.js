import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './user.js';
import Turf from './turf.js';

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
  durationHours: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

// Associations
User.hasMany(Booking, { foreignKey: 'userId' });
Booking.belongsTo(User, { foreignKey: 'userId' });

Turf.hasMany(Booking, { foreignKey: 'turfId' });
Booking.belongsTo(Turf, { foreignKey: 'turfId' });

export default Booking;
