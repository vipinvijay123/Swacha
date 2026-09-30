const Inspection = require('../models/Inspection');
const Facility = require('../models/Facility');
const Violation = require('../models/Violation');
const CorrectiveAction = require('../models/CorrectiveAction');

// @desc    Get inspection compliance report payload
// @route   GET /api/reports/inspection/:id
// @access  Public / Private
const getInspectionReport = async (req, res) => {
  const inspection = await Inspection.findById(req.params.id)
    .populate('facility')
    .populate('inspector', 'name email role phone');

  if (!inspection) {
    return res.status(404).json({ message: 'Inspection record not found' });
  }

  const violations = await Violation.find({ inspection: inspection._id }).populate('assignedTo', 'name email');
  const correctiveActions = await CorrectiveAction.find({ facility: inspection.facility._id }).populate('assignedTo', 'name email');

  res.json({
    reportTitle: `Swachhta & Green Standard Inspection Report - ${inspection.inspectionId}`,
    generatedAt: new Date(),
    inspection,
    violations,
    correctiveActions,
  });
};

module.exports = {
  getInspectionReport,
};
