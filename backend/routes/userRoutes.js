import express from 'express';
import { registerUser, loginUser, getUsers } from '../controllers/userController.js';
import { verifyUser } from '../controllers/authController.js';
import verifyJWT from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post("/verify/user", verifyUser);  
router.get('/', verifyJWT, getUsers);

export default router;
