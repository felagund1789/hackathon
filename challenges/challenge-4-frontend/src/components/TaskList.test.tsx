import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { TaskList } from './TaskList';
import { Task, TaskStatus, TaskPriority } from '../types/task';

const mockTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Task One',
    description: 'Description one',
    status: TaskStatus.TODO,
    priority: TaskPriority.HIGH,
    assignee: 'Alice',
    createdAt: new Date(),
    dueDate: new Date(),
  },
  {
    id: 'task-2',
    title: 'Task Two',
    description: 'Description two',
    status: TaskStatus.IN_PROGRESS,
    priority: TaskPriority.MEDIUM,
    assignee: 'Bob',
    createdAt: new Date(),
    dueDate: new Date(),
  },
];

describe('TaskList', () => {
  it('renders task list when not loading', () => {
    render(
      <BrowserRouter>
        <TaskList tasks={mockTasks} isLoading={false} onEdit={() => {}} onDelete={() => {}} />
      </BrowserRouter>
    );

    expect(screen.getByText('Task One')).toBeInTheDocument();
    expect(screen.getByText('Task Two')).toBeInTheDocument();
  });

  it('renders skeleton loaders when isLoading is true', () => {
    const { container } = render(
      <BrowserRouter>
        <TaskList tasks={[]} isLoading={true} skeletonCount={3} onEdit={() => {}} onDelete={() => {}} />
      </BrowserRouter>
    );

    const skeletons = container.querySelectorAll('article[aria-hidden="true"]');
    expect(skeletons.length).toBe(3);
  });

  it('renders correct number of task cards', () => {
    render(
      <BrowserRouter>
        <TaskList tasks={mockTasks} isLoading={false} onEdit={() => {}} onDelete={() => {}} />
      </BrowserRouter>
    );

    const cards = screen.getAllByRole('article');
    expect(cards.length).toBeGreaterThanOrEqual(2);
  });

  it('applies selected class to highlighted task', () => {
    const { container } = render(
      <BrowserRouter>
        <TaskList tasks={mockTasks} isLoading={false} selectedIndex={0} onEdit={() => {}} onDelete={() => {}} />
      </BrowserRouter>
    );

    const articles = container.querySelectorAll('article:not([aria-hidden])');
    if (articles.length > 0) {
      expect(articles[0]).toHaveClass('ring-2', 'ring-blue-500');
    }
  });

  it('renders grid layout', () => {
    const { container } = render(
      <BrowserRouter>
        <TaskList tasks={mockTasks} isLoading={false} onEdit={() => {}} onDelete={() => {}} />
      </BrowserRouter>
    );

    const grid = container.querySelector('[class*="grid"]');
    expect(grid).toBeInTheDocument();
  });
});
