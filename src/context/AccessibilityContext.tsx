import React, { createContext, useState, useContext, ReactNode, useMemo } from 'react';

const MIN_FONT_SCALE = 0.8; 
const MAX_FONT_SCALE = 1.4;
const FONT_STEP = 0.1;      

interface AccessibilityContextType {
  fontScale: number;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  resetFontSize: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [fontScale, setFontScale] = useState(1); 

  const increaseFontSize = () => {
    setFontScale(prevScale => Math.min(MAX_FONT_SCALE, prevScale + FONT_STEP));
  };

  const decreaseFontSize = () => {
    setFontScale(prevScale => Math.max(MIN_FONT_SCALE, prevScale - FONT_STEP));
  };

  const resetFontSize = () => {
    setFontScale(1);
  };

  const value = useMemo(() => ({
    fontScale,
    increaseFontSize,
    decreaseFontSize,
    resetFontSize
  }), [fontScale]);

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility debe ser usado dentro de un AccessibilityProvider');
  }
  return context;
};