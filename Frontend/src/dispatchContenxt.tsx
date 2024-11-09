import React, { createContext, useContext, ReactNode } from "react";
import { AppDispatch } from "./store/store"; // Your AppDispatch type from your Redux store
import { useAppDispatch } from "./store/hooks"; // Your custom hook to get dispatch

interface DispatchContextProps {
  dispatch: AppDispatch;
}

// Create a context with an undefined dispatch as the default value
const DispatchContext = createContext<DispatchContextProps | undefined>(undefined);

export const DispatchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();

  return (
    <DispatchContext.Provider value={{ dispatch }}>
      {children}
    </DispatchContext.Provider>
  );
};

export const useDispatchContext = (): AppDispatch => {
  const context = useContext(DispatchContext);
  if (!context) {
    throw new Error("useDispatchContext must be used within a DispatchProvider");
  }
  return context.dispatch;
};