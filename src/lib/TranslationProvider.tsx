'use client';

import { createContext, useContext } from 'react';

type Dictionary = unknown;

const TranslationContext = createContext<Dictionary | null>(null);

export const TranslationProvider = ({
  children,
  dict,
}: {
  children: React.ReactNode;
  dict: Dictionary;
}) => {
  return (
    <TranslationContext.Provider value={dict}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};
