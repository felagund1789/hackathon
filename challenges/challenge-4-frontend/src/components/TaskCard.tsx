import { Link } from 'react-router-dom';
import { Task } from '../types/task';
import { PRIORITY_COLORS, STATUS_BADGE_COLORS, STATUS_LABELS } from '../constants/taskColors';

interface TaskCardProps {
  task: Task;
  isSelected?: boolean;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string, taskTitle: string) => void;
}

export function TaskCard({ task, isSelected, onEdit, onDelete }: TaskCardProps): JSX.Element {
  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit?.(task);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete?.(task.id, task.title);
  };

  const content = (
    <article className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md dark:hover:shadow-lg transition-shadow dark:shadow-black/30 flex flex-col h-full ${
      isSelected ? 'ring-2 ring-blue-500' : ''
    }`}>
      {/* Content section with padding */}
      <div className="p-4 flex flex-col flex-1">
        {/* Title and Status */}
        <div className="flex items-center justify-between gap-2 mb-1">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white line-clamp-2">
            {task.title}
          </h3>
          <span className={`inline-block px-2 py-1 text-sm font-medium rounded flex-shrink-0 ${STATUS_BADGE_COLORS[task.status]}`}>
            {STATUS_LABELS[task.status]}
          </span>
        </div>

        {/* Assignee */}
        <span className="text-xs text-gray-600 dark:text-gray-400 font-medium mb-1">Assignee: {task.assignee}</span>

        {/* Description */}
        {task.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2 flex-1">
            {task.description}
          </p>
        )}

        {/* Priority and Due Date */}
        <div className="flex items-center gap-2 pt-2">
          <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded ${PRIORITY_COLORS[task.priority]}`}>
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </span>
          {task.dueDate && (
            <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">Due: {formatDate(task.dueDate)}</span>
          )}
        </div>
      </div>

      {/* Footer with action buttons */}
      {(onEdit || onDelete) && (
        <div className="px-4 py-3 flex justify-end gap-2">
          {onEdit && (
            <button
              onClick={handleEditClick}
              className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 transition-colors"
              title="Edit task"
              aria-label="Edit task"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={handleDeleteClick}
              className="px-3 py-1.5 bg-red-500 dark:bg-red-600 text-white font-medium rounded-lg hover:bg-red-600 dark:hover:bg-red-700 disabled:opacity-50 transition-colors"
              title="Delete task"
              aria-label="Delete task"
            >
              Delete
            </button>
          )}
        </div>
      )}
    </article>
  );

  return (
    <Link
      to={`/tasks/${task.id}`}
      className="block focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
    >
      {content}
    </Link>
  );
}
