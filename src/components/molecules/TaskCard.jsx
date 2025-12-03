import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const TaskCard = ({ task, onEdit, onDelete, onStatusChange }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'border-l-red-500 bg-red-50';
      case 'Medium':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'Low':
        return 'border-l-green-500 bg-green-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isOverdue = () => {
    if (!task.dueDate || task.status === 'Completed') return false;
    return new Date(task.dueDate) < new Date();
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border-l-4 p-4 hover:shadow-md transition-all duration-200 ${getPriorityColor(task.priority)}`}>
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-gray-900 line-clamp-2 flex-1 mr-2">
          {task.title}
        </h3>
        <span className={`px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${getStatusColor(task.status)}`}>
          {task.status}
        </span>
      </div>

      {task.description && (
        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <ApperIcon name="Calendar" size={14} />
            <span className={isOverdue() ? 'text-red-600 font-medium' : ''}>
              {formatDate(task.dueDate)}
            </span>
            {isOverdue() && (
              <ApperIcon name="AlertCircle" size={14} className="text-red-500" />
            )}
          </div>
          <div className="flex items-center space-x-1">
            <ApperIcon name="Flag" size={14} />
            <span>{task.priority}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onEdit(task)}
            className="text-blue-600 hover:bg-blue-50"
          >
            <ApperIcon name="Edit2" size={14} />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(task)}
            className="text-red-600 hover:bg-red-50"
          >
            <ApperIcon name="Trash2" size={14} />
          </Button>
        </div>
        
        {task.status !== 'Completed' && (
          <Button
            size="sm"
            onClick={() => onStatusChange(task.Id, 'Completed')}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <ApperIcon name="Check" size={14} className="mr-1" />
            Complete
          </Button>
        )}
      </div>
    </div>
  );
};

export default TaskCard;