const express = require('express');
const router = express.Router();
const { getDashboardAnalytics } = require('../controllers/analyticsController');

router.get('/dashboard', getDashboardAnalytics);
router.get('/compliance', getDashboardAnalytics);
router.get('/violations', getDashboardAnalytics);

module.exports = router;
