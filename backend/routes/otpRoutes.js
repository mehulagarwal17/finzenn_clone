import express from 'express';
import { sendOTP, verifyOTP } from '../controllers/otpController.js';
const router = express.Router();

// router.post('/send', sendOTP);
router.post('/send', (req, res, next) => {
    console.log('OTP SEND ROUTE HIT', req.body);
    next();
  }, sendOTP);
router.post('/verify', verifyOTP);

export default router;