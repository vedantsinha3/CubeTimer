import { createContext, useContext, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Solve, Penalty } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface SolvesContextType {
  solves: Solve[];
  addSolve: (time: number, scramble: string) => void;
  deleteSolve: (id: string) => void;
  updatePenalty: (id: string, penalty: Penalty) => void;
  clearAllSolves: () => void;
}

const SolvesContext = createContext<SolvesContextType | undefined>(undefined);

const STORAGE_KEY = 'cube-timer-solves';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

interface SolvesProviderProps {
  children: ReactNode;
}

export function SolvesProvider({ children }: SolvesProviderProps) {
  const [solves, setSolves] = useLocalStorage<Solve[]>(STORAGE_KEY, []);

  const addSolve = useCallback(
    (time: number, scramble: string) => {
      const newSolve: Solve = {
        id: generateId(),
        time,
        scramble,
        timestamp: Date.now(),
        penalty: 'none',
      };
      setSolves((prev) => [newSolve, ...prev]);
    },
    [setSolves]
  );

  const deleteSolve = useCallback(
    (id: string) => {
      setSolves((prev) => prev.filter((solve) => solve.id !== id));
    },
    [setSolves]
  );

  const updatePenalty = useCallback(
    (id: string, penalty: Penalty) => {
      setSolves((prev) =>
        prev.map((solve) => (solve.id === id ? { ...solve, penalty } : solve))
      );
    },
    [setSolves]
  );

  const clearAllSolves = useCallback(() => {
    setSolves([]);
  }, [setSolves]);

  return (
    <SolvesContext.Provider
      value={{
        solves,
        addSolve,
        deleteSolve,
        updatePenalty,
        clearAllSolves,
      }}
    >
      {children}
    </SolvesContext.Provider>
  );
}

export function useSolves(): SolvesContextType {
  const context = useContext(SolvesContext);
  if (context === undefined) {
    throw new Error('useSolves must be used within a SolvesProvider');
  }
  return context;
}
