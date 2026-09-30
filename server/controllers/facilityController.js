const Facility = require('../models/Facility');
const Inspection = require('../models/Inspection');
const Violation = require('../models/Violation');
const CorrectiveAction = require('../models/CorrectiveAction');

// @desc    Get all facilities with filters
// @route   GET /api/facilities
// @access  Public / Private
const getFacilities = async (req, res) => {
  const { search, facilityType, status } = req.query;
  let query = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { facilityId: { $regex: search, $options: 'i' } },
      { 'location.city': { $regex: search, $options: 'i' } },
    ];
  }

  if (facilityType) {
    query.facilityType = facilityType;
  }

  if (status) {
    query.status = status;
  }

  const facilities = await Facility.find(query).populate('manager', 'name email phone').sort({ updatedAt: -1 });
  res.json(facilities);
};

// @desc    Get single facility by ID with deep insights
// @route   GET /api/facilities/:id
// @access  Public / Private
const getFacilityById = async (req, res) => {
  const facility = await Facility.findById(req.params.id).populate('manager', 'name email phone');
  if (!facility) {
    return res.status(404).json({ message: 'Facility not found' });
  }

  const inspections = await Inspection.find({ facility: facility._id })
    .populate('inspector', 'name email')
    .sort({ inspectionDate: -1 })
    .limit(10);

  const violations = await Violation.find({ facility: facility._id })
    .populate('assignedTo', 'name email')
    .sort({ createdAt: -1 });

  const correctiveActions = await CorrectiveAction.find({ facility: facility._id })
    .populate('assignedTo', 'name email')
    .sort({ createdAt: -1 });

  res.json({
    facility,
    inspections,
    violations,
    correctiveActions,
  });
};

// @desc    Create new facility
// @route   POST /api/facilities
// @access  Private/Admin
const createFacility = async (req, res) => {
  const { name, facilityType, location, manager, contact, numberOfOccupants, description } = req.body;

  const count = await Facility.countDocuments();
  const facilityId = req.body.facilityId || `FAC-${100 + count + 1}`;

  const facility = await Facility.create({
    facilityId,
    name,
    facilityType,
    location,
    manager: manager || null,
    contact: contact || {},
    numberOfOccupants: numberOfOccupants || 0,
    description: description || '',
    complianceScore: 75,
    status: 'Compliant',
    categoryScores: {
      'Cleanliness & Hygiene': 75,
      'Waste Management': 75,
      'Water Management': 75,
      'Energy Management': 75,
      'Green Environment': 75,
      'Sanitation': 75,
      'Awareness & Sustainability': 75,
    },
  });

  res.status(201).json(facility);
};

// @desc    Update facility
// @route   PUT /api/facilities/:id
// @access  Private/Admin
const updateFacility = async (req, res) => {
  const facility = await Facility.findById(req.params.id);

  if (facility) {
    facility.name = req.body.name || facility.name;
    facility.facilityType = req.body.facilityType || facility.facilityType;
    facility.location = req.body.location || facility.location;
    facility.manager = req.body.manager !== undefined ? req.body.manager : facility.manager;
    facility.contact = req.body.contact || facility.contact;
    facility.numberOfOccupants = req.body.numberOfOccupants !== undefined ? req.body.numberOfOccupants : facility.numberOfOccupants;
    facility.description = req.body.description !== undefined ? req.body.description : facility.description;

    const updatedFacility = await facility.save();
    res.json(updatedFacility);
  } else {
    res.status(404).json({ message: 'Facility not found' });
  }
};

// @desc    Delete facility
// @route   DELETE /api/facilities/:id
// @access  Private/Admin
const deleteFacility = async (req, res) => {
  const facility = await Facility.findById(req.params.id);
  if (facility) {
    await facility.deleteOne();
    res.json({ message: 'Facility deleted successfully' });
  } else {
    res.status(404).json({ message: 'Facility not found' });
  }
};

module.exports = {
  getFacilities,
  getFacilityById,
  createFacility,
  updateFacility,
  deleteFacility,
};
