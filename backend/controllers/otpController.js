import twilio from 'twilio';

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const otpStore = {}; // In production, use Redis or DB

export const sendOTP = async (req, res) => {
  console.log('OTP SEND BODY:', req.body);
  const { mobile } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[mobile] = otp;

  try {
    await client.messages.create({
      body: `Your FinZen OTP is: ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: `+91${mobile}`,
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const verifyOTP = (req, res) => {
  const { mobile, otp } = req.body;
  if (otpStore[mobile] === otp) {
    delete otpStore[mobile];
    res.json({ success: true });
  } else {
    res.status(400).json({ success: false, error: 'Invalid OTP' });
  }
};