import Booking from '../models/model.booking.js';
import Turf from '../models/model.turf.js';
import { Op } from 'sequelize';

// Helper: Check if given hour is considered daytime
const isDaytime = (hour) => hour >= 6 && hour < 18;

export const bookTurf = async (req, res) => {
  const { userId, turfId, bookingDate, startHour, endHour } = req.body;

  // Phase 0: Basic Input Validation
  if (!userId || !turfId || !bookingDate || startHour == null || endHour == null) {
    return res.status(400).json({ message: 'All fields (userId, turfId, bookingDate, startHour, endHour) are required.' });
  }

  if (startHour >= endHour || startHour < 0 || endHour > 24) {
    return res.status(400).json({ message: 'Invalid time range selected. Must be between 0–24 and startHour < endHour.' });
  }

  try {
    // Phase 1: Fetch Turf
    const turf = await Turf.findByPk(turfId);
    if (!turf) return res.status(404).json({ message: 'Turf not found.' });

    // Phase 2: Check Slot Availability
    const conflictingBookings = await Booking.findAll({
      where: {
        turfId,
        bookingDate,
        status: { [Op.ne]: 'cancelled' },
        [Op.or]: Array.from({ length: endHour - startHour }, (_, i) => {
          const hour = startHour + i;
          return {
            startHour: { [Op.lt]: hour + 1 },
            endHour: { [Op.gt]: hour },
          };
        }),
      },
    });

    if (conflictingBookings.length > 0) {
      return res.status(409).json({ message: 'Selected time slots are already booked.' });
    }

    // Phase 3: Calculate Total Cost and Duration
    const durationHours = endHour - startHour;
    let totalCost = 0;
    for (let hour = startHour; hour < endHour; hour++) {
      totalCost += isDaytime(hour) ? Number(turf.pricePerHrDaytime) : Number(turf.pricePerHrNighttime);
    }

    // Phase 4: Create Booking (status = 'pending')
    const newBooking = await Booking.create({
      userId,
      turfId,
      bookingDate,
      startHour,
      endHour,
      status: 'pending'
    });

    // Phase 5: Return cost + booking ID to frontend
    return res.status(201).json({
      message: 'Booking initialized. Proceed to payment to confirm.',
      bookingId: newBooking.id,
      booking: {
        ...newBooking.toJSON(),
        durationHours, // Attach derived duration to response
        totalCost
      }
    });

  } catch (err) {
    console.error('Booking error:', err);
    return res.status(500).json({ message: 'Internal server error while booking turf.' });
  }
};
