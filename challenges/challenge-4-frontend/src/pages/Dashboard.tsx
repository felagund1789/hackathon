import { useState } from 'react';
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
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
  const [deletingTaskTitle, setDeletingTaskTitle] = useState('');

  const recentTasks = state.tasks.slice(0, 5);
  const todoTasks = state.tasks.filter((task) => task.status === TaskStatus.TODO);
  const inProgressTasks = state.tasks.filter((task) => task.status === TaskStatus.IN_PROGRESS);
  const blockedTasks = state.tasks.filter((task) => task.status === TaskStatus.BLOCKED);
  const doneTasks = state.tasks.filter((task) => task.status === TaskStatus.DONE);

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
          <TaskList tasks={recentTasks} title="Recent Tasks" onEdit={handleEdit} onDelete={handleDelete} />
        </div>
      </main>

      {/* Modals */}
      {showCreateForm && <TaskCreateForm onClose={() => setShowCreateForm(false)} />}
      {editingTask && <TaskEditForm task={editingTask} onClose={() => setEditingTask(null)} />}
      {deletingTaskId && <TaskDeleteConfirm taskId={deletingTaskId} taskTitle={deletingTaskTitle} onClose={() => setDeletingTaskId(null)} />}
    </>
  );
}
