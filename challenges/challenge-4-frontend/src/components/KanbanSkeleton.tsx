import { TaskCardSkeleton } from './TaskCardSkeleton';

export function ColumnHeaderSkeleton(): JSX.Element {
  return (
    <div className="mb-3 flex items-center justify-between animate-skeleton-shimmer" aria-hidden="true">
      <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700" />
      <div className="h-5 w-8 rounded-full bg-gray-200 dark:bg-gray-700" />
    </div>
  );
}

interface KanbanSkeletonProps {
  columns?: number;
  cardsPerColumn?: number;
}

export function KanbanSkeleton({ columns = 4, cardsPerColumn = 3 }: KanbanSkeletonProps): JSX.Element {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4" aria-busy="true" aria-live="polite">
      <p className="sr-only">Loading kanban board...</p>
      {Array.from({ length: columns }).map((_, columnIndex) => (
        <div
          key={`kanban-column-skeleton-${columnIndex}`}
          className="border rounded-lg p-3 min-h-[22rem] bg-gray-100 dark:bg-gray-800/80 border-gray-300 dark:border-gray-700"
        >
          <ColumnHeaderSkeleton />
          <div className="space-y-3">
            {Array.from({ length: cardsPerColumn }).map((__, cardIndex) => (
              <TaskCardSkeleton key={`kanban-card-skeleton-${columnIndex}-${cardIndex}`} compact />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}