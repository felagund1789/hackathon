import { TaskCardSkeleton } from './TaskCardSkeleton';

interface TaskListSkeletonProps {
  title?: string;
  count?: number;
}

export function TaskListSkeleton({ title, count = 6 }: TaskListSkeletonProps): JSX.Element {
  return (
    <section className="w-full" aria-busy="true" aria-live="polite">
      {title && <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4">{title}</h2>}
      <p className="sr-only">Loading tasks...</p>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: count }).map((_, index) => (
          <li key={`task-skeleton-${index}`}>
            <TaskCardSkeleton />
          </li>
        ))}
      </ul>
    </section>
  );
}