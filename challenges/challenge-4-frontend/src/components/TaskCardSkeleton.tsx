interface TaskCardSkeletonProps {
  compact?: boolean;
}

export function TaskCardSkeleton({ compact = false }: TaskCardSkeletonProps): JSX.Element {
  return (
    <article
      className={`rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm overflow-hidden ${
        compact ? 'p-3 min-h-[9rem]' : 'p-4 min-h-[11rem]'
      }`}
      aria-hidden="true"
    >
      <div className="space-y-3 animate-skeleton-shimmer">
        <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-3 w-1/2 rounded bg-gray-200 dark:bg-gray-700" />
        <div className="space-y-2 pt-1">
          <div className="h-3 w-full rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-3 w-5/6 rounded bg-gray-200 dark:bg-gray-700" />
        </div>
        <div className="flex items-center justify-between pt-2">
          <div className="h-3 w-16 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-3 w-24 rounded bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>
    </article>
  );
}