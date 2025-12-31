import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import inquiryRoutes from './routes/inquiries.js';
import partyRoutes from './routes/parties.js';
import fleetRoutes from './routes/fleet.js';
import transactionRoutes from './routes/transactions.js';
import broadcastRoutes from './routes/broadcasts.js';
import settingsRoutes from './routes/settings.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increase limit for Base64 images

// Routes
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/parties', partyRoutes);
app.use('/api/fleet', fleetRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/broadcasts', broadcastRoutes);
app.use('/api/settings', settingsRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Basic Route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
