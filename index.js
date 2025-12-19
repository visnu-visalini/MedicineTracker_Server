import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './Db/db.js';
import { authRouter, medicineRouter, alarmRouter } from './Routes/routes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to database
connectDB();

// Routes
app.use('/api/auth', authRouter);
app.use('/api/medicine', medicineRouter);
app.use('/api/alarm', alarmRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
