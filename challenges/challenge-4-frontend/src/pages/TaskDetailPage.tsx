import { useParams, Link } from 'react-router-dom';
import { sampleTasks } from '../data/sampleTasks';
import { TaskStatus, TaskPriority } from '../types/task';

export function TaskDetailPage(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const task = sampleTasks.find((t) => t.id === id);

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

  const getPriorityLabel = (priority: TaskPriority): string => {
    return priority.charAt(0).toUpperCase() + priority.slice(1);
  };

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

        <article className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">{task.title}</h1>

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 pb-6 border-b border-gray-200">
            <div>
              <p className="text-sm text-gray-600 font-medium mb-1">Status</p>
              <p className="text-base font-semibold text-gray-900">{getStatusLabel(task.status)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium mb-1">Priority</p>
              <p className="text-base font-semibold text-gray-900">{getPriorityLabel(task.priority)}</p>
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
        </article>
      </div>
    </main>
  );
}
