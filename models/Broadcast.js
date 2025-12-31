import mongoose from 'mongoose';

const broadcastSchema = new mongoose.Schema({
    message: { type: String, required: true },
    recipients: [{ type: String }], // Array of phone numbers
    sentAt: { type: Date, default: Date.now },
    status: { type: String, default: 'Sent' },
}, { timestamps: true });

export default mongoose.model('Broadcast', broadcastSchema);
