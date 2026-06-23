import { TaskStatus, TaskPriority } from '../types/task';

/**
 * Tailwind color classes for task priorities
 * Used for priority indicator bars on task cards
 */
export const PRIORITY_COLORS: Record<TaskPriority, string> = {
  [TaskPriority.HIGH]: 'bg-red-500',
  [TaskPriority.MEDIUM]: 'bg-yellow-500',
  [TaskPriority.LOW]: 'bg-green-500',
};

/**
 * Tailwind color classes for task status badges
 * Used for inline status badges in task cards and detail views
 * Format: "bg-{color}-300 text-{color}-800" for accessibility and readability
 */
export const STATUS_BADGE_COLORS: Record<TaskStatus, string> = {
  [TaskStatus.TODO]: 'bg-blue-300 text-blue-800',
  [TaskStatus.IN_PROGRESS]: 'bg-yellow-300 text-yellow-800',
  [TaskStatus.BLOCKED]: 'bg-red-300 text-red-800',
  [TaskStatus.DONE]: 'bg-green-300 text-green-800',
};

/**
 * Summary card background colors for dashboard
 * Maps status to Tailwind color classes
 * Format: "bg-{color}-300 text-{color}-800" for high contrast (AAA compliance)
 */
export const SUMMARY_CARD_COLORS: Record<TaskStatus, string> = {
  [TaskStatus.TODO]: 'bg-blue-300 text-blue-800',
  [TaskStatus.IN_PROGRESS]: 'bg-yellow-300 text-yellow-800',
  [TaskStatus.BLOCKED]: 'bg-red-300 text-red-800',
  [TaskStatus.DONE]: 'bg-green-300 text-green-800',
};

/**
 * Priority labels for display in UI
 */
export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  [TaskPriority.HIGH]: 'High',
  [TaskPriority.MEDIUM]: 'Medium',
  [TaskPriority.LOW]: 'Low',
};

/**
 * Status labels for display in UI
 */
export const STATUS_LABELS: Record<TaskStatus, string> = {
  [TaskStatus.TODO]: 'To Do',
  [TaskStatus.IN_PROGRESS]: 'In Progress',
  [TaskStatus.BLOCKED]: 'Blocked',
  [TaskStatus.DONE]: 'Done',
};
