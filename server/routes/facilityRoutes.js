const express = require('express');
const router = express.Router();
const {
  getFacilities,
  getFacilityById,
  createFacility,
  updateFacility,
  deleteFacility,
} = require('../controllers/facilityController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(getFacilities)
  .post(protect, authorize('admin'), createFacility);

router.route('/:id')
  .get(getFacilityById)
  .put(protect, authorize('admin', 'facility_manager'), updateFacility)
  .delete(protect, authorize('admin'), deleteFacility);

module.exports = router;
