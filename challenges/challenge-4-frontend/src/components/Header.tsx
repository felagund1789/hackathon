import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useTask } from '../context/TaskContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { ShortcutHelpModal } from './ShortcutHelpModal';

interface HeaderProps {
  onAddClick?: () => void;
}

export function Header({ onAddClick }: HeaderProps): JSX.Element {
  const { state, undo } = useTask();
  const { theme, toggleTheme } = useTheme();
  const { addToast } = useToast();
  const [showHelpModal, setShowHelpModal] = useState(false);

  const handleThemeToggle = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    toggleTheme();
    addToast(`Switched to ${nextTheme} mode.`);
  };

  const handleUndo = () => {
    if (state.undoStack.length === 0) {
      return;
    }
    undo();
    addToast('Undid last action.');
  };

  // Handle keyboard shortcuts: Ctrl+Z for undo, T for theme toggle, N for new task, ? for help
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if typing in input or textarea (except for Escape)
      const isTyping = e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement;
      const isContentEditable = (e.target as HTMLElement).isContentEditable;

      // Escape always works - close help modal if open, otherwise let component handle it
      if (e.key === 'Escape') {
        if (showHelpModal) {
          setShowHelpModal(false);
          e.preventDefault();
        }
        return;
      }

      if (isTyping || isContentEditable) {
        return;
      }

      // Ctrl+Z for undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && state.undoStack.length > 0) {
        e.preventDefault();
        handleUndo();
        return;
      }

      // T for theme toggle
      if (e.key.toLowerCase() === 't' && !e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey) {
        e.preventDefault();
        handleThemeToggle();
        return;
      }

      // N for new task
      if (e.key.toLowerCase() === 'n' && !e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey) {
        e.preventDefault();
        onAddClick?.();
        return;
      }

      // ? or Ctrl+/ for help
      if ((e.key === '?' && !e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey) ||
          (e.ctrlKey && e.key === '/')) {
        e.preventDefault();
        setShowHelpModal(true);
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.undoStack.length, onAddClick, showHelpModal, theme]);

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm z-40 transition-colors">
      <div className="h-full px-3 sm:px-6 lg:px-8 flex items-center justify-between">
        <Link to="/" className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">TaskHub</h1>
        </Link>
        {/* <nav aria-label="Page navigation" className="text-sm text-gray-600 dark:text-gray-400">
          <span>{getPageLabel()}</span>
        </nav> */}
        <div className="flex gap-2">
          {onAddClick && (
            <button
              onClick={onAddClick}
              title="Create a new task (n)"
              className="px-3 py-1.5 bg-blue-500 text-white text-sm font-medium rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              aria-label="Create a new task"
            >
              + Add Task
            </button>
          )}
          <button
            onClick={() => setShowHelpModal(true)}
            title="Show keyboard shortcuts (?)"
            className="px-3 py-1.5 text-sm font-medium rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            aria-label="Show keyboard shortcuts"
          >
            ?
          </button>
          <button
            onClick={handleThemeToggle}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode (t)`}
            className="px-3 py-1.5 text-sm font-medium rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' 
             ? <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1c1c1c"><path d="M480-120q-150 0-255-105T120-480q0-150 105-255t255-105q14 0 27.5 1t26.5 3q-41 29-65.5 75.5T444-660q0 90 63 153t153 63q55 0 101-24.5t75-65.5q2 13 3 26.5t1 27.5q0 150-105 255T480-120Zm0-80q88 0 158-48.5T740-375q-20 5-40 8t-40 3q-123 0-209.5-86.5T364-660q0-20 3-40t8-40q-78 32-126.5 102T200-480q0 116 82 198t198 82Zm-10-270Z"/></svg>
             : <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M565-395q35-35 35-85t-35-85q-35-35-85-35t-85 35q-35 35-35 85t35 85q35 35 85 35t85-35Zm-226.5 56.5Q280-397 280-480t58.5-141.5Q397-680 480-680t141.5 58.5Q680-563 680-480t-58.5 141.5Q563-280 480-280t-141.5-58.5ZM200-440H40v-80h160v80Zm720 0H760v-80h160v80ZM440-760v-160h80v160h-80Zm0 720v-160h80v160h-80ZM256-650l-101-97 57-59 96 100-52 56Zm492 496-97-101 53-55 101 97-57 59Zm-98-550 97-101 59 57-100 96-56-52ZM154-212l101-97 55 53-97 101-59-57Zm326-268Z"/></svg>}
          </button>
          <button
            onClick={handleUndo}
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

      {/* Help Modal */}
      {showHelpModal && <ShortcutHelpModal onClose={() => setShowHelpModal(false)} />}
    </header>
  );
}
