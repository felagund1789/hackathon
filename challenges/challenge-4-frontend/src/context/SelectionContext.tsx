import { createContext, useContext, useState, ReactNode } from 'react';

interface SelectionContextType {
  selectedTaskId: string | null;
  selectTask: (taskId: string | null) => void;
}

const SelectionContext = createContext<SelectionContextType | undefined>(undefined);

export function SelectionProvider({ children }: { children: ReactNode }) {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const selectTask = (taskId: string | null) => {
    setSelectedTaskId(taskId);
  };

  return (
    <SelectionContext.Provider value={{ selectedTaskId, selectTask }}>
      {children}
    </SelectionContext.Provider>
  );
}

export function useSelection() {
  const context = useContext(SelectionContext);
  if (!context) {
    throw new Error('useSelection must be used within SelectionProvider');
  }
  return context;
}
