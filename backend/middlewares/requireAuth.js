import jwt from 'jsonwebtoken';
import User from '../models/user.js';

export const requireAuth = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(401).json({ message: 'User not found' });

    req.user = user; // Add user to request
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
