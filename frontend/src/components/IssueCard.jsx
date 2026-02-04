import { useState } from 'react';
import { FiAlertCircle, FiUser, FiTag, FiCalendar, FiClock } from 'react-icons/fi';
import { format, isPast, isToday } from 'date-fns';
import IssueDetailModal from './IssueDetailModal';

const IssueCard = ({ issue, onUpdate }) => {
  const [showDetail, setShowDetail] = useState(false);

  const priorityColors = {
    Low: 'badge-low',
    Medium: 'badge-medium',
    High: 'badge-high',
    Critical: 'badge-critical'
  };

  const getDueDateStatus = () => {
    if (!issue.dueDate || issue.status === 'Done') return null;
    const dueDate = new Date(issue.dueDate);
    if (isPast(dueDate) && !isToday(dueDate)) return 'overdue';
    if (isToday(dueDate)) return 'today';
    return 'upcoming';
  };

  const dueDateStatus = getDueDateStatus();

  return (
    <>
      <div
        onClick={() => setShowDetail(true)}
        className={`bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer ${
          dueDateStatus === 'overdue' ? 'border-red-300' : 'border-gray-200'
        }`}
      >
        <h4 className="font-medium text-gray-900 mb-2 line-clamp-2">
          {issue.title}
        </h4>
        
        {issue.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {issue.description}
          </p>
        )}

        {/* Due Date Display */}
        {issue.dueDate && issue.status !== 'Done' && (
          <div className={`flex items-center gap-1 text-xs mb-2 ${
            dueDateStatus === 'overdue' ? 'text-red-600' :
            dueDateStatus === 'today' ? 'text-orange-600' :
            'text-gray-500'
          }`}>
            <FiCalendar size={12} />
            <span>
              {dueDateStatus === 'overdue' && 'Overdue: '}
              {dueDateStatus === 'today' && 'Due Today'}
              {dueDateStatus === 'upcoming' && `Due: ${format(new Date(issue.dueDate), 'MMM dd')}`}
              {dueDateStatus === 'overdue' && format(new Date(issue.dueDate), 'MMM dd')}
            </span>
          </div>
        )}

        {/* Time Tracking Display */}
        {(issue.estimatedHours || issue.loggedHours > 0) && (
          <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
            <FiClock size={12} />
            <span>
              {issue.loggedHours || 0}h
              {issue.estimatedHours && ` / ${issue.estimatedHours}h`}
            </span>
            {issue.estimatedHours && (
              <div className="flex-1 ml-2 bg-gray-200 rounded-full h-1.5 max-w-[60px]">
                <div 
                  className={`h-1.5 rounded-full ${
                    (issue.loggedHours / issue.estimatedHours) > 1 
                      ? 'bg-red-500' 
                      : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min((issue.loggedHours / issue.estimatedHours) * 100, 100)}%` }}
                />
              </div>
            )}
          </div>
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
