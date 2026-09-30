const Violation = require('../models/Violation');
const CorrectiveAction = require('../models/CorrectiveAction');
const Notification = require('../models/Notification');

// @desc    Get all violations
// @route   GET /api/violations
// @access  Public / Private
const getViolations = async (req, res) => {
  const { facility, severity, status, search } = req.query;
  let query = {};

  if (facility) query.facility = facility;
  if (severity) query.severity = severity;
  if (status) query.status = status;
  if (search) {
    query.$or = [
      { violationId: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { category: { $regex: search, $options: 'i' } },
    ];
  }

  const violations = await Violation.find(query)
    .populate('facility', 'name facilityId location')
    .populate('assignedTo', 'name email role')
    .populate('inspection', 'inspectionId inspectionDate')
    .sort({ createdAt: -1 });

  res.json(violations);
};

// @desc    Get violation by ID
// @route   GET /api/violations/:id
// @access  Public / Private
const getViolationById = async (req, res) => {
  const violation = await Violation.findById(req.params.id)
    .populate('facility')
    .populate('assignedTo', 'name email role phone')
    .populate('inspection');

  if (!violation) {
    return res.status(404).json({ message: 'Violation not found' });
  }

  const correctiveAction = await CorrectiveAction.findOne({ violation: violation._id }).populate('assignedTo', 'name email');

  res.json({ violation, correctiveAction });
};

// @desc    Create new violation
// @route   POST /api/violations
// @access  Private (Inspector / Admin)
const createViolation = async (req, res) => {
  const { facility, inspection, category, description, severity, dueDate, assignedTo } = req.body;

  const count = await Violation.countDocuments();
  const violationId = req.body.violationId || `VIO-${100 + count + 1}`;

  const violation = await Violation.create({
    violationId,
    facility,
    inspection: inspection || null,
    category,
    description,
    severity: severity || 'Medium',
    dueDate: dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    assignedTo: assignedTo || null,
    status: 'Open',
  });

  // Create empty pending corrective action linked to this violation automatically
  const caCount = await CorrectiveAction.countDocuments();
  await CorrectiveAction.create({
    actionId: `ACT-${100 + caCount + 1}`,
    violation: violation._id,
    facility,
    actionRequired: `Remediate violation: ${description}`,
    assignedTo: assignedTo || null,
    targetDate: dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    status: 'Pending',
  });

  res.status(201).json(violation);
};

// @desc    Update violation
// @route   PUT /api/violations/:id
// @access  Private
const updateViolation = async (req, res) => {
  const violation = await Violation.findById(req.params.id);

  if (violation) {
    violation.category = req.body.category || violation.category;
    violation.description = req.body.description || violation.description;
    violation.severity = req.body.severity || violation.severity;
    violation.status = req.body.status || violation.status;
    violation.dueDate = req.body.dueDate || violation.dueDate;
    violation.assignedTo = req.body.assignedTo !== undefined ? req.body.assignedTo : violation.assignedTo;

    const updatedViolation = await violation.save();
    res.json(updatedViolation);
  } else {
    res.status(404).json({ message: 'Violation not found' });
  }
};

// @desc    Delete violation
// @route   DELETE /api/violations/:id
// @access  Private/Admin
const deleteViolation = async (req, res) => {
  const violation = await Violation.findById(req.params.id);
  if (violation) {
    await CorrectiveAction.deleteMany({ violation: violation._id });
    await violation.deleteOne();
    res.json({ message: 'Violation deleted successfully' });
  } else {
    res.status(404).json({ message: 'Violation not found' });
  }
};

module.exports = {
  getViolations,
  getViolationById,
  createViolation,
  updateViolation,
  deleteViolation,
};
