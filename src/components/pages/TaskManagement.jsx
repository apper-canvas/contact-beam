import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import { create, getAll, update } from "@/services/api/dealService";
import taskService from "@/services/api/taskService";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import TaskForm from "@/components/molecules/TaskForm";
import TaskList from "@/components/molecules/TaskList";
import ConfirmDialog from "@/components/molecules/ConfirmDialog";

const TaskManagement = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('dueDate');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  
  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  
  // Delete confirmation
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Get the outlet context to register modal handlers
  const outletContext = useOutletContext();

  // Register modal handlers with Layout
  useEffect(() => {
    if (outletContext?.setPageModalHandlers) {
      outletContext.setPageModalHandlers(prev => ({
        ...prev,
        handleCreateTask: handleCreateTask
      }));
    }
  }, [outletContext]);
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await taskService.getAll();
      setTasks(data);
    } catch (err) {
      console.error('Failed to load tasks:', err);
      setError('Failed to load tasks. Please try again.');
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = () => {
    setEditingTask(null);
    setIsFormOpen(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTask(null);
  };

  const handleFormSubmit = async (formData) => {
    try {
      setIsFormLoading(true);
      
      if (editingTask) {
        const updatedTask = await taskService.update(editingTask.Id, formData);
        setTasks(prev => prev.map(task => 
          task.Id === editingTask.Id ? updatedTask : task
        ));
        toast.success('Task updated successfully!');
      } else {
        const newTask = await taskService.create(formData);
        setTasks(prev => [newTask, ...prev]);
        toast.success('Task created successfully!');
      }
      
      handleCloseForm();
    } catch (err) {
      console.error('Failed to save task:', err);
      toast.error(err.message || 'Failed to save task');
    } finally {
      setIsFormLoading(false);
    }
  };

  const handleDeleteClick = (task) => {
    setTaskToDelete(task);
  };

  const handleConfirmDelete = async () => {
    if (!taskToDelete) return;
    
    try {
      setIsDeleting(true);
      await taskService.delete(taskToDelete.Id);
      setTasks(prev => prev.filter(task => task.Id !== taskToDelete.Id));
      toast.success('Task deleted successfully!');
      setTaskToDelete(null);
    } catch (err) {
      console.error('Failed to delete task:', err);
      toast.error(err.message || 'Failed to delete task');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setTaskToDelete(null);
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const updatedTask = await taskService.updateStatus(taskId, newStatus);
      setTasks(prev => prev.map(task => 
        task.Id === taskId ? updatedTask : task
      ));
      toast.success(`Task marked as ${newStatus.toLowerCase()}!`);
    } catch (err) {
      console.error('Failed to update task status:', err);
      toast.error('Failed to update task status');
    }
  };

  const handleSortChange = (field) => {
    setSortBy(field);
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorView message={error} onRetry={loadTasks} />;
  }

  const statusOptions = [
    { value: 'All', label: 'All Tasks' },
    { value: 'Pending', label: 'Pending' },
    { value: 'In Progress', label: 'In Progress' },
    { value: 'Completed', label: 'Completed' }
  ];

  const sortOptions = [
    { value: 'dueDate', label: 'Due Date' },
    { value: 'title', label: 'Title' },
    { value: 'priority', label: 'Priority' },
    { value: 'status', label: 'Status' }
  ];

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
{/* Header Section */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
            <p className="text-gray-600 mt-1">
              Manage and track your tasks
            </p>
          </div>
          <Button onClick={handleCreateTask} className="bg-blue-600 hover:bg-blue-700 min-h-[44px]">
            <ApperIcon name="Plus" size={16} className="mr-2" />
            Create Task
          </Button>
        </div>

        {/* Search, Filters, and View Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Left: Search and Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 flex-1">
            <div className="flex-1 max-w-md">
              <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search tasks by title or description..."
                className="w-full"
              />
            </div>
            
            <div className="flex space-x-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    Sort by {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Right: View Toggle */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                title="Grid view"
              >
                <ApperIcon name="Grid3X3" size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                title="List view"
              >
                <ApperIcon name="List" size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
<div className="flex-1 overflow-y-auto">
        <TaskList
          tasks={tasks}
          loading={loading}
          onEdit={handleEditTask}
          onDelete={handleDeleteClick}
          onStatusChange={handleStatusChange}
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          sortBy={sortBy}
          viewMode={viewMode}
        />
      </div>

      {/* Task Form Modal */}
      <TaskForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
        initialData={editingTask}
        isLoading={isFormLoading}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!taskToDelete}
        title="Delete Task"
        message={`Are you sure you want to delete "${taskToDelete?.title}"? This action cannot be undone.`}
        confirmLabel="Delete Task"
        confirmVariant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default TaskManagement;