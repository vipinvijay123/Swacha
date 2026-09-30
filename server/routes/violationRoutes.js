const express = require('express');
const router = express.Router();
const {
  getViolations,
  getViolationById,
  createViolation,
  updateViolation,
  deleteViolation,
} = require('../controllers/violationController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(getViolations)
  .post(protect, authorize('admin', 'inspector'), createViolation);

router.route('/:id')
  .get(getViolationById)
  .put(protect, updateViolation)
  .delete(protect, authorize('admin'), deleteViolation);

module.exports = router;
