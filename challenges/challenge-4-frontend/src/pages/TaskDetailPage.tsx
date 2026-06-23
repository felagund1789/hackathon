import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTask } from '../context/TaskContext';
import { STATUS_LABELS, PRIORITY_LABELS } from '../constants/taskColors';
import { TaskEditForm } from '../components/TaskEditForm';
import { TaskDeleteConfirm } from '../components/TaskDeleteConfirm';

export function TaskDetailPage(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state } = useTask();
  const task = state.tasks.find((t) => t.id === id);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleEdit = () => {
    setShowEditForm(true);
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteComplete = () => {
    setShowDeleteConfirm(false);
    navigate('/tasks');
  };

  if (!task) {
    return (
      <main className="flex-1 pt-16 md:ml-60 lg:ml-60">
        <div className="p-3 sm:p-6 lg:p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Task Not Found</h1>
          <p className="text-gray-600 mb-4">The task you're looking for doesn't exist.</p>
          <Link to="/tasks" className="text-blue-600 hover:text-blue-700 font-medium">
            Back to Task List
          </Link>
        </div>
      </main>
    );
  }

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <main className="flex-1 pt-16 md:ml-60 lg:ml-60">
      <div className="p-3 sm:p-6 lg:p-8">
        <Link to="/tasks" className="text-blue-600 hover:text-blue-700 font-medium mb-6 inline-block focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1">
          ← Back to Task List
        </Link>

        <article className="bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col">
          <div className="p-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">{task.title}</h1>

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 pb-6 border-b border-gray-200">
            <div>
              <p className="text-sm text-gray-600 font-medium mb-1">Status</p>
              <p className="text-base font-semibold text-gray-900">{STATUS_LABELS[task.status]}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium mb-1">Priority</p>
              <p className="text-base font-semibold text-gray-900">{PRIORITY_LABELS[task.priority]}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium mb-1">Assignee</p>
              <p className="text-base font-semibold text-gray-900">{task.assignee}</p>
            </div>
            {task.dueDate && (
              <div>
                <p className="text-sm text-gray-600 font-medium mb-1">Due Date</p>
                <p className="text-base font-semibold text-gray-900">{formatDate(task.dueDate)}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-600 font-medium mb-1">Created</p>
              <p className="text-base font-semibold text-gray-900">{formatDate(task.createdAt)}</p>
            </div>
          </div>

            {/* Description */}
            {task.description && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
                <p className="text-gray-700 leading-relaxed">{task.description}</p>
              </div>
            )}
          </div>

          {/* Footer with action buttons */}
          <div className="border-t border-gray-200 px-6 py-4 flex justify-end gap-2">
            <button
              onClick={handleEdit}
              className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 transition-colors"
              aria-label="Edit task"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-0 transition-colors"
              aria-label="Delete task"
            >
              Delete
            </button>
          </div>
        </article>

        {/* Modals */}
        {showEditForm && task && <TaskEditForm task={task} onClose={() => setShowEditForm(false)} />}
        {showDeleteConfirm && task && (
          <TaskDeleteConfirm
            taskId={task.id}
            taskTitle={task.title}
            onClose={() => setShowDeleteConfirm(false)}
            onDeleteComplete={handleDeleteComplete}
          />
        )}
      </div>
    </main>
  );
}
