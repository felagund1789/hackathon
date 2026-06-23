import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TaskProvider } from '../context/TaskContext';
import { ToastProvider } from '../context/ToastContext';
import { TaskCreateForm } from './TaskCreateForm';

const setup = (onClose = () => {}) => {
  return render(
    <TaskProvider initialTasks={[]}>
      <ToastProvider>
        <TaskCreateForm onClose={onClose} />
      </ToastProvider>
    </TaskProvider>
  );
};

describe('TaskCreateForm', () => {
  it('renders form title', () => {
    setup();
    expect(screen.getByRole('heading', { name: /create task/i })).toBeInTheDocument();
  });

  it('renders title input', () => {
    setup();
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
  });

  it('renders submit button', () => {
    setup();
    expect(screen.getByRole('button', { name: /^create$/i })).toBeInTheDocument();
  });

  it('renders cancel and close buttons', () => {
    setup();
    expect(screen.getByRole('button', { name: /^cancel$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /close dialog/i })).toBeInTheDocument();
  });

  it('renders modal overlay', () => {
    const { container } = setup();
    const overlay = container.querySelector('.fixed.inset-0');
    expect(overlay).toBeInTheDocument();
  });
});
