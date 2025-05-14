import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import TurfOwner from '../models/model.turfowner.js';
import Turf from '../models/model.turf.js'; 

const JWT_SECRET = process.env.JWT_SECRET || 'jwtsecret'; // Keep this in .env

// Turf Owner registration
export const registerTurfOwner = async (req, res) => {
  const { name, mobile, email, password } = req.body;

  if (!name || !mobile || !email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const existingTurfOwner = await TurfOwner.findOne({ where: { email } });
    if (existingTurfOwner) {
      return res.status(409).json({ message: 'Turf Owner already exists with this email.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newTurfOwner = await TurfOwner.create({
      name,
      mobile,
      email,
      passwordHash
    });

    return res.status(201).json({
      message: 'Turf Owner registered successfully.',
      turfOwner: { id: newTurfOwner.id, name: newTurfOwner.name, email: newTurfOwner.email }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Something went wrong.' });
  }
};

// Turf Owner login
export const loginTurfOwner = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const turfOwner = await TurfOwner.findOne({ where: { email } });

    if (!turfOwner) {
      return res.status(404).json({ message: 'Turf Owner not found.' });
    }

    const isMatch = await bcrypt.compare(password, turfOwner.passwordHash);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign({ id: turfOwner.id, email: turfOwner.email }, JWT_SECRET, {
      expiresIn: '7d'
    });

    return res.status(200).json({
      message: 'Login successful.',
      token,
      turfOwner: {
        id: turfOwner.id,
        name: turfOwner.name,
        email: turfOwner.email
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Something went wrong.' });
  }
};

export const addTurf = async (req, res) => {
  const {
    turfOwnerId,
    name,
    location,
    pricePerHrDaytime,
    pricePerHrNighttime,
    turfImages
  } = req.body;

  if (!turfOwnerId || !name || !location || !pricePerHrDaytime || !pricePerHrNighttime || !turfImages) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const turfOwner = await TurfOwner.findByPk(turfOwnerId);
    if (!turfOwner) {
      return res.status(404).json({ message: 'Turf Owner not found.' });
    }

    const newTurf = await Turf.create({
      turfOwnerId,
      name,
      location,
      pricePerHrDaytime,
      pricePerHrNighttime,
      turfImages,
    });

    return res.status(201).json({
      message: 'Turf added successfully.',
      turf: {
        ...newTurf.toJSON(),
        owner: { name: turfOwner.name }
      }
    });
  } catch (err) {
    console.error('Error adding turf:', err);
    return res.status(500).json({ message: 'Something went wrong while adding the turf.' });
  }
};

export const getAllTurfsOfOwner = async (req, res) => {
  const { ownerId } = req.params;

  try {
    const turfs = await Turf.findAll({
      where: { turfOwnerId: ownerId },
      attributes: ['id', 'name', 'location', 'pricePerHrDaytime', 'pricePerHrNighttime', 'turfImages'],
      include: [
        {
          model: TurfOwner,
          as: 'owner',
          attributes: ['name'],
        },
      ],
    });

    if (!turfs.length) {
      return res.status(404).json({ message: 'No turfs found for this owner.' });
    }

    return res.status(200).json({ turfs });
  } catch (err) {
    console.error('Error fetching turfs:', err);
    return res.status(500).json({ message: 'Failed to retrieve turfs.' });
  }
};
