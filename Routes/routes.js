import express from 'express';
import { signup, login, addMedicine, getMedicines, verifyToken, setAlarm, triggerAlarm } from '../Controller/controller.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

const medicineRouter = express.Router();
const alarmRouter = express.Router();

medicineRouter.post('/add', verifyToken, addMedicine);
medicineRouter.get('/list', verifyToken, getMedicines);

alarmRouter.post('/set', verifyToken, setAlarm);
alarmRouter.post('/trigger', verifyToken, triggerAlarm);

export { router as authRouter, medicineRouter, alarmRouter };
