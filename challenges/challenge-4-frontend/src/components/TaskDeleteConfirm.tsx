import { useTask } from '../context/TaskContext';

interface TaskDeleteConfirmProps {
  taskId: string;
  taskTitle: string;
  onClose: () => void;
  onDeleteComplete?: () => void;
}

export function TaskDeleteConfirm({ taskId, taskTitle, onClose, onDeleteComplete }: TaskDeleteConfirmProps) {
  const { deleteTask } = useTask();

  const handleDelete = () => {
    deleteTask(taskId);
    onClose();
    onDeleteComplete?.();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-40">
      <div className="bg-white rounded-lg shadow-lg max-w-sm w-full mx-4">
        <div className="p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Delete Task</h2>
          <p className="text-gray-700 mb-6">
            Delete task <span className="font-semibold">"{taskTitle}"</span>? This cannot be undone.
          </p>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-900 font-medium rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
