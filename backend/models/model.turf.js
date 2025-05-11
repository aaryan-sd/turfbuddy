import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';


const Turf = sequelize.define('Turf', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pricePerHour: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

export default Turf;
