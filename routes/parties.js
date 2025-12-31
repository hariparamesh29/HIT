import express from 'express';
import Party from '../models/Party.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const parties = await Party.find().sort({ name: 1 });
        res.json(parties);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', async (req, res) => {
    const party = new Party(req.body);
    try {
        const newParty = await party.save();
        res.status(201).json(newParty);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const updatedParty = await Party.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedParty);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await Party.findByIdAndDelete(req.params.id);
        res.json({ message: 'Party deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
