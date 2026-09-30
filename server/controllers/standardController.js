const ComplianceStandard = require('../models/ComplianceStandard');

// @desc    Get all compliance standards
// @route   GET /api/standards
// @access  Public / Private
const getStandards = async (req, res) => {
  const { category, active } = req.query;
  let query = {};
  if (category) query.category = category;
  if (active !== undefined) query.active = active === 'true';

  const standards = await ComplianceStandard.find(query).sort({ category: 1, code: 1 });
  res.json(standards);
};

// @desc    Create a compliance standard
// @route   POST /api/standards
// @access  Private/Admin
const createStandard = async (req, res) => {
  const { code, category, criterion, description, maximumScore, active } = req.body;
  const count = await ComplianceStandard.countDocuments();
  const generatedCode = code || `STD-${100 + count + 1}`;

  const standard = await ComplianceStandard.create({
    code: generatedCode,
    category,
    criterion,
    description: description || '',
    maximumScore: maximumScore || 2,
    active: active !== undefined ? active : true,
  });

  res.status(201).json(standard);
};

// @desc    Update a compliance standard
// @route   PUT /api/standards/:id
// @access  Private/Admin
const updateStandard = async (req, res) => {
  const standard = await ComplianceStandard.findById(req.params.id);
  if (standard) {
    standard.category = req.body.category || standard.category;
    standard.criterion = req.body.criterion || standard.criterion;
    standard.description = req.body.description !== undefined ? req.body.description : standard.description;
    standard.maximumScore = req.body.maximumScore !== undefined ? req.body.maximumScore : standard.maximumScore;
    standard.active = req.body.active !== undefined ? req.body.active : standard.active;

    const updated = await standard.save();
    res.json(updated);
  } else {
    res.status(404).json({ message: 'Standard not found' });
  }
};

// @desc    Delete compliance standard
// @route   DELETE /api/standards/:id
// @access  Private/Admin
const deleteStandard = async (req, res) => {
  const standard = await ComplianceStandard.findById(req.params.id);
  if (standard) {
    await standard.deleteOne();
    res.json({ message: 'Standard deleted successfully' });
  } else {
    res.status(404).json({ message: 'Standard not found' });
  }
};

module.exports = {
  getStandards,
  createStandard,
  updateStandard,
  deleteStandard,
};
