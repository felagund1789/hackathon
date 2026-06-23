import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TaskProvider } from '../context/TaskContext';
import { ToastProvider } from '../context/ToastContext';
import { TaskCreateForm } from './TaskCreateForm';

const setup = (onClose = () => {}) => {
  return render(
    <TaskProvider>
      <ToastProvider>
        <TaskCreateForm onClose={onClose} />
      </ToastProvider>
    </TaskProvider>
  );
};

describe('TaskCreateForm', () => {
  it('renders form title', () => {
    setup();
    expect(screen.getByText(/create task|new task/i)).toBeInTheDocument();
  });

  it('renders title input', () => {
    setup();
    const input = screen.getByPlaceholderText(/title/i) || screen.getByLabelText(/title/i);
    expect(input).toBeInTheDocument();
  });

  it('renders submit button', () => {
    setup();
    expect(screen.getByRole('button', { name: /create|submit/i })).toBeInTheDocument();
  });

  it('renders cancel/close button', () => {
    setup();
    expect(screen.getByRole('button', { name: /cancel|close|x/i })).toBeInTheDocument();
  });

  it('renders modal dialog', () => {
    const { container } = setup();
    expect(container.querySelector('dialog') || container.querySelector('[role="dialog"]')).toBeInTheDocument();
  });
});
