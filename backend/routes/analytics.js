const express = require('express');
const router = express.Router();
const {
  getProjectAnalytics,
  getUserAnalytics
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

router.get('/:projectId', protect, getProjectAnalytics);
router.get('/user/me', protect, getUserAnalytics);

module.exports = router;
