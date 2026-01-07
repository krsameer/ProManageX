const express = require('express');
const router = express.Router();
const {
  createComment,
  getCommentsByIssue,
  updateComment,
  deleteComment
} = require('../controllers/commentController');
const { protect } = require('../middleware/auth');

router.route('/')
  .post(protect, createComment);

router.route('/issue/:issueId')
  .get(protect, getCommentsByIssue);

router.route('/:id')
  .put(protect, updateComment)
  .delete(protect, deleteComment);

module.exports = router;
