const express = require('express');
const router = express.Router();
const {
  getInspections,
  getInspectionById,
  createInspection,
  deleteInspection,
} = require('../controllers/inspectionController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
  .get(getInspections)
  .post(protect, authorize('admin', 'inspector'), upload.array('evidence', 10), createInspection);

router.route('/:id')
  .get(getInspectionById)
  .delete(protect, authorize('admin'), deleteInspection);

module.exports = router;
