import { User, Medicine } from '../Model/model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ token, user: { id: user._id, name, email } });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token, user: { id: user._id, name: user.name, email } });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const addMedicine = async (req, res) => {
  const { name, problem, timing, foodRelation, alarmTime } = req.body;
  const userId = req.userId;

  try {
    const medicine = new Medicine({ userId, name, problem, timing, foodRelation, alarmTime });
    await medicine.save();
    res.status(201).json({ message: 'Medicine added successfully', medicine });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add medicine' });
  }
};

export const getMedicines = async (req, res) => {
  const userId = req.userId;

  try {
    const medicines = await Medicine.find({ userId });
    res.status(200).json(medicines);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch medicines' });
  }
};

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

export const setAlarm = async (req, res) => {
  const { medicineId, alarmTime, medicineName } = req.body;
  const userId = req.userId;

  try {
    const alarmData = {
      userId,
      medicineId,
      alarmTime,
      medicineName,
      isActive: true,
      createdAt: new Date()
    };
    
    console.log(`Alarm set for ${medicineName} at ${alarmTime}`);
    res.status(201).json({ message: 'Alarm set successfully', alarm: alarmData });
  } catch (error) {
    res.status(500).json({ message: 'Failed to set alarm' });
  }
};

export const triggerAlarm = async (req, res) => {
  try {
    res.status(200).json({ 
      message: 'Alarm triggered!', 
      sound: 'alarm-sound-url',
      notification: 'Time to take your medicine!' 
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to trigger alarm' });
  }
};
