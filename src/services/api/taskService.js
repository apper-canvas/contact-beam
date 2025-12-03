import mockTasks from '@/services/mockData/tasks.json';

let tasks = [...mockTasks];
let nextId = Math.max(...tasks.map(task => task.Id)) + 1;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const taskService = {
  async getAll() {
    await delay(300);
    return tasks.map(task => ({ ...task }));
  },

  async getById(id) {
    await delay(200);
    const task = tasks.find(t => t.Id === parseInt(id));
    return task ? { ...task } : null;
  },

  async create(taskData) {
    await delay(400);
    
    if (!taskData.title?.trim()) {
      throw new Error('Task title is required');
    }

    const newTask = {
      Id: nextId++,
      title: taskData.title.trim(),
      description: taskData.description?.trim() || '',
      dueDate: taskData.dueDate || '',
      priority: taskData.priority || 'Medium',
      status: taskData.status || 'Pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    tasks.push(newTask);
    return { ...newTask };
  },

  async update(id, taskData) {
    await delay(350);
    
    const index = tasks.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Task not found');
    }

    if (!taskData.title?.trim()) {
      throw new Error('Task title is required');
    }

    const updatedTask = {
      ...tasks[index],
      title: taskData.title.trim(),
      description: taskData.description?.trim() || '',
      dueDate: taskData.dueDate || '',
      priority: taskData.priority || 'Medium',
      status: taskData.status || 'Pending',
      updatedAt: new Date().toISOString()
    };

    tasks[index] = updatedTask;
    return { ...updatedTask };
  },

  async delete(id) {
    await delay(250);
    
    const index = tasks.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Task not found');
    }

    const deletedTask = tasks[index];
    tasks.splice(index, 1);
    return { ...deletedTask };
  },

  // Helper methods for task management
  async updateStatus(id, status) {
    await delay(200);
    
    const index = tasks.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Task not found');
    }

    tasks[index] = {
      ...tasks[index],
      status,
      updatedAt: new Date().toISOString()
    };

    return { ...tasks[index] };
  },

  async getByStatus(status) {
    await delay(250);
    return tasks
      .filter(task => task.status === status)
      .map(task => ({ ...task }));
  },

  async getByPriority(priority) {
    await delay(250);
    return tasks
      .filter(task => task.priority === priority)
      .map(task => ({ ...task }));
  },

  async searchTasks(query) {
    await delay(300);
    const searchTerm = query.toLowerCase().trim();
    
    if (!searchTerm) return tasks.map(task => ({ ...task }));

    return tasks
      .filter(task => 
        task.title.toLowerCase().includes(searchTerm) ||
        task.description.toLowerCase().includes(searchTerm)
      )
      .map(task => ({ ...task }));
  },

  // Statistics methods
  async getTaskStats() {
    await delay(150);
    
    const stats = {
      total: tasks.length,
      pending: tasks.filter(t => t.status === 'Pending').length,
      inProgress: tasks.filter(t => t.status === 'In Progress').length,
      completed: tasks.filter(t => t.status === 'Completed').length,
      highPriority: tasks.filter(t => t.priority === 'High').length,
      mediumPriority: tasks.filter(t => t.priority === 'Medium').length,
      lowPriority: tasks.filter(t => t.priority === 'Low').length,
      overdue: tasks.filter(t => {
        if (!t.dueDate) return false;
        return new Date(t.dueDate) < new Date() && t.status !== 'Completed';
      }).length
    };

    return stats;
  }
};

export default taskService;