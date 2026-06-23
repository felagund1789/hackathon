import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TaskProvider } from '../context/TaskContext';
import { ToastProvider } from '../context/ToastContext';
import { TaskDeleteConfirm } from './TaskDeleteConfirm';
import { Task, TaskStatus, TaskPriority } from '../types/task';

const mockTask: Task = {
  id: 'task-1',
  title: 'Task to Delete',
  description: 'This will be deleted',
  status: TaskStatus.TODO,
  priority: TaskPriority.HIGH,
  assignee: 'Alice',
  createdAt: new Date(),
  dueDate: new Date(),
};

const setup = (onClose = () => {}) => {
  return render(
    <TaskProvider>
      <ToastProvider>
        <TaskDeleteConfirm task={mockTask} onClose={onClose} />
      </ToastProvider>
    </TaskProvider>
  );
};

describe('TaskDeleteConfirm', () => {
  it('displays task title in confirmation message', () => {
    setup();
    expect(screen.getByText('Task to Delete')).toBeInTheDocument();
  });

  it('renders delete button', () => {
    setup();
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
  });

  it('renders cancel button', () => {
    setup();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('renders confirmation message', () => {
    setup();
    expect(screen.getByText(/are you sure|confirm|delete/i)).toBeInTheDocument();
  });

  it('renders modal dialog', () => {
    const { container } = setup();
    expect(container.querySelector('dialog') || container.querySelector('[role="dialog"]')).toBeInTheDocument();
  });
});
