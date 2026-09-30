const mongoose = require('mongoose');

const correctiveActionSchema = new mongoose.Schema(
  {
    actionId: { type: String, required: true, unique: true },
    violation: { type: mongoose.Schema.Types.ObjectId, ref: 'Violation', required: true },
    facility: { type: mongoose.Schema.Types.ObjectId, ref: 'Facility', required: true },
    actionRequired: { type: String, required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    targetDate: { type: Date, required: true },
    completionDate: { type: Date },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Submitted', 'Under Review', 'Completed', 'Overdue'],
      default: 'Pending',
    },
    remarks: { type: String, default: '' },
    evidence: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('CorrectiveAction', correctiveActionSchema);
