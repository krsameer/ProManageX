const Comment = require('../models/Comment');
const Issue = require('../models/Issue');
const Project = require('../models/Project');
const Activity = require('../models/Activity');

// @desc    Create new comment
// @route   POST /api/comments
// @access  Private
exports.createComment = async (req, res) => {
  try {
    const { issue, content } = req.body;

    // Verify issue exists and user has access
    const issueDoc = await Issue.findById(issue).populate('project');
    if (!issueDoc) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    const project = await Project.findById(issueDoc.project._id);
    const hasAccess = project.owner.toString() === req.user.id ||
      project.members.some(m => m.user.toString() === req.user.id);

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const comment = await Comment.create({
      issue,
      user: req.user.id,
      content
    });

    const populatedComment = await Comment.findById(comment._id)
      .populate('user', 'name email avatar');

    // Create activity log
    await Activity.create({
      issue,
      user: req.user.id,
      action: 'commented',
      description: 'Added a comment'
    });

    res.status(201).json({
      success: true,
      comment: populatedComment
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get comments for an issue
// @route   GET /api/comments/issue/:issueId
// @access  Private
exports.getCommentsByIssue = async (req, res) => {
  try {
    const { issueId } = req.params;

    // Verify issue exists and user has access
    const issue = await Issue.findById(issueId).populate('project');
    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    const project = await Project.findById(issue.project._id);
    const hasAccess = project.owner.toString() === req.user.id ||
      project.members.some(m => m.user.toString() === req.user.id);

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const comments = await Comment.find({ issue: issueId })
      .populate('user', 'name email avatar')
      .sort('createdAt');

    res.status(200).json({
      success: true,
      count: comments.length,
      comments
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update comment
// @route   PUT /api/comments/:id
// @access  Private
exports.updateComment = async (req, res) => {
  try {
    let comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user owns the comment
    if (comment.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this comment' });
    }

    const { content } = req.body;

    comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { content },
      { new: true, runValidators: true }
    ).populate('user', 'name email avatar');

    res.status(200).json({
      success: true,
      comment
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user owns the comment
    if (comment.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    await Comment.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
