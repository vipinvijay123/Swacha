const CorrectiveAction = require('../models/CorrectiveAction');
const Violation = require('../models/Violation');
const Notification = require('../models/Notification');

// Auto check overdue items
const autoCheckOverdue = async (actions) => {
  const now = new Date();
  const updatedActions = [];

  for (let action of actions) {
    if (
      action.status !== 'Completed' &&
      action.status !== 'Overdue' &&
      new Date(action.targetDate) < now
    ) {
      action.status = 'Overdue';
      await action.save();
    }
    updatedActions.push(action);
  }
  return updatedActions;
};

// @desc    Get all corrective actions
// @route   GET /api/corrective-actions
// @access  Public / Private
const getCorrectiveActions = async (req, res) => {
  const { facility, status, assignedTo } = req.query;
  let query = {};
  if (facility) query.facility = facility;
  if (status) query.status = status;
  if (assignedTo) query.assignedTo = assignedTo;

  let actions = await CorrectiveAction.find(query)
    .populate('violation')
    .populate('facility', 'name facilityId location')
    .populate('assignedTo', 'name email role')
    .sort({ targetDate: 1 });

  actions = await autoCheckOverdue(actions);
  res.json(actions);
};

// @desc    Get corrective action by ID
// @route   GET /api/corrective-actions/:id
// @access  Public / Private
const getActionById = async (req, res) => {
  let action = await CorrectiveAction.findById(req.params.id)
    .populate({
      path: 'violation',
      populate: { path: 'inspection' },
    })
    .populate('facility')
    .populate('assignedTo', 'name email role phone');

  if (!action) {
    return res.status(404).json({ message: 'Corrective action not found' });
  }

  if (action.status !== 'Completed' && new Date(action.targetDate) < new Date()) {
    action.status = 'Overdue';
    await action.save();
  }

  res.json(action);
};

// @desc    Create new corrective action
// @route   POST /api/corrective-actions
// @access  Private
const createCorrectiveAction = async (req, res) => {
  const { violationId, facilityId, actionRequired, assignedTo, targetDate, remarks } = req.body;

  const count = await CorrectiveAction.countDocuments();
  const actionId = req.body.actionId || `ACT-${100 + count + 1}`;

  const action = await CorrectiveAction.create({
    actionId,
    violation: violationId,
    facility: facilityId,
    actionRequired,
    assignedTo: assignedTo || null,
    targetDate: targetDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    remarks: remarks || '',
    status: 'Pending',
  });

  res.status(201).json(action);
};

// @desc    Update corrective action / submit proof
// @route   PUT /api/corrective-actions/:id
// @access  Private
const updateCorrectiveAction = async (req, res) => {
  const action = await CorrectiveAction.findById(req.params.id);

  if (!action) {
    return res.status(404).json({ message: 'Corrective action not found' });
  }

  let evidence = action.evidence || [];
  if (req.files && req.files.length > 0) {
    const newFiles = req.files.map((file) => `/uploads/${file.filename}`);
    evidence = [...evidence, ...newFiles];
  }

  action.actionRequired = req.body.actionRequired || action.actionRequired;
  action.assignedTo = req.body.assignedTo !== undefined ? req.body.assignedTo : action.assignedTo;
  action.targetDate = req.body.targetDate || action.targetDate;
  action.remarks = req.body.remarks !== undefined ? req.body.remarks : action.remarks;
  action.evidence = evidence;

  if (req.body.status) {
    action.status = req.body.status;
    if (req.body.status === 'Completed') {
      action.completionDate = new Date();

      // Automatically resolve associated violation
      const violation = await Violation.findById(action.violation);
      if (violation) {
        violation.status = 'Resolved';
        await violation.save();
      }
    } else if (req.body.status === 'Submitted') {
      const violation = await Violation.findById(action.violation);
      if (violation) {
        violation.status = 'Corrective Action Submitted';
        await violation.save();
      }
    }
  }

  const updatedAction = await action.save();
  res.json(updatedAction);
};

module.exports = {
  getCorrectiveActions,
  getActionById,
  createCorrectiveAction,
  updateCorrectiveAction,
};
