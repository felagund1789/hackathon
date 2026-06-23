import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useTaskReducer } from './useTaskReducer';
import { Task, TaskStatus, TaskPriority } from '../types/task';

const mockTask: Task = {
  id: 'task-1',
  title: 'Test Task',
  description: 'Test Description',
  status: TaskStatus.TODO,
  priority: TaskPriority.MEDIUM,
  assignee: 'Alice Johnson',
  createdAt: new Date('2026-01-01'),
  dueDate: new Date('2026-02-01'),
};

describe('useTaskReducer', () => {
  it('initializes with provided tasks', () => {
    const { result } = renderHook(() => useTaskReducer([mockTask]));

    expect(result.current.state.tasks).toHaveLength(1);
    expect(result.current.state.tasks[0].id).toBe('task-1');
  });

  it('creates a new task and adds it to the front', () => {
    const { result } = renderHook(() => useTaskReducer([mockTask]));

    act(() => {
      result.current.createTask({
        title: 'New Task',
        description: 'New Description',
        status: TaskStatus.TODO,
        priority: TaskPriority.HIGH,
        assignee: 'Bob Smith',
      });
    });

    expect(result.current.state.tasks).toHaveLength(2);
    expect(result.current.state.tasks[0].title).toBe('New Task');
    expect(result.current.state.tasks[1].id).toBe('task-1');
  });

  it('updates an existing task', () => {
    const { result } = renderHook(() => useTaskReducer([mockTask]));

    act(() => {
      result.current.updateTask({
        ...mockTask,
        title: 'Updated Title',
        status: TaskStatus.IN_PROGRESS,
      });
    });

    expect(result.current.state.tasks[0].title).toBe('Updated Title');
    expect(result.current.state.tasks[0].status).toBe(TaskStatus.IN_PROGRESS);
  });

  it('deletes a task by id', () => {
    const task2: Task = { ...mockTask, id: 'task-2', title: 'Task 2' };
    const { result } = renderHook(() => useTaskReducer([mockTask, task2]));

    act(() => {
      result.current.deleteTask('task-1');
    });

    expect(result.current.state.tasks).toHaveLength(1);
    expect(result.current.state.tasks[0].id).toBe('task-2');
  });

  it('undoes the last action', () => {
    const { result } = renderHook(() => useTaskReducer([mockTask]));
    const initialLength = result.current.state.tasks.length;

    act(() => {
      result.current.createTask({
        title: 'New Task',
        status: TaskStatus.TODO,
        priority: TaskPriority.MEDIUM,
        assignee: 'Alice Johnson',
      });
    });

    expect(result.current.state.tasks).toHaveLength(initialLength + 1);

    act(() => {
      result.current.undo();
    });

    expect(result.current.state.tasks).toHaveLength(initialLength);
  });

  it('sets and clears error state', () => {
    const { result } = renderHook(() => useTaskReducer([mockTask]));

    expect(result.current.state.error).toBeNull();

    act(() => {
      result.current.setError('Test error message');
    });

    expect(result.current.state.error).toBe('Test error message');

    act(() => {
      result.current.clearError();
    });

    expect(result.current.state.error).toBeNull();
  });

  it('sets loading state', () => {
    const { result } = renderHook(() => useTaskReducer([mockTask]));

    expect(result.current.state.isLoading).toBe(false);

    act(() => {
      result.current.setLoading(true);
    });

    expect(result.current.state.isLoading).toBe(true);

    act(() => {
      result.current.setLoading(false);
    });

    expect(result.current.state.isLoading).toBe(false);
  });
});
