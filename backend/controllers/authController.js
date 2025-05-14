import admin from 'firebase-admin';
import User from '../models/model.user.js';
import TurfOwner from '../models/model.turfowner.js';

// Function to verify Firebase token for User
export const verifyFirebaseTokenForUser = async (req, res) => {
  const { idToken } = req.body;

  try {
    // Verify Firebase token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const mobile = decodedToken.phone_number;

    // Find the user in the database
    const user = await User.findOne({ where: { mobile } });

    if (!user) {
      return res.status(404).json({ message: 'User not found with this mobile.' });
    }

    // User found, return success response
    res.status(200).json({ verified: true, mobile: user.mobile });
  } catch (err) {
    res.status(401).json({ verified: false, error: 'Invalid token' });
  }
};

// Function to verify Firebase token for TurfOwner
export const verifyFirebaseTokenForTurfOwner = async (req, res) => {
  const { idToken } = req.body;

  try {
    // Verify Firebase token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const mobile = decodedToken.phone_number;

    // Find the turf owner in the database
    const turfOwner = await TurfOwner.findOne({ where: { mobile } });

    if (!turfOwner) {
      return res.status(404).json({ message: 'TurfOwner not found with this mobile.' });
    }

    // TurfOwner found, return success response
    res.status(200).json({ verified: true, mobile: turfOwner.mobile });
  } catch (err) {
    res.status(401).json({ verified: false, error: 'Invalid token' });
  }
};

// User Registration
export const registerUser = async (req, res) => {
  const { name, mobile, email, password } = req.body;

  if (!name || !mobile || !email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists with this email.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      mobile,
      email,
      passwordHash
    });

    return res.status(201).json({ message: 'User registered successfully.', user: { id: newUser.id, name: newUser.name, email: newUser.email } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Something went wrong.' });
  }
};

// User Login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '7d'
    });

    return res.status(200).json({
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Something went wrong.' });
  }
};

// TurfOwner Registration
export const registerTurfOwner = async (req, res) => {
  const { name, mobile, email, password } = req.body;

  if (!name || !mobile || !email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const existingTurfOwner = await TurfOwner.findOne({ where: { email } });
    if (existingTurfOwner) {
      return res.status(409).json({ message: 'TurfOwner already exists with this email.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newTurfOwner = await TurfOwner.create({
      name,
      mobile,
      email,
      passwordHash
    });

    return res.status(201).json({ message: 'TurfOwner registered successfully.', turfOwner: { id: newTurfOwner.id, name: newTurfOwner.name, email: newTurfOwner.email } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Something went wrong.' });
  }
};

// TurfOwner Login
export const loginTurfOwner = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const turfOwner = await TurfOwner.findOne({ where: { email } });

    if (!turfOwner) {
      return res.status(404).json({ message: 'TurfOwner not found.' });
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
