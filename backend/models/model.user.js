import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const User = sequelize.define('User', {
  id: {
  type: DataTypes.INTEGER,
  autoIncrement: true,
  primaryKey: true,
  },
  name: DataTypes.STRING,
  mobile: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  passwordHash: { type: DataTypes.STRING, allowNull: false },
}, {
  tableName: 'Users',
  timestamps: true
});

export default User;
