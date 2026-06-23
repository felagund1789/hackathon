import { useState, useEffect } from 'react';
import { Task, TaskStatus, TaskPriority } from '../types/task';
import { useTask } from '../context/TaskContext';

interface TaskEditFormProps {
  task: Task;
  onClose: () => void;
}

export function TaskEditForm({ task, onClose }: TaskEditFormProps) {
  const { updateTask, setError, clearError, state } = useTask();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>(TaskPriority.MEDIUM);
  const [status, setStatus] = useState<TaskStatus>(TaskStatus.TODO);
  const [dueDate, setDueDate] = useState('');
  const [assignee, setAssignee] = useState('');
  const [titleError, setTitleError] = useState('');

  const assignees = ['Alice Johnson', 'Bob Smith', 'Carol Davis', 'Diana Wong', 'Evan Martinez'];

  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description || '');
    setPriority(task.priority);
    setStatus(task.status);
    setDueDate(task.dueDate ? task.dueDate.toISOString().split('T')[0] : '');
    setAssignee(task.assignee);
  }, [task]);

  const validateForm = (): boolean => {
    if (title.trim().length < 3) {
      setTitleError('Title must be at least 3 characters');
      return false;
    }
    setTitleError('');
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!validateForm()) return;

    try {
      const updatedTask: Task = {
        ...task,
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        status,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        assignee,
      };

      updateTask(updatedTask);
      onClose();
    } catch (error) {
      setError('Failed to update task. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-40">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 max-h-90vh overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Edit Task</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
            aria-label="Close dialog"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {state.error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex gap-2">
              <span className="text-red-600 font-bold">!</span>
              <div className="flex-1">
                <p className="text-sm text-red-700">{state.error}</p>
              </div>
              <button
                onClick={() => clearError()}
                className="text-red-600 hover:text-red-800"
                aria-label="Dismiss error"
              >
                ×
              </button>
            </div>
          )}

          <div>
            <label htmlFor="title" className="block text-sm font-bold text-gray-700 mb-1">
              Title *
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={validateForm}
              placeholder="Task title"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                titleError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
              disabled={state.isLoading}
            />
            {titleError && <p className="text-red-600 text-sm mt-1">{titleError}</p>}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-bold text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details..."
              maxLength={500}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              disabled={state.isLoading}
            />
            <p className="text-xs text-gray-500 mt-1">{description.length}/500</p>
          </div>

          <div>
            <label htmlFor="priority" className="block text-sm font-bold text-gray-700 mb-1">
              Priority
            </label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={state.isLoading}
            >
              <option value={TaskPriority.LOW}>Low</option>
              <option value={TaskPriority.MEDIUM}>Medium</option>
              <option value={TaskPriority.HIGH}>High</option>
            </select>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-bold text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={state.isLoading}
            >
              <option value={TaskStatus.TODO}>To Do</option>
              <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
              <option value={TaskStatus.BLOCKED}>Blocked</option>
              <option value={TaskStatus.DONE}>Done</option>
            </select>
          </div>

          <div>
            <label htmlFor="dueDate" className="block text-sm font-bold text-gray-700 mb-1">
              Due Date
            </label>
            <input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={state.isLoading}
            />
          </div>

          <div>
            <label htmlFor="assignee" className="block text-sm font-bold text-gray-700 mb-1">
              Assignee
            </label>
            <select
              id="assignee"
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={state.isLoading}
            >
              {assignees.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-900 font-medium rounded-lg hover:bg-gray-300 disabled:opacity-50"
              disabled={state.isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 disabled:opacity-50"
              disabled={state.isLoading}
            >
              {state.isLoading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
