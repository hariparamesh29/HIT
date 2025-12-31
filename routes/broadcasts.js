import express from 'express';
import Broadcast from '../models/Broadcast.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const broadcasts = await Broadcast.find().sort({ sentAt: -1 });
        res.json(broadcasts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', async (req, res) => {
    const broadcast = new Broadcast(req.body);
    try {
        const newBroadcast = await broadcast.save();
        res.status(201).json(newBroadcast);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

export default router;
