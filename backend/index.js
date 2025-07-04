import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

import authRoutes from './routes/auth.js';
import userRoutes from './routes/userRoutes.js';
import cardRoutes from './routes/cardRoutes.js';
import insightRoutes from "./routes/insightRoutes.js";
import transactionRoutes from './routes/transactionRoutes.js';
import incVsExpRoutes from './routes/incVsExpRoute.js'
import dashboardRoutes from './routes/dashboard.js';
import otpRoutes from './routes/otpRoutes.js';


dotenv.config();
const app = express();

// Middleware
const allowedOrigins = [
  "https://finzen-z1gq.onrender.com",
  "http://localhost:5173"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/cards', cardRoutes);
app.use('/api/insights', insightRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/income-vs-expense', incVsExpRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/otp', otpRoutes);

// Health check
app.get('/', (req, res) => res.send('🚀 FinZen Backend Running'));

// DB + Server
connectDB();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
