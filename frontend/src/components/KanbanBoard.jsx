import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { issueAPI } from '../utils/api';
import { FiPlus } from 'react-icons/fi';
import IssueCard from './IssueCard';
import IssueModal from './IssueModal';

const KanbanBoard = ({ projectId, issues, onUpdate }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('To-Do');

  const columns = [
    { id: 'To-Do', title: 'To-Do', color: 'bg-gray-100' },
    { id: 'In-Progress', title: 'In Progress', color: 'bg-blue-100' },
    { id: 'Review', title: 'Review', color: 'bg-purple-100' },
    { id: 'Done', title: 'Done', color: 'bg-green-100' }
  ];

  const getIssuesByStatus = (status) => {
    return issues.filter(issue => issue.status === status).sort((a, b) => a.position - b.position);
  };

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    // Dropped outside the list
    if (!destination) {
      return;
    }

    // No change
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newStatus = destination.droppableId;

    try {
      await issueAPI.updateIssueStatus(draggableId, {
        status: newStatus,
        position: destination.index
      });
      onUpdate();
    } catch (error) {
      console.error('Error updating issue:', error);
    }
  };

  const handleAddIssue = (status) => {
    setSelectedStatus(status);
    setShowModal(true);
  };

  return (
    <div className="h-full">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-full">
          {columns.map((column) => {
            const columnIssues = getIssuesByStatus(column.id);
            
            return (
              <div key={column.id} className="flex flex-col bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">{column.title}</h3>
                    <span className="px-2 py-1 text-xs font-medium bg-gray-200 text-gray-700 rounded-full">
                      {columnIssues.length}
                    </span>
                  </div>
                  <button
                    onClick={() => handleAddIssue(column.id)}
                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                    title="Add issue"
                  >
                    <FiPlus className="text-gray-600" />
                  </button>
                </div>

                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 space-y-3 min-h-[200px] ${
                        snapshot.isDraggingOver ? 'bg-primary-50 rounded-lg' : ''
                      }`}
                    >
                      {columnIssues.map((issue, index) => (
                        <Draggable
                          key={issue._id}
                          draggableId={issue._id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                ...provided.draggableProps.style,
                                opacity: snapshot.isDragging ? 0.8 : 1
                              }}
                            >
                              <IssueCard issue={issue} onUpdate={onUpdate} />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>

      {showModal && (
        <IssueModal
          projectId={projectId}
          initialStatus={selectedStatus}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            onUpdate();
          }}
        />
      )}
    </div>
  );
};

export default KanbanBoard;
