import { useState, useEffect } from 'react';
import { TaskList } from '../components/TaskList';
import { SummaryCard } from '../components/SummaryCard';
import { Header } from '../components/Header';
import { TaskCreateForm } from '../components/TaskCreateForm';
import { TaskEditForm } from '../components/TaskEditForm';
import { TaskDeleteConfirm } from '../components/TaskDeleteConfirm';
import { useTask } from '../context/TaskContext';
import { Task, TaskStatus } from '../types/task';

export function Dashboard(): JSX.Element {
  const { state } = useTask();
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
  const [deletingTaskTitle, setDeletingTaskTitle] = useState('');
  const [selectedTaskIndex, setSelectedTaskIndex] = useState<number | null>(null);

  const recentTasks = state.tasks.slice(0, 5);
  const todoTasks = state.tasks.filter((task) => task.status === TaskStatus.TODO);
  const inProgressTasks = state.tasks.filter((task) => task.status === TaskStatus.IN_PROGRESS);
  const blockedTasks = state.tasks.filter((task) => task.status === TaskStatus.BLOCKED);
  const doneTasks = state.tasks.filter((task) => task.status === TaskStatus.DONE);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsInitialLoading(false);
    }, 1200);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (recentTasks.length === 0) {
      setSelectedTaskIndex(null);
      return;
    }

    setSelectedTaskIndex((current) => {
      if (current === null || current >= recentTasks.length) {
        return 0;
      }
      return current;
    });
  }, [recentTasks.length]);

  const handleEdit = (task: Task) => {
    setEditingTask(task);
  };

  const handleDelete = (taskId: string, taskTitle: string) => {
    setDeletingTaskId(taskId);
    setDeletingTaskTitle(taskTitle);
  };

  // Keyboard navigation: arrow keys, d for delete, e for edit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if typing in input or textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      const selectedTask = selectedTaskIndex !== null ? recentTasks[selectedTaskIndex] : null;

      // Arrow Up/Down to navigate through recent tasks
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        if (recentTasks.length === 0) return;

        let newIndex = selectedTaskIndex === null ? 0 : selectedTaskIndex;
        if (e.key === 'ArrowUp') {
          newIndex = Math.max(0, newIndex - 1);
        } else {
          newIndex = Math.min(recentTasks.length - 1, newIndex + 1);
        }
        setSelectedTaskIndex(newIndex);
        return;
      }

      // D to delete selected task
      if (e.key.toLowerCase() === 'd' && !e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey && selectedTask) {
        e.preventDefault();
        handleDelete(selectedTask.id, selectedTask.title);
        return;
      }

      // E to edit selected task
      if (e.key.toLowerCase() === 'e' && !e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey && selectedTask) {
        e.preventDefault();
        handleEdit(selectedTask);
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedTaskIndex, recentTasks, handleEdit, handleDelete]);

  return (
    <>
      <Header onAddClick={() => setShowCreateForm(true)} />
      <main className="flex-1 pt-16 md:ml-60 lg:ml-60">
        <div className="p-3 sm:p-6 lg:p-8">
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">Welcome to your task management system</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
            <SummaryCard count={todoTasks.length} label="Todo" status={TaskStatus.TODO} />
            <SummaryCard count={inProgressTasks.length} label="In Progress" status={TaskStatus.IN_PROGRESS} />
            {blockedTasks.length > 0 && <SummaryCard count={blockedTasks.length} label="Blocked" status={TaskStatus.BLOCKED} />}
            <SummaryCard count={doneTasks.length} label="Done" status={TaskStatus.DONE} />
          </div>

          {/* Recent Tasks */}
          <TaskList
            tasks={recentTasks}
            title="Recent Tasks"
            isLoading={isInitialLoading}
            skeletonCount={4}
            selectedTaskIndex={selectedTaskIndex}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </main>

      {/* Modals */}
      {showCreateForm && <TaskCreateForm onClose={() => setShowCreateForm(false)} />}
      {editingTask && <TaskEditForm task={editingTask} onClose={() => setEditingTask(null)} />}
      {deletingTaskId && <TaskDeleteConfirm taskId={deletingTaskId} taskTitle={deletingTaskTitle} onClose={() => setDeletingTaskId(null)} />}
    </>
  );
}
