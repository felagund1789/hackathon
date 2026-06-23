interface ShortcutHelpModalProps {
  onClose: () => void;
}

export function ShortcutHelpModal({ onClose }: ShortcutHelpModalProps) {
  const shortcuts = [
    { key: 'n', description: 'Create a new task' },
    { key: 'e', description: 'Edit focused task' },
    { key: 'd', description: 'Delete focused task' },
    { key: 't', description: 'Toggle light/dark theme' },
    { key: 'Escape', description: 'Close any open modal or dialog' },
    { key: '↑ ↓', description: 'Navigate through tasks' },
    { key: 'Ctrl + /', description: 'Show this help dialog' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg dark:shadow-black/40 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto transition-colors">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Keyboard Shortcuts</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-2xl leading-none"
            aria-label="Close help dialog"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <table className="w-full">
            <tbody>
              {shortcuts.map((shortcut, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="py-3 px-4 text-left">
                    <kbd className="px-3 py-1.5 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded text-sm font-mono text-gray-900 dark:text-gray-100">
                      {shortcut.key}
                    </kbd>
                  </td>
                  <td className="py-3 px-4 text-left text-gray-700 dark:text-gray-300">{shortcut.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
