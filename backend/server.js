import express from 'express';
import sequelize from './config/db.js'; 
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js'; 
import turfOwnerRoutes from './routes/turfOwnerRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';  
import paymentRoutes from './routes/paymentRoutes.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON requests
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/turfowners', turfOwnerRoutes);
app.use('/api/admins', adminRoutes);

// app.use('/api/bookings', bookingRoutes);
// app.use('/api/payments', paymentRoutes);

app.use('/api/auth', authRoutes);

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
