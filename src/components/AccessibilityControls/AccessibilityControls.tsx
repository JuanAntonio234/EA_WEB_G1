import React from 'react';
import { useAccessibility } from '../../context/AccessibilityContext';
import styles from './AccessibilityControls.module.css';
import { ZoomIn, ZoomOut, RefreshCw } from 'lucide-react'; 

const AccessibilityControls: React.FC = () => {
  const { increaseFontSize, decreaseFontSize, resetFontSize } = useAccessibility();

  return (
    <div className={styles.controlsContainer}>
      <button onClick={decreaseFontSize} aria-label="Disminuir tamaño del texto" title="Disminuir tamaño del texto">
        <ZoomOut size={20} />
      </button>
      <button onClick={resetFontSize} aria-label="Restablecer tamaño del texto" title="Restablecer tamaño del texto">
        <RefreshCw size={16} />
      </button>
      <button onClick={increaseFontSize} aria-label="Aumentar tamaño del texto" title="Aumentar tamaño del texto">
        <ZoomIn size={20} />
      </button>
    </div>
  );
};

export default AccessibilityControls;