import { createContext, useContext, ReactNode } from 'react';
import { Task } from '../types/task';
import { TasksState, useTaskReducer } from '../hooks/useTaskReducer';

export interface TaskContextType {
  state: TasksState;
  createTask: (taskData: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (task: Task) => void;
  deleteTask: (taskId: string) => void;
  undo: () => void;
  setError: (error: string) => void;
  clearError: () => void;
  setLoading: (isLoading: boolean) => void;
}

export const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function useTask(): TaskContextType {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within TaskProvider');
  }
  return context;
}

interface TaskProviderProps {
  children: ReactNode;
  initialTasks: Task[];
}

export function TaskProvider({ children, initialTasks }: TaskProviderProps) {
  const {
    state,
    createTask,
    updateTask,
    deleteTask,
    undo,
    setError,
    clearError,
    setLoading,
  } = useTaskReducer(initialTasks);

  const value: TaskContextType = {
    state,
    createTask,
    updateTask,
    deleteTask,
    undo,
    setError,
    clearError,
    setLoading,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}
