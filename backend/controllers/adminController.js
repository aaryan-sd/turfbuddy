import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Admin from '../models/model.admin.js';
import TurfOwner from '../models/model.turfowner.js';
import Turf from '../models/model.turf.js';

const JWT_SECRET = process.env.JWT_SECRET || 'jwtsecret';

// Admin Registration
export const registerAdmin = async (req, res) => {
  const { name, mobile, email, password } = req.body;

  if (!name || !mobile || !email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    // Check if an admin already exists with the given email
    const existingAdmin = await Admin.findOne({ where: { email } });
    if (existingAdmin) {
      return res.status(409).json({ message: 'Admin already exists with this email.' });
    }

    // Hash the password before saving
    const passwordHash = await bcrypt.hash(password, 10);

    // Create a new admin
    const newAdmin = await Admin.create({
      name,
      mobile,
      email,
      passwordHash,
    });

    return res.status(201).json({
      message: 'Admin registered successfully.',
      admin: {
        id: newAdmin.id,
        name: newAdmin.name,
        email: newAdmin.email,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Something went wrong.' });
  }
};

// Admin Login
export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    // Find the admin by email
    const admin = await Admin.findOne({ where: { email } });

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found.' });
    }

    // Compare the entered password with the stored hash
    const isMatch = await bcrypt.compare(password, admin.passwordHash);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: admin.id, email: admin.email }, JWT_SECRET, {
      expiresIn: '7d',
    });

    return res.status(200).json({
      message: 'Login successful.',
      token,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Something went wrong.' });
  }
};

// Get all turf owners
export const getAllTurfOwners = async (req, res) => {
  try {
    const turfOwners = await TurfOwner.findAll({
      attributes: ['id', 'name', 'email', 'mobile'], // Exclude passwordHash
    });

    if (turfOwners.length === 0) {
      return res.status(404).json({ message: 'No turf owners found.' });
    }

    return res.status(200).json({ turfOwners });
  } catch (err) {
    console.error('Error fetching turf owners:', err);
    return res.status(500).json({ message: 'Failed to retrieve turf owners.' });
  }
};

// Get all turfs
export const getAllTurfs = async (req, res) => {
  try {
    const turfs = await Turf.findAll({
      attributes: ['id', 'name', 'location', 'pricePerHour', 'turfImages'], // Exclude sensitive info
    });

    if (turfs.length === 0) {
      return res.status(404).json({ message: 'No turfs found.' });
    }

    return res.status(200).json({ turfs });
  } catch (err) {
    console.error('Error fetching turfs:', err);
    return res.status(500).json({ message: 'Failed to retrieve turfs.' });
  }
};
