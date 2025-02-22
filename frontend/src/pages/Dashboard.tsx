import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { checkAuth, logout } from '../store/slices/authSlice';
import { 
  fetchTasks, 
  fetchUsers, 
  createTask, 
  updateTask, 
  deleteTask,
  setFilter 
} from '../store/slices/taskSlice';
import { Task } from '../services/api';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  // Get state from Redux
  const { user } = useAppSelector(state => state.auth);
  const { tasks, availableUsers, filter, loading, error } = useAppSelector(state => state.tasks);
  const [isCreating, setIsCreating] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assigneeIds: [] as string[]
  });

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        await dispatch(checkAuth()).unwrap();
        await Promise.all([
          dispatch(fetchTasks()),
          dispatch(fetchUsers())
        ]);
      } catch (error) {
        navigate('/login');
      }
    };
    initializeDashboard();
  }, [dispatch, navigate]);

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(createTask(newTask)).unwrap();
      setNewTask({ title: '', description: '', assigneeIds: [] });
      setIsCreating(false);
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const handleUpdateStatus = async (taskId: string, status: Task['status']) => {
    try {
      await dispatch(updateTask({ id: taskId, data: { status } })).unwrap();
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await dispatch(deleteTask(taskId)).unwrap();
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter.status && task.status !== filter.status) return false;
    if (filter.assigneeId && !task.assignees.some(a => a.id === filter.assigneeId)) return false;
    return true;
  });

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Task Management</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Welcome, {user.name}</span>
            <button onClick={handleLogout} className="btn-secondary">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {error && (
          <div className="rounded-md bg-red-50 p-4 mb-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        <div className="mb-6 flex flex-wrap gap-4">
          <select
            className="input max-w-xs"
            value={filter.status || ''}
            onChange={e => dispatch(setFilter({ ...filter, status: e.target.value as Task['status'] || undefined }))}
          >
            <option value="">All Statuses</option>
            <option value="TODO">Todo</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>

          <select
            className="input max-w-xs"
            value={filter.assigneeId || ''}
            onChange={e => dispatch(setFilter({ ...filter, assigneeId: e.target.value || undefined }))}
          >
            <option value="">All Assignees</option>
            {availableUsers.map(user => (
              <option key={user.id} value={user.id}>{user.name}</option>
            ))}
          </select>

          <button
            onClick={() => setIsCreating(true)}
            className="btn-primary flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            New Task
          </button>
        </div>

        {isCreating && (
          <div className="mb-6 card">
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label htmlFor="title" className="label">Title</label>
                <input
                  type="text"
                  id="title"
                  className="input"
                  value={newTask.title}
                  onChange={e => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="label">Description</label>
                <textarea
                  id="description"
                  className="input"
                  value={newTask.description}
                  onChange={e => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>

              <div>
                <label htmlFor="assignees" className="label">Assignees</label>
                <select
                  id="assignees"
                  className="input"
                  multiple
                  value={newTask.assigneeIds}
                  onChange={e => setNewTask(prev => ({
                    ...prev,
                    assigneeIds: Array.from(e.target.selectedOptions, option => option.value)
                  }))}
                >
                  {availableUsers.map(user => (
                    <option key={user.id} value={user.id}>{user.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create Task
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTasks.map(task => (
            <div key={task.id} className="card">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium">{task.title}</h3>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
              
              {task.description && (
                <p className="mt-2 text-gray-600">{task.description}</p>
              )}

              <div className="mt-4">
                <label className="label">Status</label>
                <select
                  className="input"
                  value={task.status}
                  onChange={e => handleUpdateStatus(task.id, e.target.value as Task['status'])}
                >
                  <option value="TODO">Todo</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="DONE">Done</option>
                </select>
              </div>

              <div className="mt-4">
                <label className="label">Assignees</label>
                <div className="flex flex-wrap gap-2">
                  {task.assignees.map(assignee => (
                    <span
                      key={assignee.id}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                    >
                      {assignee.name}
                    </span>
                  ))}
                  {task.assignees.length === 0 && (
                    <span className="text-gray-500 text-sm">No assignees</span>
                  )}
                </div>
              </div>

              <div className="mt-4 text-sm text-gray-500">
                Created by: {task.createdBy.name}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
} 