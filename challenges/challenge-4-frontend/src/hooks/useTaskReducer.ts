import { useReducer, useCallback } from 'react';
import { Task } from '../types/task';

export interface TasksState {
  tasks: Task[];
  undoStack: Task[][];
  error: string | null;
  isLoading: boolean;
}

export type TaskAction = 
  | { type: 'CREATE'; payload: Omit<Task, 'id' | 'createdAt'> }
  | { type: 'UPDATE'; payload: Task }
  | { type: 'DELETE'; payload: string }
  | { type: 'UNDO' }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'INITIALIZE'; payload: Task[] };

function generateId(): string {
  return `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function taskReducer(state: TasksState, action: TaskAction): TasksState {
  switch (action.type) {
    case 'CREATE': {
      const newTask: Task = {
        id: generateId(),
        createdAt: new Date(),
        ...action.payload,
      };
      return {
        ...state,
        tasks: [newTask, ...state.tasks],
        undoStack: [[...state.tasks], ...state.undoStack.slice(0, 9)],
        error: null,
      };
    }

    case 'UPDATE': {
      const updatedTasks = state.tasks.map((t) => (t.id === action.payload.id ? action.payload : t));
      return {
        ...state,
        tasks: updatedTasks,
        undoStack: [[...state.tasks], ...state.undoStack.slice(0, 9)],
        error: null,
      };
    }

    case 'DELETE': {
      const filteredTasks = state.tasks.filter((t) => t.id !== action.payload);
      return {
        ...state,
        tasks: filteredTasks,
        undoStack: [[...state.tasks], ...state.undoStack.slice(0, 9)],
        error: null,
      };
    }

    case 'UNDO': {
      if (state.undoStack.length === 0) return state;
      const [previousTasks, ...remainingStack] = state.undoStack;
      return {
        ...state,
        tasks: previousTasks,
        undoStack: remainingStack,
        error: null,
      };
    }

    case 'SET_ERROR':
      return { ...state, error: action.payload };

    case 'CLEAR_ERROR':
      return { ...state, error: null };

    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'INITIALIZE':
      return {
        ...state,
        tasks: action.payload,
        undoStack: [],
      };

    default:
      return state;
  }
}

export function useTaskReducer(initialTasks: Task[]) {
  const [state, dispatch] = useReducer(taskReducer, {
    tasks: initialTasks,
    undoStack: [],
    error: null,
    isLoading: false,
  });

  const createTask = useCallback(
    (taskData: Omit<Task, 'id' | 'createdAt'>) => {
      dispatch({ type: 'CREATE', payload: taskData });
    },
    []
  );

  const updateTask = useCallback((task: Task) => {
    dispatch({ type: 'UPDATE', payload: task });
  }, []);

  const deleteTask = useCallback((taskId: string) => {
    dispatch({ type: 'DELETE', payload: taskId });
  }, []);

  const undo = useCallback(() => {
    dispatch({ type: 'UNDO' });
  }, []);

  const setError = useCallback((error: string) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const setLoading = useCallback((isLoading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: isLoading });
  }, []);

  return {
    state,
    dispatch,
    createTask,
    updateTask,
    deleteTask,
    undo,
    setError,
    clearError,
    setLoading,
  };
}
