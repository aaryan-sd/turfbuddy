import express from 'express';
import { registerTurfOwner, loginTurfOwner, addTurf, getAllTurfsOfOwner } from '../controllers/turfOwnerController.js';
import { verifyTurfOwner } from '../controllers/authController.js';
import verifyJWT from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', registerTurfOwner);
router.post('/login', loginTurfOwner);
router.post("/verify/turfowner", verifyTurfOwner);
router.post('/:turfOwnerId/addturfs', verifyJWT, addTurf);
router.get('/:turfOwnerId/getturfs', verifyJWT, getAllTurfsOfOwner);

export default router;
