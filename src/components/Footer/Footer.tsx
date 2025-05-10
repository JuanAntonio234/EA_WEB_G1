import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer-content">
      <p>© {new Date().getFullYear()} Mi Aplicación. Todos los derechos reservados.</p>
    </footer>
  );
};

export default Footer;
