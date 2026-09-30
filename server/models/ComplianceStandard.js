const mongoose = require('mongoose');

const complianceStandardSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    category: {
      type: String,
      required: true,
      enum: [
        'Cleanliness & Hygiene',
        'Waste Management',
        'Water Management',
        'Energy Management',
        'Green Environment',
        'Sanitation',
        'Awareness & Sustainability',
      ],
    },
    criterion: { type: String, required: true },
    description: { type: String, default: '' },
    maximumScore: { type: Number, default: 2 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ComplianceStandard', complianceStandardSchema);
