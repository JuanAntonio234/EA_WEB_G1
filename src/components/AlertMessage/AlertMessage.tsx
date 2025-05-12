import React from 'react';
import './AlertMessage.css';

interface AlertMessageProps {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  onClose?: () => void;
}

const AlertMessage: React.FC<AlertMessageProps> = ({ message, type = 'info', onClose }) => {
  return (
    <div className={`alert-message alert-${type}`}>
      <span>{message}</span>
      {onClose && (
        <button className="alert-close-btn" onClick={onClose}>
          &times;
        </button>
      )}
    </div>
  );
};

export default AlertMessage;