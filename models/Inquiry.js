import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema({
    clientName: { type: String, required: true },
    phone: { type: String, required: true },
    whatsapp: { type: String },
    product: { type: String },
    message: { type: String },
    source: { type: String },
    status: { type: String, default: 'New' },
    date: { type: Date, default: Date.now },
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

export default mongoose.model('Inquiry', inquirySchema);
