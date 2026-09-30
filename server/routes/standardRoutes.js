const express = require('express');
const router = express.Router();
const {
  getStandards,
  createStandard,
  updateStandard,
  deleteStandard,
} = require('../controllers/standardController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(getStandards)
  .post(protect, authorize('admin'), createStandard);

router.route('/:id')
  .put(protect, authorize('admin'), updateStandard)
  .delete(protect, authorize('admin'), deleteStandard);

module.exports = router;
