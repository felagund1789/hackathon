import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useTask } from '../context/TaskContext';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
  onAddClick?: () => void;
}

export function Header({ onAddClick }: HeaderProps): JSX.Element {
  const { state, undo } = useTask();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  // Handle keyboard shortcuts: Ctrl+Z for undo, T for theme toggle
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if typing in input or textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Ctrl+Z for undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && state.undoStack.length > 0) {
        e.preventDefault();
        undo();
      }

      // T for theme toggle
      if (e.key.toLowerCase() === 't' && !e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey) {
        e.preventDefault();
        toggleTheme();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.undoStack.length, undo, toggleTheme]);

  const getPageLabel = (): string => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    if (path === '/kanban') return 'Kanban Board';
    if (path === '/tasks') return 'All Tasks';
    if (path.startsWith('/tasks/')) return 'Task Detail';
    return 'Dashboard';
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm z-40 transition-colors">
      <div className="h-full px-3 sm:px-6 lg:px-8 flex items-center justify-between">
        <Link to="/" className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">TaskHub</h1>
        </Link>
        <nav aria-label="Page navigation" className="text-sm text-gray-600 dark:text-gray-400">
          <span>{getPageLabel()}</span>
        </nav>
        <div className="flex gap-2">
          {onAddClick && (
            <button
              onClick={onAddClick}
              className="px-3 py-1.5 bg-blue-500 text-white text-sm font-medium rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              aria-label="Create a new task"
            >
              + Add Task
            </button>
          )}
          <button
            onClick={toggleTheme}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode (t)`}
            className="px-3 py-1.5 text-sm font-medium rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <button
            onClick={undo}
            disabled={state.undoStack.length === 0}
            title={state.undoStack.length > 0 ? 'Undo (Ctrl+Z)' : 'Nothing to undo'}
            className={`px-3 py-1.5 text-sm font-medium rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
              state.undoStack.length > 0
                ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed'
            }`}
            aria-label="Undo last action"
          >
            ↶ Undo
          </button>
        </div>
      </div>
    </header>
  );
}
