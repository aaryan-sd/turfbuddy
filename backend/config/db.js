import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('turf_booking_system', 'root', 'Piyush@0804', {
  host: 'localhost',
  dialect: 'mysql'
});

export default sequelize;
