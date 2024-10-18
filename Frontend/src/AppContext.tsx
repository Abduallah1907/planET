import React, { createContext, useState, useContext, ReactNode } from 'react';
import currencyConverter from './utils/currencyConverterSingelton';

interface AppContextProps {
  currentFlag: string;
  setCurrentFlag: (language: string) => void;
  currency: string;
  setCurrency: (currency: string) => void;
  baseCurrency: string;
  convertCurrency: (amount: number, fromCurrency: string, toCurrency: string) => number;
  getConvertedCurrencyWithSymbol: (amount: number, fromCurrency: string, toCurrency: string) => string;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentFlag, setCurrentFlag] = useState('en');
  const [currency, setCurrency] = useState('EGP');
  const [baseCurrency, setBaseCurrency] = useState('EGP');

  const convertCurrency = (amount: number, fromCurrency: string, toCurrency: string): number => {
    return currencyConverter.convert(amount, fromCurrency, toCurrency);
  };

  const getConvertedCurrencyWithSymbol = (amount: number, fromCurrency: string, toCurrency: string): string => {
    const convertedAmount = convertCurrency(amount, fromCurrency, toCurrency);
    const formattedAmount = Number.isInteger(convertedAmount) ? convertedAmount.toString() : convertedAmount.toFixed(2);
    
    switch (toCurrency) {
      case 'EGP':
        return `EGP ${formattedAmount}`;
      case 'USD':
        return `$${formattedAmount}`;
      case 'EUR':
        return `€${formattedAmount}`;
      default:
        return `EGP ${formattedAmount}`;
    }
  };

  return (
    <AppContext.Provider value={{ currentFlag, setCurrentFlag, currency, setCurrency, baseCurrency, convertCurrency, getConvertedCurrencyWithSymbol }}>
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