import express from 'express';
import Inquiry from '../models/Inquiry.js';

const router = express.Router();

// Get all inquiries
router.get('/', async (req, res) => {
    try {
        const inquiries = await Inquiry.find().sort({ createdAt: -1 });
        res.json(inquiries);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create inquiry
router.post('/', async (req, res) => {
    const inquiry = new Inquiry(req.body);
    try {
        const newInquiry = await inquiry.save();
        res.status(201).json(newInquiry);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update inquiry
router.put('/:id', async (req, res) => {
    try {
        const updatedInquiry = await Inquiry.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedInquiry);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete inquiry
router.delete('/:id', async (req, res) => {
    try {
        await Inquiry.findByIdAndDelete(req.params.id);
        res.json({ message: 'Inquiry deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
