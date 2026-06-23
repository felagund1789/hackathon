import { useState, useEffect } from 'react';
import { TaskList } from '../components/TaskList';
import { Header } from '../components/Header';
import { TaskCreateForm } from '../components/TaskCreateForm';
import { TaskEditForm } from '../components/TaskEditForm';
import { TaskDeleteConfirm } from '../components/TaskDeleteConfirm';
import { useTask } from '../context/TaskContext';
import { Task } from '../types/task';

export function TaskListPage(): JSX.Element {
  const { state } = useTask();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
  const [deletingTaskTitle, setDeletingTaskTitle] = useState('');
  const [selectedTaskIndex, setSelectedTaskIndex] = useState<number | null>(null);

  const handleEdit = (task: Task) => {
    setEditingTask(task);
  };

  const handleDelete = (taskId: string, taskTitle: string) => {
    setDeletingTaskId(taskId);
    setDeletingTaskTitle(taskTitle);
  };

  useEffect(() => {
    if (state.tasks.length === 0) {
      setSelectedTaskIndex(null);
      return;
    }

    setSelectedTaskIndex((current) => {
      if (current === null || current >= state.tasks.length) {
        return 0;
      }
      return current;
    });
  }, [state.tasks.length]);

  // Keyboard navigation: arrow keys, d for delete, e for edit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if typing in input or textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      const selectedTask = selectedTaskIndex !== null ? state.tasks[selectedTaskIndex] : null;

      // Arrow Up/Down to navigate through all tasks
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        if (state.tasks.length === 0) return;

        let newIndex = selectedTaskIndex === null ? 0 : selectedTaskIndex;
        if (e.key === 'ArrowUp') {
          newIndex = Math.max(0, newIndex - 1);
        } else {
          newIndex = Math.min(state.tasks.length - 1, newIndex + 1);
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
  }, [selectedTaskIndex, state.tasks, handleEdit, handleDelete]);

  return (
    <>
      <Header onAddClick={() => setShowCreateForm(true)} />
      <main className="flex-1 pt-16 md:ml-60 lg:ml-60">
        <div className="p-3 sm:p-6 lg:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-8">All Tasks</h1>
          <TaskList tasks={state.tasks} selectedTaskIndex={selectedTaskIndex} onEdit={handleEdit} onDelete={handleDelete} />
        </div>
      </main>

      {/* Modals */}
      {showCreateForm && <TaskCreateForm onClose={() => setShowCreateForm(false)} />}
      {editingTask && <TaskEditForm task={editingTask} onClose={() => setEditingTask(null)} />}
      {deletingTaskId && <TaskDeleteConfirm taskId={deletingTaskId} taskTitle={deletingTaskTitle} onClose={() => setDeletingTaskId(null)} />}
    </>
  );
}
