import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DatabaseState } from '../types';
import { INITIAL_STATE } from '../data/mockData';

interface DatabaseContextType {
  state: DatabaseState;
  setState: React.Dispatch<React.SetStateAction<DatabaseState>>;
  updateState: (updates: Partial<DatabaseState>) => void;
  activeUserId: string;
  setActiveUserId: React.Dispatch<React.SetStateAction<string>>;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export const DatabaseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<DatabaseState>(() => {
    try {
      const saved = localStorage.getItem('pocketFarmerState');
      return saved ? JSON.parse(saved) : INITIAL_STATE;
    } catch (e) {
      console.warn("Failed to load state from storage", e);
      return INITIAL_STATE;
    }
  });

  const [activeUserId, setActiveUserId] = useState<string>(() => {
     return state.users[0]?.id || "";
  });

  useEffect(() => {
    try {
      localStorage.setItem('pocketFarmerState', JSON.stringify(state));
    } catch (e) {
      console.warn("Failed to save state to storage", e);
    }
  }, [state]);

  const updateState = (updates: Partial<DatabaseState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  return (
    <DatabaseContext.Provider value={{ state, setState, updateState, activeUserId, setActiveUserId }}>
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};