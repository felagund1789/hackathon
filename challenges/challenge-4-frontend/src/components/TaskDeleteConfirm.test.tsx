import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TaskProvider } from '../context/TaskContext';
import { ToastProvider } from '../context/ToastContext';
import { TaskDeleteConfirm } from './TaskDeleteConfirm';

const setup = (onClose = () => {}) => {
  return render(
    <TaskProvider>
      <ToastProvider>
        <TaskDeleteConfirm taskId="task-1" taskTitle="Task to Delete" onClose={onClose} />
      </ToastProvider>
    </TaskProvider>
  );
};

describe('TaskDeleteConfirm', () => {
  it('displays task title in confirmation message', () => {
    setup();
    expect(screen.getByText(/task to delete/i)).toBeInTheDocument();
  });

  it('renders delete button', () => {
    setup();
    expect(screen.getByRole('button', { name: /^delete$/i })).toBeInTheDocument();
  });

  it('renders cancel button', () => {
    setup();
    expect(screen.getByRole('button', { name: /^cancel$/i })).toBeInTheDocument();
  });

  it('renders confirmation heading', () => {
    setup();
    expect(screen.getByRole('heading', { name: /delete task/i })).toBeInTheDocument();
  });

  it('renders modal overlay', () => {
    const { container } = setup();
    const overlay = container.querySelector('.fixed.inset-0');
    expect(overlay).toBeInTheDocument();
  });
});
