import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { TaskCard } from './TaskCard';
import { Task, TaskStatus, TaskPriority } from '../types/task';

const mockTask: Task = {
  id: 'task-1',
  title: 'Complete Project Report',
  description: 'Finish the quarterly project report',
  status: TaskStatus.IN_PROGRESS,
  priority: TaskPriority.HIGH,
  assignee: 'Alice Johnson',
  createdAt: new Date('2026-01-01'),
  dueDate: new Date('2026-02-15'),
};

describe('TaskCard', () => {
  it('renders task title', () => {
    render(
      <BrowserRouter>
        <TaskCard task={mockTask} onEdit={() => {}} onDelete={() => {}} />
      </BrowserRouter>
    );
    expect(screen.getByText('Complete Project Report')).toBeInTheDocument();
  });

  it('renders task description', () => {
    render(
      <BrowserRouter>
        <TaskCard task={mockTask} onEdit={() => {}} onDelete={() => {}} />
      </BrowserRouter>
    );
    expect(screen.getByText('Finish the quarterly project report')).toBeInTheDocument();
  });

  it('renders assignee name', () => {
    render(
      <BrowserRouter>
        <TaskCard task={mockTask} onEdit={() => {}} onDelete={() => {}} />
      </BrowserRouter>
    );
    expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
  });

  it('shows selected state with ring class when isSelected is true', () => {
    const { container } = render(
      <BrowserRouter>
        <TaskCard task={mockTask} isSelected={true} onEdit={() => {}} onDelete={() => {}} />
      </BrowserRouter>
    );
    const article = container.querySelector('article');
    expect(article).toHaveClass('ring-2', 'ring-blue-500');
  });

  it('calls onEdit when edit button is clicked', async () => {
    const handleEdit = vi.fn();
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <TaskCard task={mockTask} onEdit={handleEdit} onDelete={() => {}} />
      </BrowserRouter>
    );

    const editButton = screen.getByRole('button', { name: /edit/i });
    await user.click(editButton);

    expect(handleEdit).toHaveBeenCalledWith(mockTask);
  });

  it('calls onDelete when delete button is clicked', async () => {
    const handleDelete = vi.fn();
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <TaskCard task={mockTask} onEdit={() => {}} onDelete={handleDelete} />
      </BrowserRouter>
    );

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    await user.click(deleteButton);

    expect(handleDelete).toHaveBeenCalledWith(mockTask.id, mockTask.title);
  });

  it('links to task detail page', () => {
    render(
      <BrowserRouter>
        <TaskCard task={mockTask} onEdit={() => {}} onDelete={() => {}} />
      </BrowserRouter>
    );
    const link = screen.getByRole('link', { name: 'Complete Project Report' });
    expect(link).toHaveAttribute('href', '/tasks/task-1');
  });
});
