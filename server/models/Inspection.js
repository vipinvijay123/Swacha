const mongoose = require('mongoose');

const checklistItemSchema = new mongoose.Schema({
  standard: { type: mongoose.Schema.Types.ObjectId, ref: 'ComplianceStandard' },
  category: { type: String, required: true },
  criterion: { type: String, required: true },
  score: { type: Number, enum: [0, 1, 2], default: 0 },
  status: {
    type: String,
    enum: ['Compliant', 'Partially Compliant', 'Non-Compliant', 'Not Applicable'],
    required: true,
  },
  remarks: { type: String, default: '' },
  evidencePhotos: [{ type: String }],
});

const inspectionSchema = new mongoose.Schema(
  {
    inspectionId: { type: String, required: true, unique: true },
    facility: { type: mongoose.Schema.Types.ObjectId, ref: 'Facility', required: true },
    inspector: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    inspectionType: {
      type: String,
      enum: ['Routine', 'Surprise', 'Follow-up', 'Special'],
      default: 'Routine',
    },
    inspectionDate: { type: Date, default: Date.now },
    checklist: [checklistItemSchema],
    totalScore: { type: Number, required: true, default: 0 },
    maxPossibleScore: { type: Number, required: true, default: 0 },
    compliancePercentage: { type: Number, required: true, default: 0 },
    remarks: { type: String, default: '' },
    evidence: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Inspection', inspectionSchema);
