import { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { TaskCreateForm } from '../components/TaskCreateForm';
import { TaskDeleteConfirm } from '../components/TaskDeleteConfirm';
import { TaskEditForm } from '../components/TaskEditForm';
import { useTask } from '../context/TaskContext';
import { PRIORITY_COLORS, PRIORITY_LABELS, STATUS_LABELS } from '../constants/taskColors';
import { Task, TaskStatus } from '../types/task';

const COLUMN_ORDER: TaskStatus[] = [
  TaskStatus.TODO,
  TaskStatus.IN_PROGRESS,
  TaskStatus.BLOCKED,
  TaskStatus.DONE,
];

const COLUMN_STYLES: Record<TaskStatus, string> = {
  [TaskStatus.TODO]: 'bg-gray-100 dark:bg-gray-800/80 border-gray-300 dark:border-gray-700',
  [TaskStatus.IN_PROGRESS]: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900',
  [TaskStatus.BLOCKED]: 'bg-pink-50 dark:bg-pink-950/25 border-pink-200 dark:border-pink-900',
  [TaskStatus.DONE]: 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900',
};

const COLUMN_HEADER_TEXT: Record<TaskStatus, string> = {
  [TaskStatus.TODO]: 'text-gray-800 dark:text-gray-200',
  [TaskStatus.IN_PROGRESS]: 'text-blue-800 dark:text-blue-200',
  [TaskStatus.BLOCKED]: 'text-pink-800 dark:text-pink-200',
  [TaskStatus.DONE]: 'text-green-800 dark:text-green-200',
};

export function KanbanPage(): JSX.Element {
  const { state, updateTask } = useTask();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);
  const [dropTargetStatus, setDropTargetStatus] = useState<TaskStatus | null>(null);
  const [selectedTaskIndex, setSelectedTaskIndex] = useState<number | null>(null);

  const tasksByStatus = useMemo(() => {
    return COLUMN_ORDER.reduce<Record<TaskStatus, Task[]>>(
      (acc, status) => {
        acc[status] = state.tasks.filter((task) => task.status === status);
        return acc;
      },
      {
        [TaskStatus.TODO]: [],
        [TaskStatus.IN_PROGRESS]: [],
        [TaskStatus.BLOCKED]: [],
        [TaskStatus.DONE]: [],
      }
    );
  }, [state.tasks]);

  const handleEdit = (task: Task) => {
    setEditingTask(task);
  };

  const handleDelete = (task: Task) => {
    setDeletingTask(task);
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
        handleDelete(selectedTask);
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

  const handleDragStart = (event: React.DragEvent<HTMLElement>, taskId: string) => {
    setDraggingTaskId(taskId);
    event.dataTransfer.setData('text/task-id', taskId);
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggingTaskId(null);
    setDropTargetStatus(null);
  };

  const handleDragOver = (event: React.DragEvent<HTMLElement>, status: TaskStatus) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    setDropTargetStatus(status);
  };

  const handleDrop = (event: React.DragEvent<HTMLElement>, targetStatus: TaskStatus) => {
    event.preventDefault();
    const taskId = event.dataTransfer.getData('text/task-id') || draggingTaskId;
    if (!taskId) {
      setDropTargetStatus(null);
      return;
    }

    const task = state.tasks.find((item) => item.id === taskId);
    if (!task || task.status === targetStatus) {
      setDropTargetStatus(null);
      return;
    }

    updateTask({ ...task, status: targetStatus });
    setDropTargetStatus(null);
  };

  return (
    <>
      <Header onAddClick={() => setShowCreateForm(true)} />

      <main className="flex-1 pt-16 md:ml-60 lg:ml-60">
        <div className="p-3 sm:p-6 lg:p-8">
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">Kanban Board</h1>
            <p className="text-gray-600 dark:text-gray-400">Drag tasks between columns to update their status.</p>
          </div>

          <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4" aria-label="Kanban board">
            {COLUMN_ORDER.map((status) => {
              const columnTasks = tasksByStatus[status];
              const isDropTarget = dropTargetStatus === status;

              return (
                <div
                  key={status}
                  onDragOver={(event) => handleDragOver(event, status)}
                  onDrop={(event) => handleDrop(event, status)}
                  onDragLeave={() => setDropTargetStatus((current) => (current === status ? null : current))}
                  className={`border rounded-lg p-3 min-h-[22rem] transition-colors ${COLUMN_STYLES[status]} ${
                    isDropTarget ? 'ring-2 ring-blue-500 ring-offset-1 dark:ring-offset-gray-900' : ''
                  }`}
                >
                  <header className="mb-3 flex items-center justify-between">
                    <h2 className={`text-sm font-semibold ${COLUMN_HEADER_TEXT[status]}`}>{STATUS_LABELS[status]}</h2>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/70 dark:bg-gray-900/50 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                      {columnTasks.length}
                    </span>
                  </header>

                  <div className="space-y-3">
                    {columnTasks.length === 0 ? (
                      <p className="text-sm text-gray-500 dark:text-gray-400 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-3 text-center">
                        No tasks
                      </p>
                    ) : (
                      columnTasks.map((task) => {
                        const isSelected = selectedTaskIndex !== null && state.tasks[selectedTaskIndex]?.id === task.id;
                        return (
                          <article
                            key={task.id}
                            draggable
                            onDragStart={(event) => handleDragStart(event, task.id)}
                            onDragEnd={handleDragEnd}
                            className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-sm transition-all cursor-grab active:cursor-grabbing ${
                              draggingTaskId === task.id ? 'opacity-60 shadow-lg scale-[0.99]' : 'hover:shadow-md'
                            } ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
                          >
                          <Link
                            to={`/tasks/${task.id}`}
                            className="block text-sm font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 mb-2"
                          >
                            {task.title}
                          </Link>

                          {task.description && (
                            <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">{task.description}</p>
                          )}

                          <div className="flex items-center justify-between gap-2 mb-3">
                            <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded ${PRIORITY_COLORS[task.priority]}`}>
                              {PRIORITY_LABELS[task.priority]}
                            </span>
                            <span className="text-xs text-gray-600 dark:text-gray-400 truncate">{task.assignee}</span>
                          </div>

                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setEditingTask(task)}
                              className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white text-sm font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                              aria-label={`Edit ${task.title}`}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeletingTask(task)}
                              className="px-3 py-1.5 bg-red-500 dark:bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-600 dark:hover:bg-red-700 transition-colors"
                              aria-label={`Delete ${task.title}`}
                            >
                              Delete
                            </button>
                          </div>
                        </article>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </section>
        </div>
      </main>

      {showCreateForm && <TaskCreateForm onClose={() => setShowCreateForm(false)} />}
      {editingTask && <TaskEditForm task={editingTask} onClose={() => setEditingTask(null)} />}
      {deletingTask && (
        <TaskDeleteConfirm
          taskId={deletingTask.id}
          taskTitle={deletingTask.title}
          onClose={() => setDeletingTask(null)}
        />
      )}
    </>
  );
}