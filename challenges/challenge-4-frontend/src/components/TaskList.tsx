import { Task } from '../types/task';
import { TaskCard } from './TaskCard';

interface TaskListProps {
  tasks: Task[];
  title?: string;
  columns?: number; // Optional prop to specify the number of columns
}

export function TaskList({ tasks, title, columns = 2 }: TaskListProps): JSX.Element {
  return (
    <section className="w-full">
      {title && <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">{title}</h2>}
      {tasks.length > 0 ? (
        <ul className={`grid grid-cols-1 md:grid-cols-${columns} gap-4`}>
          {tasks.map((task) => (
            <li key={task.id}>
              <TaskCard task={task} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="py-12 text-center text-gray-500">
          <p className="text-sm sm:text-base">No tasks found. Create one to get started.</p>
        </div>
      )}
    </section>
  );
}
