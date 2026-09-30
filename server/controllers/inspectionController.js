const Inspection = require('../models/Inspection');
const Facility = require('../models/Facility');
const Violation = require('../models/Violation');
const Notification = require('../models/Notification');
const { calculateInspectionScores, getFacilityStatus } = require('../utils/scoreCalculator');

// @desc    Get all inspections
// @route   GET /api/inspections
// @access  Public / Private
const getInspections = async (req, res) => {
  const { facility, inspector, type } = req.query;
  let query = {};
  if (facility) query.facility = facility;
  if (inspector) query.inspector = inspector;
  if (type) query.inspectionType = type;

  const inspections = await Inspection.find(query)
    .populate('facility', 'name facilityId location')
    .populate('inspector', 'name email role')
    .sort({ inspectionDate: -1 });

  res.json(inspections);
};

// @desc    Get inspection by ID
// @route   GET /api/inspections/:id
// @access  Public / Private
const getInspectionById = async (req, res) => {
  const inspection = await Inspection.findById(req.params.id)
    .populate('facility')
    .populate('inspector', 'name email role phone');

  if (!inspection) {
    return res.status(404).json({ message: 'Inspection record not found' });
  }

  res.json(inspection);
};

// @desc    Create new inspection with auto-scoring
// @route   POST /api/inspections
// @access  Private (Inspector / Admin)
const createInspection = async (req, res) => {
  let { facilityId, inspectionType, inspectionDate, checklist, remarks, autoCreateViolations } = req.body;

  if (typeof checklist === 'string') {
    try {
      checklist = JSON.parse(checklist);
    } catch (e) {
      checklist = [];
    }
  }

  const facilityObj = await Facility.findById(facilityId);
  if (!facilityObj) {
    return res.status(404).json({ message: 'Target facility not found' });
  }

  // File upload paths
  let evidence = [];
  if (req.files && req.files.length > 0) {
    evidence = req.files.map((file) => `/uploads/${file.filename}`);
  }

  // Calculate scores automatically
  const { totalScore, maxPossibleScore, compliancePercentage, categoryScores } = calculateInspectionScores(checklist || []);

  const count = await Inspection.countDocuments();
  const inspectionId = `INSP-${1000 + count + 1}`;

  const inspection = await Inspection.create({
    inspectionId,
    facility: facilityObj._id,
    inspector: req.user._id,
    inspectionType: inspectionType || 'Routine',
    inspectionDate: inspectionDate || new Date(),
    checklist: checklist || [],
    totalScore,
    maxPossibleScore,
    compliancePercentage,
    remarks: remarks || '',
    evidence,
  });

  // Update Facility Scores and Status
  facilityObj.complianceScore = compliancePercentage;
  facilityObj.status = getFacilityStatus(compliancePercentage);
  facilityObj.categoryScores = { ...facilityObj.categoryScores, ...categoryScores };
  facilityObj.lastInspectionDate = inspection.inspectionDate;
  await facilityObj.save();

  // Create violations automatically for non-compliant items if requested
  const nonCompliantItems = (checklist || []).filter((item) => item.status === 'Non-Compliant');
  if (nonCompliantItems.length > 0 && autoCreateViolations) {
    for (const item of nonCompliantItems) {
      const vCount = await Violation.countDocuments();
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 7); // Default 7 days due date

      await Violation.create({
        violationId: `VIO-${100 + vCount + 1}`,
        facility: facilityObj._id,
        inspection: inspection._id,
        category: item.category,
        description: `Failed criterion: "${item.criterion}". ${item.remarks || 'Immediate corrective action required.'}`,
        severity: 'High',
        dueDate,
        assignedTo: facilityObj.manager || req.user._id,
        status: 'Open',
      });
    }
  }

  // Create Notification
  if (facilityObj.manager) {
    await Notification.create({
      user: facilityObj.manager,
      title: 'New Inspection Completed',
      message: `Inspection ${inspectionId} completed for ${facilityObj.name} with score ${compliancePercentage}%.`,
      type: compliancePercentage < 75 ? 'warning' : 'success',
      link: `/inspections/${inspection._id}`,
    });
  }

  res.status(201).json(inspection);
};

// @desc    Delete inspection
// @route   DELETE /api/inspections/:id
// @access  Private/Admin
const deleteInspection = async (req, res) => {
  const inspection = await Inspection.findById(req.params.id);
  if (inspection) {
    await inspection.deleteOne();
    res.json({ message: 'Inspection record deleted' });
  } else {
    res.status(404).json({ message: 'Inspection not found' });
  }
};

module.exports = {
  getInspections,
  getInspectionById,
  createInspection,
  deleteInspection,
};
