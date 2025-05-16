import express from 'express';
import { registerTurfOwner, loginTurfOwner, addTurf, getAllTurfsOfOwner } from '../controllers/turfOwnerController.js';

const router = express.Router();

router.post('/register', registerTurfOwner);
router.post('/login', loginTurfOwner);
router.post('/:turfOwnerId/addturfs', addTurf);
router.get('/:turfOwnerId/getturfs', getAllTurfsOfOwner);

export default router;
