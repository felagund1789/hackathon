import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useTask } from '../context/TaskContext';

interface HeaderProps {
  onAddClick?: () => void;
}

export function Header({ onAddClick }: HeaderProps): JSX.Element {
  const { state, undo } = useTask();
  const location = useLocation();

  // Handle Ctrl+Z keyboard shortcut for undo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && state.undoStack.length > 0) {
        e.preventDefault();
        undo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.undoStack.length, undo]);

  const getPageLabel = (): string => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    if (path === '/tasks') return 'All Tasks';
    if (path.startsWith('/tasks/')) return 'Task Detail';
    return 'Dashboard';
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 shadow-sm z-40">
      <div className="h-full px-3 sm:px-6 lg:px-8 flex items-center justify-between">
        <Link to="/" className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1">
          <h1 className="text-xl font-bold text-gray-900">TaskHub</h1>
        </Link>
        <nav aria-label="Page navigation" className="text-sm text-gray-600">
          <span>{getPageLabel()}</span>
        </nav>
        <div className="flex gap-2">
          {onAddClick && (
            <button
              onClick={onAddClick}
              className="px-3 py-1.5 bg-blue-500 text-white text-sm font-medium rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Create a new task"
            >
              + Add Task
            </button>
          )}
          <button
            onClick={undo}
            disabled={state.undoStack.length === 0}
            title={state.undoStack.length > 0 ? 'Undo (Ctrl+Z)' : 'Nothing to undo'}
            className={`px-3 py-1.5 text-sm font-medium rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              state.undoStack.length > 0
                ? 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
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
