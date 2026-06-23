import { Link } from 'react-router-dom';
import { Task, TaskStatus, TaskPriority } from '../types/task';

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps): JSX.Element {
  const getPriorityColor = (priority: TaskPriority): string => {
    switch (priority) {
      case TaskPriority.HIGH:
        return 'bg-red-500';
      case TaskPriority.MEDIUM:
        return 'bg-yellow-500';
      case TaskPriority.LOW:
        return 'bg-green-500';
    }
  };

  const getStatusColor = (status: TaskStatus): string => {
    switch (status) {
      case TaskStatus.TODO:
        return 'bg-cyan-100 text-cyan-800';
      case TaskStatus.IN_PROGRESS:
        return 'bg-blue-100 text-blue-800';
      case TaskStatus.BLOCKED:
        return 'bg-pink-100 text-pink-800';
      case TaskStatus.DONE:
        return 'bg-green-100 text-green-800';
    }
  };

  const getStatusLabel = (status: TaskStatus): string => {
    switch (status) {
      case TaskStatus.TODO:
        return 'To Do';
      case TaskStatus.IN_PROGRESS:
        return 'In Progress';
      case TaskStatus.BLOCKED:
        return 'Blocked';
      case TaskStatus.DONE:
        return 'Done';
    }
  };

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Link
      to={`/tasks/${task.id}`}
      className="block focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
    >
      <article className="h-24 p-3 sm:p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow flex items-center gap-3 sm:gap-4">
        {/* Priority Indicator - Left */}
        <div className={`flex-shrink-0 w-1 h-full rounded-sm ${getPriorityColor(task.priority)}`} />

        {/* Title and Status - Center-Left */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-1">
            {task.title}
          </h3>
          <span className={`inline-block px-2 py-1 text-xs font-medium rounded mt-1 ${getStatusColor(task.status)}`}>
            {getStatusLabel(task.status)}
          </span>
        </div>

        {/* Due Date - Center-Right */}
        {task.dueDate && (
          <div className="flex-shrink-0 text-xs text-gray-600 whitespace-nowrap text-right">
            <div className="font-medium">Due:</div>
            <div>{formatDate(task.dueDate)}</div>
          </div>
        )}

        {/* Assignee - Right */}
        <div className="flex-shrink-0 text-xs text-gray-600 whitespace-nowrap text-right hidden sm:block">
          <div className="font-medium">Assignee:</div>
          <div className="line-clamp-1">{task.assignee}</div>
        </div>
      </article>
    </Link>
  );
}
