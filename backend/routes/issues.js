const express = require('express');
const router = express.Router();
const {
  createIssue,
  getIssuesByProject,
  getIssue,
  updateIssue,
  updateIssueStatus,
  deleteIssue,
  getIssueActivities
} = require('../controllers/issueController');
const { protect } = require('../middleware/auth');

router.route('/')
  .post(protect, createIssue);

router.route('/project/:projectId')
  .get(protect, getIssuesByProject);

router.route('/:id')
  .get(protect, getIssue)
  .put(protect, updateIssue)
  .delete(protect, deleteIssue);

router.route('/:id/status')
  .patch(protect, updateIssueStatus);

router.route('/:id/activities')
  .get(protect, getIssueActivities);

module.exports = router;
