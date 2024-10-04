import React, { createContext, useState, useContext, ReactNode } from 'react';

interface AppContextProps {
  currentFlag: string;
  setCurrentFlag: (language: string) => void;
  currency: string;
  setCurrency: (currency: string) => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentFlag, setCurrentFlag] = useState('en');
  const [currency, setCurrency] = useState('EGP');

  return (
    <AppContext.Provider value={{ currentFlag, setCurrentFlag, currency, setCurrency }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};