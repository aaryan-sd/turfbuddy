// routes/bookingRoutes.js

import express from 'express';
import { bookTurf } from '../controllers/bookingController.js';

const router = express.Router();

// Phase 1: Initiate booking, return cost
router.post('/bookturf', bookTurf);

export default router;
