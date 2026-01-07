const Issue = require('../models/Issue');
const Project = require('../models/Project');

// @desc    Get analytics for a project
// @route   GET /api/analytics/:projectId
// @access  Private
exports.getProjectAnalytics = async (req, res) => {
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

    // Get all issues for the project
    const issues = await Issue.find({ project: projectId })
      .populate('assignee', 'name email avatar');

    // Total issues
    const totalIssues = issues.length;

    // Issues by status
    const issuesByStatus = {
      'To-Do': issues.filter(i => i.status === 'To-Do').length,
      'In-Progress': issues.filter(i => i.status === 'In-Progress').length,
      'Review': issues.filter(i => i.status === 'Review').length,
      'Done': issues.filter(i => i.status === 'Done').length
    };

    // Issues by priority
    const issuesByPriority = {
      'Low': issues.filter(i => i.priority === 'Low').length,
      'Medium': issues.filter(i => i.priority === 'Medium').length,
      'High': issues.filter(i => i.priority === 'High').length,
      'Critical': issues.filter(i => i.priority === 'Critical').length
    };

    // Issues by assignee (member-wise distribution)
    const issuesByAssignee = {};
    const unassignedCount = issues.filter(i => !i.assignee).length;
    
    issues.forEach(issue => {
      if (issue.assignee) {
        const assigneeId = issue.assignee._id.toString();
        if (!issuesByAssignee[assigneeId]) {
          issuesByAssignee[assigneeId] = {
            user: {
              id: issue.assignee._id,
              name: issue.assignee.name,
              email: issue.assignee.email,
              avatar: issue.assignee.avatar
            },
            count: 0,
            byStatus: {
              'To-Do': 0,
              'In-Progress': 0,
              'Review': 0,
              'Done': 0
            }
          };
        }
        issuesByAssignee[assigneeId].count++;
        issuesByAssignee[assigneeId].byStatus[issue.status]++;
      }
    });

    // Convert to array
    const memberWiseDistribution = Object.values(issuesByAssignee);

    // Completion rate
    const completedIssues = issuesByStatus['Done'];
    const completionRate = totalIssues > 0 
      ? ((completedIssues / totalIssues) * 100).toFixed(2)
      : 0;

    res.status(200).json({
      success: true,
      analytics: {
        totalIssues,
        issuesByStatus,
        issuesByPriority,
        memberWiseDistribution,
        unassignedCount,
        completionRate: parseFloat(completionRate)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get user's personal analytics
// @route   GET /api/analytics/user/me
// @access  Private
exports.getUserAnalytics = async (req, res) => {
  try {
    // Get all issues assigned to the user
    const issues = await Issue.find({ assignee: req.user.id })
      .populate('project', 'name');

    const totalAssigned = issues.length;

    // Issues by status
    const issuesByStatus = {
      'To-Do': issues.filter(i => i.status === 'To-Do').length,
      'In-Progress': issues.filter(i => i.status === 'In-Progress').length,
      'Review': issues.filter(i => i.status === 'Review').length,
      'Done': issues.filter(i => i.status === 'Done').length
    };

    // Issues by priority
    const issuesByPriority = {
      'Low': issues.filter(i => i.priority === 'Low').length,
      'Medium': issues.filter(i => i.priority === 'Medium').length,
      'High': issues.filter(i => i.priority === 'High').length,
      'Critical': issues.filter(i => i.priority === 'Critical').length
    };

    // Issues by project
    const issuesByProject = {};
    issues.forEach(issue => {
      const projectId = issue.project._id.toString();
      if (!issuesByProject[projectId]) {
        issuesByProject[projectId] = {
          project: {
            id: issue.project._id,
            name: issue.project.name
          },
          count: 0
        };
      }
      issuesByProject[projectId].count++;
    });

    const projectDistribution = Object.values(issuesByProject);

    res.status(200).json({
      success: true,
      analytics: {
        totalAssigned,
        issuesByStatus,
        issuesByPriority,
        projectDistribution
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
