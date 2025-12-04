import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import TaskCard from "@/components/molecules/TaskCard";
const TaskList = ({ 
  tasks = [], 
  loading = false, 
  onEdit, 
  onDelete, 
  onStatusChange,
  searchTerm = '',
  statusFilter = 'All',
  sortBy = 'dueDate',
  viewMode = 'grid'
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loading />
      </div>
    );
  }

  if (!tasks.length) {
    const isFiltered = searchTerm || statusFilter !== 'All';
    
    return (
      <Empty
        icon="CheckSquare"
        title={isFiltered ? 'No tasks found' : 'No tasks yet'}
        description={
          isFiltered 
            ? 'Try adjusting your search or filter criteria'
            : 'Create your first task to get started with task management'
        }
      />
    );
  }

  // Filter and sort tasks
  let filteredTasks = [...tasks];

  // Apply search filter
  if (searchTerm) {
    filteredTasks = filteredTasks.filter(task =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Apply status filter
  if (statusFilter && statusFilter !== 'All') {
    filteredTasks = filteredTasks.filter(task => task.status === statusFilter);
  }

  // Apply sorting
  filteredTasks.sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title);
      case 'priority':
        const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      case 'status':
        return a.status.localeCompare(b.status);
      case 'dueDate':
      default:
        // Handle tasks without due dates
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
    }
  });

  const getTaskStats = () => {
    const stats = {
      total: filteredTasks.length,
      pending: filteredTasks.filter(t => t.status === 'Pending').length,
      inProgress: filteredTasks.filter(t => t.status === 'In Progress').length,
      completed: filteredTasks.filter(t => t.status === 'Completed').length,
      overdue: filteredTasks.filter(t => {
        if (!t.dueDate || t.status === 'Completed') return false;
        return new Date(t.dueDate) < new Date();
      }).length
    };
    return stats;
  };

  const stats = getTaskStats();

  return (
    <div className="space-y-6">
      {/* Task Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg p-4 text-center border">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-600">Total</div>
        </div>
        <div className="bg-white rounded-lg p-4 text-center border">
          <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
        <div className="bg-white rounded-lg p-4 text-center border">
          <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
          <div className="text-sm text-gray-600">In Progress</div>
        </div>
        <div className="bg-white rounded-lg p-4 text-center border">
          <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
        <div className="bg-white rounded-lg p-4 text-center border">
          <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
          <div className="text-sm text-gray-600">Overdue</div>
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          Showing {filteredTasks.length} of {tasks.length} tasks
        </p>
        
        {(searchTerm || statusFilter !== 'All') && (
          <div className="text-sm text-blue-600 flex items-center">
            <ApperIcon name="Filter" size={16} className="mr-1" />
            Filtered results
          </div>
        )}
      </div>

{/* Task Display - Grid or List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map(task => (
            <TaskCard
              key={task.Id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
              onStatusChange={onStatusChange}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Task
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTasks.map(task => (
                  <TaskListRow
                    key={task.Id}
                    task={task}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onStatusChange={onStatusChange}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

const TaskListRow = ({ task, onEdit, onDelete, onStatusChange }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'text-red-600 bg-red-50';
      case 'Medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'Low':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
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
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-900 line-clamp-1">
              {task.title}
            </div>
            {task.description && (
              <div className="text-sm text-gray-500 line-clamp-1">
                {task.description}
              </div>
            )}
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}>
          {task.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
          {task.priority}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center text-sm">
          <ApperIcon name="Calendar" size={14} className="mr-1 text-gray-400" />
          <span className={isOverdue() ? 'text-red-600 font-medium' : 'text-gray-900'}>
            {formatDate(task.dueDate)}
          </span>
          {isOverdue() && (
            <ApperIcon name="AlertCircle" size={14} className="ml-1 text-red-500" />
          )}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center justify-end space-x-2">
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
          {task.status !== 'Completed' && (
            <Button
              size="sm"
              onClick={() => onStatusChange(task.Id, 'Completed')}
              className="bg-green-600 hover:bg-green-700 text-white ml-2"
            >
              <ApperIcon name="Check" size={14} className="mr-1" />
              Complete
            </Button>
          )}
        </div>
      </td>
    </tr>
  );
};

export default TaskList;