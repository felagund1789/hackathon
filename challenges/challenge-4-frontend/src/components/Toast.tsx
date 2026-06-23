import { useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  duration?: number;
  onDismiss: () => void;
}

export function Toast({ message, type, duration = 4000, onDismiss }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, duration);
    return () => clearTimeout(timer);
  }, [duration, onDismiss]);

  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
  const icon = type === 'success' ? '✓' : '⚠';

  return (
    <div className={`${bgColor} text-white px-4 py-3 rounded-lg shadow-lg dark:shadow-black/40 ring-1 ring-black/10 dark:ring-white/10 flex items-center gap-3 animate-slide-in`}>
      <span className="text-lg font-bold">{icon}</span>
      <p className="flex-1">{message}</p>
      <button
        onClick={onDismiss}
        className="text-white hover:opacity-80 font-bold"
        aria-label="Dismiss notification"
      >
        ✕
      </button>
    </div>
  );
}

interface ToastContainerProps {
  toasts: Array<{ id: string; message: string; type: 'success' | 'error' }>;
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div
      className="fixed top-16 right-4 z-50 flex flex-col gap-2"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onDismiss={() => onDismiss(toast.id)}
        />
      ))}
    </div>
  );
}
