import express from 'express';
import { registerAdmin, loginAdmin, getAllTurfOwners, getAllTurfs } from '../controllers/adminController.js';

const router = express.Router();

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.get('/turfowners', getAllTurfOwners);  
router.get('/turfs', getAllTurfs);         

export default router;
