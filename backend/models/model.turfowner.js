import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const TurfOwner = sequelize.define('TurfOwner', {
  id: {
  type: DataTypes.INTEGER,
  autoIncrement: true,
  primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
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
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false
  },
  
}, {
  tableName: 'TurfOwners',
  timestamps: true
});

export default TurfOwner;
