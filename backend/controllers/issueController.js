const Issue = require('../models/Issue');
const Activity = require('../models/Activity');
const Project = require('../models/Project');

// Helper function to create activity log
const createActivity = async (issueId, userId, action, description, field = '', oldValue = '', newValue = '') => {
  await Activity.create({
    issue: issueId,
    user: userId,
    action,
    field,
    oldValue,
    newValue,
    description
  });
};

// @desc    Create new issue
// @route   POST /api/issues
// @access  Private
exports.createIssue = async (req, res) => {
  try {
    const { title, description, project, priority, assignee, tags, estimatedHours, startDate, dueDate } = req.body;

    // Verify user has access to project
    const projectDoc = await Project.findById(project);
    if (!projectDoc) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const hasAccess = projectDoc.owner.toString() === req.user.id ||
      projectDoc.members.some(m => m.user.toString() === req.user.id);

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Get position for new issue (last in To-Do column)
    const lastIssue = await Issue.findOne({ project, status: 'To-Do' })
      .sort('-position');
    const position = lastIssue ? lastIssue.position + 1 : 0;

    const issue = await Issue.create({
      title,
      description,
      project,
      priority,
      assignee: assignee || null,
      reporter: req.user.id,
      tags: tags || [],
      position,
      estimatedHours: estimatedHours || null,
      startDate: startDate || null,
      dueDate: dueDate || null
    });

    const populatedIssue = await Issue.findById(issue._id)
      .populate('assignee', 'name email avatar')
      .populate('reporter', 'name email avatar')
      .populate('project', 'name');

    // Create activity log
    await createActivity(
      issue._id,
      req.user.id,
      'created',
      'Issue created'
    );

    res.status(201).json({
      success: true,
      issue: populatedIssue
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all issues for a project
// @route   GET /api/issues/project/:projectId
// @access  Private
exports.getIssuesByProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Verify user has access to project
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const hasAccess = project.owner.toString() === req.user.id ||
      project.members.some(m => m.user.toString() === req.user.id);

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const issues = await Issue.find({ project: projectId })
      .populate('assignee', 'name email avatar')
      .populate('reporter', 'name email avatar')
      .sort('position');

    res.status(200).json({
      success: true,
      count: issues.length,
      issues
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single issue
// @route   GET /api/issues/:id
// @access  Private
exports.getIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate('assignee', 'name email avatar')
      .populate('reporter', 'name email avatar')
      .populate('project', 'name');

    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    // Verify user has access to project
    const project = await Project.findById(issue.project._id);
    const hasAccess = project.owner.toString() === req.user.id ||
      project.members.some(m => m.user.toString() === req.user.id);

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.status(200).json({
      success: true,
      issue
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update issue
// @route   PUT /api/issues/:id
// @access  Private
exports.updateIssue = async (req, res) => {
  try {
    let issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    // Verify user has access to project
    const project = await Project.findById(issue.project);
    const hasAccess = project.owner.toString() === req.user.id ||
      project.members.some(m => m.user.toString() === req.user.id);

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { title, description, status, priority, assignee, tags, estimatedHours, loggedHours, startDate, dueDate, finishDate } = req.body;

    // Track changes for activity log
    if (status && status !== issue.status) {
      await createActivity(
        issue._id,
        req.user.id,
        'status_changed',
        `Status changed from ${issue.status} to ${status}`,
        'status',
        issue.status,
        status
      );
    }

    if (priority && priority !== issue.priority) {
      await createActivity(
        issue._id,
        req.user.id,
        'priority_changed',
        `Priority changed from ${issue.priority} to ${priority}`,
        'priority',
        issue.priority,
        priority
      );
    }

    if (assignee !== undefined && assignee !== issue.assignee?.toString()) {
      const oldAssignee = issue.assignee ? issue.assignee.toString() : 'Unassigned';
      const newAssignee = assignee || 'Unassigned';
      await createActivity(
        issue._id,
        req.user.id,
        'assignee_changed',
        'Assignee changed',
        'assignee',
        oldAssignee,
        newAssignee
      );
    }

    // Auto-set finishDate when status changes to Done
    let autoFinishDate = finishDate;
    if (status === 'Done' && issue.status !== 'Done' && !finishDate) {
      autoFinishDate = new Date();
    } else if (status !== 'Done') {
      autoFinishDate = null;
    }

    // Update issue
    issue = await Issue.findByIdAndUpdate(
      req.params.id,
      { 
        title, 
        description, 
        status, 
        priority, 
        assignee: assignee || null, 
        tags,
        estimatedHours: estimatedHours !== undefined ? estimatedHours : issue.estimatedHours,
        loggedHours: loggedHours !== undefined ? loggedHours : issue.loggedHours,
        startDate: startDate !== undefined ? startDate : issue.startDate,
        dueDate: dueDate !== undefined ? dueDate : issue.dueDate,
        finishDate: autoFinishDate !== undefined ? autoFinishDate : issue.finishDate
      },
      { new: true, runValidators: true }
    )
      .populate('assignee', 'name email avatar')
      .populate('reporter', 'name email avatar')
      .populate('project', 'name');

    res.status(200).json({
      success: true,
      issue
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update issue status (for drag and drop)
// @route   PATCH /api/issues/:id/status
// @access  Private
exports.updateIssueStatus = async (req, res) => {
  try {
    const { status, position } = req.body;
    
    let issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    // Verify user has access
    const project = await Project.findById(issue.project);
    const hasAccess = project.owner.toString() === req.user.id ||
      project.members.some(m => m.user.toString() === req.user.id);

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const oldStatus = issue.status;

    // Update issue status and position
    issue.status = status;
    issue.position = position !== undefined ? position : issue.position;
    await issue.save();

    // Create activity log
    if (oldStatus !== status) {
      await createActivity(
        issue._id,
        req.user.id,
        'status_changed',
        `Status changed from ${oldStatus} to ${status}`,
        'status',
        oldStatus,
        status
      );
    }

    const updatedIssue = await Issue.findById(issue._id)
      .populate('assignee', 'name email avatar')
      .populate('reporter', 'name email avatar')
      .populate('project', 'name');

    res.status(200).json({
      success: true,
      issue: updatedIssue
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete issue
// @route   DELETE /api/issues/:id
// @access  Private
exports.deleteIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    // Verify user has access
    const project = await Project.findById(issue.project);
    const hasAccess = project.owner.toString() === req.user.id ||
      project.members.some(m => m.user.toString() === req.user.id);

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await Issue.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Issue deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get activities for an issue
// @route   GET /api/issues/:id/activities
// @access  Private
exports.getIssueActivities = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    const activities = await Activity.find({ issue: req.params.id })
      .populate('user', 'name email avatar')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: activities.length,
      activities
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
