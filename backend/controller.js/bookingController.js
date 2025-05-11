import Booking from '../models/booking.js';

export const createBooking = async (req, res) => {
  try {
    const { userId, turfId, bookingDate, durationHours } = req.body;
    const booking = await Booking.create({ userId, turfId, bookingDate, durationHours });
    res.status(201).json(booking);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll();
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
