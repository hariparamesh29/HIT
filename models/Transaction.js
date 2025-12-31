import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    partyId: { type: String, required: true },
    type: { type: String, required: true, enum: ['Buy', 'Sell'] },
    itemName: { type: String },
    weight: { type: Number },
    rate: { type: Number },
    amount: { type: Number, required: true },
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

export default mongoose.model('Transaction', transactionSchema);
