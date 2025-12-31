import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
    companyName: { type: String },
    logoUrl: { type: String },
    heroImageUrl: { type: String },
    aboutHeroImageUrl: { type: String },
    founderName: { type: String },
    founderDescription: { type: String },
    founderPhotoUrl: { type: String },
    founder2Name: { type: String },
    founder2Description: { type: String },
    founder2PhotoUrl: { type: String },
    coFounderName: { type: String },
    coFounderPhotoUrl: { type: String },
    coFounderDescription: { type: String },
    phone: { type: String },
    whatsapp: { type: String },
    email: { type: String },
    address: { type: String },
    whyHeading: { type: String },
    whySubheading: { type: String },
    whyPageTitle: { type: String },
    whyPageDescription: { type: String },
    benefits: [{
        id: String,
        title: String,
        desc: String,
        icon: String,
        imageUrl: String,
        enabled: Boolean
    }],
    aboutStats: [{
        id: String,
        label: String,
        val: String,
        enabled: Boolean
    }],
    team: [{
        id: String,
        name: String,
        role: String,
        description: String,
        photoUrl: String,
        enabled: Boolean,
        order: Number
    }],
    products: [{
        id: String,
        name: String,
        description: String,
        imageUrl: String
    }],
    rates: [{
        id: String,
        name: String,
        rate: Number,
        unit: String,
        enabled: Boolean,
        order: Number
    }],
    showFounder: { type: Boolean },
    showFounder2: { type: Boolean },
    showCoFounder: { type: Boolean },
    showFounderDesc: { type: Boolean },
    showFounder2Desc: { type: Boolean },
    showCoFounderDesc: { type: Boolean },
    showCoverageSection: { type: Boolean },
    coverageLabel: { type: String },
    coverageHeading: { type: String },
    coverageDescription: { type: String },
    coverageAreas: [String],
    activeVehicles: { type: Number },
    operationalEfficiency: { type: Number },
    updatedAt: { type: Number }
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

export default mongoose.model('Settings', settingsSchema);
