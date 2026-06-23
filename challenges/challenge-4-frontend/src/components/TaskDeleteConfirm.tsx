import { useEffect } from 'react';
import { useTask } from '../context/TaskContext';

interface TaskDeleteConfirmProps {
  taskId: string;
  taskTitle: string;
  onClose: () => void;
  onDeleteComplete?: () => void;
}

export function TaskDeleteConfirm({ taskId, taskTitle, onClose, onDeleteComplete }: TaskDeleteConfirmProps) {
  const { deleteTask } = useTask();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleDelete = () => {
    deleteTask(taskId);
    onClose();
    onDeleteComplete?.();
  };

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/60 flex items-center justify-center z-40">
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg dark:shadow-black/40 max-w-sm w-full mx-4 transition-colors">
        <div className="p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Delete Task</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Delete task <span className="font-semibold">"{taskTitle}"</span>? This cannot be undone.
          </p>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 px-4 py-2 bg-red-500 dark:bg-red-600 text-white font-medium rounded-lg hover:bg-red-600 dark:hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
