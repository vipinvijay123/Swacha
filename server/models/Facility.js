const mongoose = require('mongoose');

const facilitySchema = new mongoose.Schema(
  {
    facilityId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    facilityType: {
      type: String,
      required: true,
      enum: [
        'Educational Institution',
        'Government Office',
        'Public Facility',
        'Healthcare Facility',
        'Commercial & Industrial',
        'Residential Campus',
      ],
    },
    location: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, default: '' },
      pincode: { type: String, default: '' },
    },
    manager: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    contact: {
      person: { type: String, default: '' },
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
    },
    numberOfOccupants: { type: Number, default: 0 },
    description: { type: String, default: '' },
    complianceScore: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['Excellent', 'Compliant', 'Needs Improvement', 'Non-Compliant'],
      default: 'Needs Improvement',
    },
    categoryScores: {
      'Cleanliness & Hygiene': { type: Number, default: 0 },
      'Waste Management': { type: Number, default: 0 },
      'Water Management': { type: Number, default: 0 },
      'Energy Management': { type: Number, default: 0 },
      'Green Environment': { type: Number, default: 0 },
      'Sanitation': { type: Number, default: 0 },
      'Awareness & Sustainability': { type: Number, default: 0 },
    },
    lastInspectionDate: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Facility', facilitySchema);
