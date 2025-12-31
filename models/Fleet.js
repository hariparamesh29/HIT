import mongoose from 'mongoose';

const fleetSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    vehicleNumber: { type: String, required: true },
    partyId: { type: String }, // Storing as string to match frontend ID usage, or could be ObjectId if we link
    location: { type: String },
    weight: { type: Number },
    status: { type: String, default: 'Loading' },
    notes: { type: String },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        versionKey: false,
        transform: function (doc, ret) {
            delete ret._id;
        }
    }
});

export default mongoose.model('Fleet', fleetSchema);
