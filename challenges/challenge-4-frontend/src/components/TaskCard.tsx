import { Link } from 'react-router-dom';
import { Task } from '../types/task';
import { PRIORITY_COLORS, STATUS_BADGE_COLORS, STATUS_LABELS } from '../constants/taskColors';

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps): JSX.Element {
  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Link
      to={`/tasks/${task.id}`}
      className="block focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
    >
      <article className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow p-4 flex flex-col h-full">
        {/* Title and status */}
        <div className="flex items-center justify-between gap-2 mb-1">
          <h3 className="text-base font-semibold text-gray-900 line-clamp-2">
            {task.title}
          </h3>
          <span className={`inline-block px-2 py-1 text-sm font-medium rounded ${STATUS_BADGE_COLORS[task.status]}`}>
            {STATUS_LABELS[task.status]}
          </span>
        </div>

        {/* Assignee and Description */}
        <span className="text-xs text-gray-600 font-medium mb-1">Assignee: {task.assignee}</span>

        {task.description && (
          <p className="text-sm text-gray-600 mb-1 line-clamp-2 flex-1">
            {task.description}
          </p>
        )}

        {/* Priority and Due Date - Row 2 */}
        <div className="flex items-center gap-2">
          <span className={`inline-block px-2 py-1 text-sm font-medium rounded ${PRIORITY_COLORS[task.priority]}`}>
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </span>
          {task.dueDate && (
            <span className="text-sm text-gray-600 font-medium">Due: {formatDate(task.dueDate)}</span>
          )}
        </div>
      </article>
    </Link>
  );
}
