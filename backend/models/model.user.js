import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const User = sequelize.define('User', {
  name: DataTypes.STRING,
  mobile: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  passwordHash: DataTypes.STRING,
  role: {
    type: DataTypes.ENUM('user', 'turfOwner', 'admin'),
    defaultValue: 'user'
  }
}, {
  tableName: 'Users',
  timestamps: false
});

export default User;
