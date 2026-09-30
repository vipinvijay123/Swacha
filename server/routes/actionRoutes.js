const express = require('express');
const router = express.Router();
const {
  getCorrectiveActions,
  getActionById,
  createCorrectiveAction,
  updateCorrectiveAction,
} = require('../controllers/actionController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
  .get(getCorrectiveActions)
  .post(protect, createCorrectiveAction);

router.route('/:id')
  .get(getActionById)
  .put(protect, upload.array('evidence', 5), updateCorrectiveAction);

module.exports = router;
