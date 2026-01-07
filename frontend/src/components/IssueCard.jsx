import { useState } from 'react';
import { FiAlertCircle, FiUser, FiTag } from 'react-icons/fi';
import IssueDetailModal from './IssueDetailModal';

const IssueCard = ({ issue, onUpdate }) => {
  const [showDetail, setShowDetail] = useState(false);

  const priorityColors = {
    Low: 'badge-low',
    Medium: 'badge-medium',
    High: 'badge-high',
    Critical: 'badge-critical'
  };

  return (
    <>
      <div
        onClick={() => setShowDetail(true)}
        className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
      >
        <h4 className="font-medium text-gray-900 mb-2 line-clamp-2">
          {issue.title}
        </h4>
        
        {issue.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {issue.description}
          </p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`badge ${priorityColors[issue.priority]}`}>
              <FiAlertCircle className="inline mr-1" size={12} />
              {issue.priority}
            </span>
            
            {issue.tags && issue.tags.length > 0 && (
              <span className="badge badge-low">
                <FiTag className="inline mr-1" size={12} />
                {issue.tags[0]}
              </span>
            )}
          </div>

          {issue.assignee && (
            <div className="flex items-center gap-1" title={issue.assignee.name}>
              <FiUser size={14} className="text-gray-500" />
              <span className="text-xs text-gray-600 truncate max-w-[80px]">
                {issue.assignee.name}
              </span>
            </div>
          )}
        </div>
      </div>

      {showDetail && (
        <IssueDetailModal
          issueId={issue._id}
          onClose={() => setShowDetail(false)}
          onUpdate={() => {
            onUpdate();
            setShowDetail(false);
          }}
        />
      )}
    </>
  );
};

export default IssueCard;
