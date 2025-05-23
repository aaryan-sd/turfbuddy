import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import TurfOwner from '../models/model.turfowner.js';  // Assuming TurfOwner model is already defined

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
  pricePerHrDaytime: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0,  // Ensuring daytime price is not negative
    },
  },
  pricePerHrNighttime: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0,  // Ensuring nighttime price is not negative
    },
  },
  turfImages: {
    type: DataTypes.JSON,  // Store multiple images as an array
    allowNull: true,        // Can be null if no images are provided
  },

  turfOwnerId: {
  type: DataTypes.INTEGER,
  allowNull: false,
  references: {
    model: 'TurfOwners',
    key: 'id',
  },
  onDelete: 'CASCADE',
}
});

// Association: A Turf belongs to a TurfOwner
Turf.belongsTo(TurfOwner, { foreignKey: 'turfOwnerId', as: 'owner' });
TurfOwner.hasMany(Turf, { foreignKey: 'turfOwnerId', as: 'turfs' });


export default Turf;
