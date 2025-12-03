import React from 'react';
import TaskCard from './TaskCard';
import Loading from '@/components/ui/Loading';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';

const TaskList = ({ 
  tasks = [], 
  loading = false, 
  onEdit, 
  onDelete, 
  onStatusChange,
  searchTerm = '',
  statusFilter = 'All',
  sortBy = 'dueDate'
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

      {/* Task Grid */}
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
    </div>
  );
};

export default TaskList;