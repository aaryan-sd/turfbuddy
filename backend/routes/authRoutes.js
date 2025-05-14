import express from 'express';
import { verifyFirebaseTokenForUser, verifyFirebaseTokenForTurfOwner } from '../controllers/authController.js';

const router = express.Router();

// Route to verify Firebase token for User
router.post('/verify/user', verifyFirebaseTokenForUser);

// Route to verify Firebase token for TurfOwner
router.post('/verify/turfowner', verifyFirebaseTokenForTurfOwner);

export default router;
