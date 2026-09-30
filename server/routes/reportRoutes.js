const express = require('express');
const router = express.Router();
const { getInspectionReport } = require('../controllers/reportController');

router.get('/inspection/:id', getInspectionReport);

module.exports = router;
