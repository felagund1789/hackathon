import { Link } from 'react-router-dom';
import { Task, TaskStatus, TaskPriority } from '../types/task';

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps): JSX.Element {
  const getPriorityColor = (priority: TaskPriority): string => {
    switch (priority) {
      case TaskPriority.HIGH:
        return 'bg-red-100 text-red-700 border-red-300';
      case TaskPriority.MEDIUM:
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case TaskPriority.LOW:
        return 'bg-green-100 text-green-700 border-green-300';
    }
  };

  const getStatusColor = (status: TaskStatus): string => {
    switch (status) {
      case TaskStatus.TODO:
        return 'bg-gray-100 text-gray-700 border-gray-300';
      case TaskStatus.IN_PROGRESS:
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case TaskStatus.DONE:
        return 'bg-green-100 text-green-700 border-green-300';
    }
  };

  const getStatusLabel = (status: TaskStatus): string => {
    switch (status) {
      case TaskStatus.TODO:
        return 'To Do';
      case TaskStatus.IN_PROGRESS:
        return 'In Progress';
      case TaskStatus.DONE:
        return 'Done';
    }
  };

  const getPriorityLabel = (priority: TaskPriority): string => {
    return priority.charAt(0).toUpperCase() + priority.slice(1);
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
      <article className="p-3 sm:p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
        <div className="flex items-start gap-2 sm:gap-3">
          {/* Priority Indicator */}
          <div className="flex-shrink-0 w-1 h-12 sm:h-16 bg-gradient-to-b from-current to-current rounded-full opacity-70" style={{backgroundColor: task.priority === TaskPriority.HIGH ? '#dc2626' : task.priority === TaskPriority.MEDIUM ? '#eab308' : '#16a34a'}} />

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-2">
              {task.title}
            </h3>

            {/* Metadata */}
            <div className="mt-2 flex flex-wrap gap-2">
              {/* Status Badge */}
              <span className={`inline-block px-2 py-1 text-xs font-medium rounded border ${getStatusColor(task.status)}`}>
                {getStatusLabel(task.status)}
              </span>

              {/* Priority Badge */}
              <span className={`inline-block px-2 py-1 text-xs font-medium rounded border ${getPriorityColor(task.priority)}`}>
                {getPriorityLabel(task.priority)}
              </span>
            </div>
          </div>

          {/* Due Date */}
          {task.dueDate && (
            <div className="flex-shrink-0 text-xs text-gray-600 whitespace-nowrap">
              {formatDate(task.dueDate)}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}
