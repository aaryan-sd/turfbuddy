const express = require('express');
const sequelize = require('./config/db');

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
