const mongoose = require('mongoose');

const violationSchema = new mongoose.Schema(
  {
    violationId: { type: String, required: true, unique: true },
    facility: { type: mongoose.Schema.Types.ObjectId, ref: 'Facility', required: true },
    inspection: { type: mongoose.Schema.Types.ObjectId, ref: 'Inspection' },
    category: { type: String, required: true },
    description: { type: String, required: true },
    severity: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
    },
    reportedDate: { type: Date, default: Date.now },
    dueDate: { type: Date, required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: {
      type: String,
      enum: ['Open', 'Under Review', 'Corrective Action Submitted', 'Resolved', 'Closed'],
      default: 'Open',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Violation', violationSchema);
