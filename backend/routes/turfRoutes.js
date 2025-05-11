import express from 'express';
import { createTurf, getTurfs } from '../controllers/turfController.js';

const router = express.Router();

router.post('/turfs', createTurf);
router.get('/turfs', getTurfs);

export default router;
