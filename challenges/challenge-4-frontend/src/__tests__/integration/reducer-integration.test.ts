import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useTaskReducer } from '../../hooks/useTaskReducer';
import { Task, TaskStatus, TaskPriority } from '../../types/task';

describe('Task Reducer Integration', () => {
  const mockTask: Task = {
    id: 'task-1',
    title: 'Original Task',
    description: 'Original Description',
    status: TaskStatus.TODO,
    priority: TaskPriority.MEDIUM,
    assignee: 'Test User',
    createdAt: new Date(),
    dueDate: new Date(),
  };

  it('creates task, updates it, and can undo both actions', () => {
    const { result } = renderHook(() => useTaskReducer([mockTask]));

    // Initial state
    expect(result.current.state.tasks).toHaveLength(1);

    // Create new task
    act(() => {
      result.current.createTask({
        title: 'New Task',
        description: 'New Description',
        status: TaskStatus.TODO,
        priority: TaskPriority.HIGH,
        assignee: 'Test User',
      });
    });

    expect(result.current.state.tasks).toHaveLength(2);

    // Update the newly created task
    act(() => {
      result.current.updateTask({
        ...result.current.state.tasks[0],
        title: 'Updated Task',
      });
    });

    expect(result.current.state.tasks[0].title).toBe('Updated Task');

    // Undo update
    act(() => {
      result.current.undo();
    });

    expect(result.current.state.tasks[0].title).toBe('New Task');

    // Undo create
    act(() => {
      result.current.undo();
    });

    expect(result.current.state.tasks).toHaveLength(1);
  });

  it('deletes task and maintains undo stack', () => {
    const task2: Task = { ...mockTask, id: 'task-2', title: 'Task 2' };
    const { result } = renderHook(() => useTaskReducer([mockTask, task2]));

    expect(result.current.state.tasks).toHaveLength(2);

    // Delete first task
    act(() => {
      result.current.deleteTask('task-1');
    });

    expect(result.current.state.tasks).toHaveLength(1);
    expect(result.current.state.tasks[0].id).toBe('task-2');

    // Undo delete
    act(() => {
      result.current.undo();
    });

    expect(result.current.state.tasks).toHaveLength(2);
  });

  it('handles error state correctly', () => {
    const { result } = renderHook(() => useTaskReducer([mockTask]));

    expect(result.current.state.error).toBeNull();

    // Set error
    act(() => {
      result.current.setError('Test error');
    });

    expect(result.current.state.error).toBe('Test error');

    // Clear error
    act(() => {
      result.current.clearError();
    });

    expect(result.current.state.error).toBeNull();
  });
});
