import mongoose from 'mongoose';

const partySchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true, enum: ['Buyer', 'Supplier', 'Both'] },
    industry: { type: String },
    phone: { type: String },
    whatsapp: { type: String },
    address: { type: String },
    status: { type: String, default: 'Active' },
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

export default mongoose.model('Party', partySchema);
