import User from "../models/model.user.js";
import TurfOwner from "../models/model.turfowner.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import admin from "../config/firebase.js";

const JWT_SECRET = process.env.JWT_SECRET || "jwtsecret";

// === COMMON ===
const verifyFirebaseToken = async (idToken) => {
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return decodedToken;
  } catch (err) {
    console.error("Firebase token verification failed:", err);
    throw new Error("Invalid Firebase token");
  }
};

// === USER CONTROLLERS ===
const registerUser = async (req, res) => {
  const { name, email, mobile, password } = req.body;

  if (!name || !email || !mobile || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, mobile, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email and password required" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });

    res.json({ token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const verifyUser = async (req, res) => {
  const { idToken } = req.body;
  if (!idToken) return res.status(400).json({ message: "ID token is required" });

  try {
    const decoded = await verifyFirebaseToken(idToken);
    const user = await User.findOne({ mobile: decoded.phone_number.replace("+91", "") });

    if (!user) {
      return res.status(404).json({ message: "User not found, deleting..." });
    }

    res.status(200).json({ verified: true, uid: decoded.uid });
  } catch (err) {
    const phone = req.body.phone;
    if (phone) {
      await User.findOneAndDelete({ mobile: phone });
    }
    res.status(401).json({ verified: false, message: err.message });
  }
};

// === TURF OWNER CONTROLLERS ===
const registerTurfOwner = async (req, res) => {
  const { name, mobile, email, password } = req.body;

  if (!name || !mobile || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const existingTurfOwner = await TurfOwner.findOne({ where: { email } });
    if (existingTurfOwner) {
      return res.status(409).json({ message: "TurfOwner already exists with this email." });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newTurfOwner = await TurfOwner.create({
      name,
      mobile,
      email,
      passwordHash,
    });

    return res.status(201).json({
      message: "TurfOwner registered successfully.",
      turfOwner: {
        id: newTurfOwner.id,
        name: newTurfOwner.name,
        email: newTurfOwner.email,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Something went wrong." });
  }
};

const loginTurfOwner = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  try {
    const turfOwner = await TurfOwner.findOne({ where: { email } });

    if (!turfOwner) {
      return res.status(404).json({ message: "TurfOwner not found." });
    }

    const isMatch = await bcrypt.compare(password, turfOwner.passwordHash);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign({ id: turfOwner.id, email: turfOwner.email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(200).json({
      message: "Login successful.",
      token,
      turfOwner: {
        id: turfOwner.id,
        name: turfOwner.name,
        email: turfOwner.email,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Something went wrong." });
  }
};

const verifyTurfOwner = async (req, res) => {
  const { idToken } = req.body;
  if (!idToken) return res.status(400).json({ message: "ID token is required" });

  try {
    const decoded = await verifyFirebaseToken(idToken);

    const turfOwner = await TurfOwner.findOne({
      where: { mobile: decoded.phone_number.replace("+91", "") },
    });

    if (!turfOwner) {
      return res.status(404).json({ message: "TurfOwner not found, deleting..." });
    }

    res.status(200).json({ verified: true, uid: decoded.uid });
  } catch (err) {
    const phone = req.body.phone;
    if (phone) {
      await TurfOwner.destroy({ where: { mobile: phone } });
    }
    res.status(401).json({ verified: false, message: err.message });
  }
};

// EXPORTS
export {
  registerUser,
  loginUser,
  verifyUser,
  registerTurfOwner,
  loginTurfOwner,
  verifyTurfOwner,
  verifyFirebaseToken,
};
