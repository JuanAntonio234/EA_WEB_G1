import React from 'react';
import './Footer';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} MiClonStrava. Todos los derechos reservados.</p>
      <p>Un proyecto increíble hecho por nosotros.</p>
    </footer>
  );
};

export default Footer;