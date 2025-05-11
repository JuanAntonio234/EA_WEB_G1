import React from 'react';
import './Button';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  type = 'button',
  ...props
}) => {
  return (
    <button type={type} className={`btn btn-${variant}`} {...props}>
      {children}
    </button>
  );
};

export default Button;