const User = require('../models/User');

const getUsers = async (req, res) => {
  const users = await User.find({}).select('-password').populate('assignedFacility', 'name facilityId');
  res.json(users);
};

const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id).select('-password').populate('assignedFacility', 'name facilityId');
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

const createUser = async (req, res) => {
  const { name, email, password, role, phone, assignedFacility } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }
  const user = await User.create({
    name,
    email,
    password,
    role: role || 'inspector',
    phone: phone || '',
    assignedFacility: assignedFacility || null,
  });
  res.status(201).json(user);
};

const updateUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.role = req.body.role || user.role;
    user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
    user.status = req.body.status || user.status;
    user.assignedFacility = req.body.assignedFacility !== undefined ? req.body.assignedFacility : user.assignedFacility;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      phone: updatedUser.phone,
      status: updatedUser.status,
      assignedFacility: updatedUser.assignedFacility,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    await user.deleteOne();
    res.json({ message: 'User removed successfully' });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
