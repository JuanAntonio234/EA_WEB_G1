import React, { createContext, useState, useContext, ReactNode, useMemo } from 'react';

const MIN_FONT_SCALE = 0.8;
const MAX_FONT_SCALE = 1.4;
const FONT_STEP = 0.1;

interface AccessibilityContextType {
  fontScale: number;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  resetFontSize: () => void;

  isReadingMode: boolean;
  toggleReadingMode: () => void;

  isDyslexiaFont: boolean;
  toggleDyslexiaFont: () => void;

  areLinksHighlighted: boolean;
  toggleLinksHighlight: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [fontScale, setFontScale] = useState(1);
  const [isReadingMode, setIsReadingMode] = useState(false);
  const [isDyslexiaFont, setIsDyslexiaFont] = useState(false);
  const [areLinksHighlighted, setAreLinksHighlighted] = useState(false);

  const increaseFontSize = () => setFontScale(prev => Math.min(MAX_FONT_SCALE, prev + FONT_STEP));
  const decreaseFontSize = () => setFontScale(prev => Math.max(MIN_FONT_SCALE, prev - FONT_STEP));
  const resetFontSize = () => setFontScale(1);

  const toggleReadingMode = () => setIsReadingMode(prev => !prev);
  const toggleDyslexiaFont = () => setIsDyslexiaFont(prev => !prev);
  const toggleLinksHighlight = () => setAreLinksHighlighted(prev => !prev);

  const value = useMemo(() => ({
    fontScale,
    increaseFontSize,
    decreaseFontSize,
    resetFontSize,
    isReadingMode,
    toggleReadingMode,
    isDyslexiaFont,
    toggleDyslexiaFont,
    areLinksHighlighted,
    toggleLinksHighlight
  }), [fontScale, isReadingMode, isDyslexiaFont, areLinksHighlighted]);

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