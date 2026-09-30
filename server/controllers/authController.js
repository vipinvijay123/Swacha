const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public (or Admin only if configured)
const registerUser = async (req, res) => {
  const { name, email, password, role, phone, assignedFacility } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'User with this email already exists' });
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role || 'inspector',
    phone: phone || '',
    assignedFacility: assignedFacility || null,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      status: user.status,
      assignedFacility: user.assignedFacility,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).populate('assignedFacility', 'name facilityId');

  if (user && (await user.matchPassword(password))) {
    if (user.status === 'inactive') {
      return res.status(403).json({ message: 'Your account is currently inactive. Please contact system admin.' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      status: user.status,
      assignedFacility: user.assignedFacility,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password').populate('assignedFacility', 'name facilityId');
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
