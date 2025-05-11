import express from 'express';
import sequelize from './config/db.js'; // Make sure to include `.js`

const app = express();
const PORT = 5000;

sequelize.authenticate()
  .then(() => {
    console.log('✅ MySQL connected');
  })
  .catch(err => {
    console.error('❌ Unable to connect to DB:', err);
  });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
