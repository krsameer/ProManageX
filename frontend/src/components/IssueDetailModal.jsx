import { useState, useEffect } from 'react';
import { issueAPI, commentAPI } from '../utils/api';
import { FiX, FiEdit2, FiTrash2, FiClock, FiUser, FiMessageSquare } from 'react-icons/fi';
import { format } from 'date-fns';
import IssueModal from './IssueModal';

const IssueDetailModal = ({ issueId, onClose, onUpdate }) => {
  const [issue, setIssue] = useState(null);
  const [comments, setComments] = useState([]);
  const [activities, setActivities] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [activeTab, setActiveTab] = useState('comments');
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIssueDetails();
  }, [issueId]);

  const fetchIssueDetails = async () => {
    try {
      const [issueRes, commentsRes, activitiesRes] = await Promise.all([
        issueAPI.getIssue(issueId),
        commentAPI.getCommentsByIssue(issueId),
        issueAPI.getIssueActivities(issueId)
      ]);

      setIssue(issueRes.data.issue);
      setComments(commentsRes.data.comments);
      setActivities(activitiesRes.data.activities);
    } catch (error) {
      console.error('Error fetching issue details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await commentAPI.createComment({
        issue: issueId,
        content: newComment
      });
      setNewComment('');
      fetchIssueDetails();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleDeleteIssue = async () => {
    if (window.confirm('Are you sure you want to delete this issue?')) {
      try {
        await issueAPI.deleteIssue(issueId);
        onUpdate();
      } catch (error) {
        console.error('Error deleting issue:', error);
      }
    }
  };

  const priorityColors = {
    Low: 'badge-low',
    Medium: 'badge-medium',
    High: 'badge-high',
    Critical: 'badge-critical'
  };

  const statusColors = {
    'To-Do': 'status-todo',
    'In-Progress': 'status-in-progress',
    'Review': 'status-review',
    'Done': 'status-done'
  };

  if (loading || !issue) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">
          <div className="text-xl">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="p-6 border-b flex justify-between items-start">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{issue.title}</h2>
              <div className="flex items-center gap-3 flex-wrap">
                <span className={`badge ${statusColors[issue.status]}`}>
                  {issue.status}
                </span>
                <span className={`badge ${priorityColors[issue.priority]}`}>
                  {issue.priority}
                </span>
                {issue.tags?.map((tag, index) => (
                  <span key={index} className="badge badge-low">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowEditModal(true)}
                className="p-2 hover:bg-gray-100 rounded"
                title="Edit issue"
              >
                <FiEdit2 className="text-gray-600" />
              </button>
              <button
                onClick={handleDeleteIssue}
                className="p-2 hover:bg-red-50 rounded"
                title="Delete issue"
              >
                <FiTrash2 className="text-red-600" />
              </button>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded">
                <FiX size={24} className="text-gray-600" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Issue Details */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Description</h3>
              <p className="text-gray-600 whitespace-pre-wrap">
                {issue.description || 'No description provided'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  <FiUser className="inline mr-1" />
                  Assignee
                </h3>
                <p className="text-gray-600">
                  {issue.assignee?.name || 'Unassigned'}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  <FiUser className="inline mr-1" />
                  Reporter
                </h3>
                <p className="text-gray-600">{issue.reporter?.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  <FiClock className="inline mr-1" />
                  Created
                </h3>
                <p className="text-gray-600">
                  {format(new Date(issue.createdAt), 'MMM dd, yyyy HH:mm')}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  <FiClock className="inline mr-1" />
                  Updated
                </h3>
                <p className="text-gray-600">
                  {format(new Date(issue.updatedAt), 'MMM dd, yyyy HH:mm')}
                </p>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b mb-4">
              <div className="flex gap-4">
                <button
                  onClick={() => setActiveTab('comments')}
                  className={`pb-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'comments'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500'
                  }`}
                >
                  <FiMessageSquare className="inline mr-1" />
                  Comments ({comments.length})
                </button>
                <button
                  onClick={() => setActiveTab('activity')}
                  className={`pb-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'activity'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500'
                  }`}
                >
                  <FiClock className="inline mr-1" />
                  Activity ({activities.length})
                </button>
              </div>
            </div>

            {/* Comments Tab */}
            {activeTab === 'comments' && (
              <div>
                <form onSubmit={handleAddComment} className="mb-6">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="input mb-2"
                    rows="3"
                    placeholder="Add a comment..."
                  />
                  <button type="submit" className="btn btn-primary btn-sm">
                    Add Comment
                  </button>
                </form>

                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment._id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">
                            {comment.user.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {format(new Date(comment.createdAt), 'MMM dd, yyyy HH:mm')}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                    </div>
                  ))}
                  {comments.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No comments yet</p>
                  )}
                </div>
              </div>
            )}

            {/* Activity Tab */}
            {activeTab === 'activity' && (
              <div className="space-y-3">
                {activities.map((activity) => (
                  <div key={activity._id} className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <FiClock className="text-primary-600" size={16} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">{activity.user.name}</span>{' '}
                        {activity.description}
                      </p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(activity.createdAt), 'MMM dd, yyyy HH:mm')}
                      </p>
                    </div>
                  </div>
                ))}
                {activities.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No activity yet</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {showEditModal && (
        <IssueModal
          projectId={issue.project._id}
          issue={issue}
          onClose={() => setShowEditModal(false)}
          onSuccess={() => {
            setShowEditModal(false);
            fetchIssueDetails();
          }}
        />
      )}
    </>
  );
};

export default IssueDetailModal;
