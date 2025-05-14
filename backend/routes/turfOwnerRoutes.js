import express from 'express';
import { registerTurfOwner, loginTurfOwner, addTurf, getAllTurfsByTurfOwner } from '../controllers/turfOwnerController.js';

const router = express.Router();

router.post('/register', registerTurfOwner);
router.post('/login', loginTurfOwner);
router.post('/:turfOwnerId/turfs', addTurf);
router.get('/:turfOwnerId/turfs', getAllTurfsByTurfOwner);

export default router;
