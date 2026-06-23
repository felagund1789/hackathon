import { useState } from 'react';
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

  const handleEdit = (task: Task) => {
    setEditingTask(task);
  };

  const handleDelete = (taskId: string, taskTitle: string) => {
    setDeletingTaskId(taskId);
    setDeletingTaskTitle(taskTitle);
  };

  return (
    <>
      <Header onAddClick={() => setShowCreateForm(true)} />
      <main className="flex-1 pt-16 md:ml-60 lg:ml-60">
        <div className="p-3 sm:p-6 lg:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-8">All Tasks</h1>
          <TaskList tasks={state.tasks} onEdit={handleEdit} onDelete={handleDelete} />
        </div>
      </main>

      {/* Modals */}
      {showCreateForm && <TaskCreateForm onClose={() => setShowCreateForm(false)} />}
      {editingTask && <TaskEditForm task={editingTask} onClose={() => setEditingTask(null)} />}
      {deletingTaskId && <TaskDeleteConfirm taskId={deletingTaskId} taskTitle={deletingTaskTitle} onClose={() => setDeletingTaskId(null)} />}
    </>
  );
}
