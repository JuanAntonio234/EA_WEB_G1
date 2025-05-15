import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar: React.FC = () => {
  const isAuthenticated = false; // Simulación

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">MiClonStrava</Link>
      </div>
      <ul className="navbar-links">
        <li><Link to="/">Inicio</Link></li>
        <li><Link to="/about">Sobre Nosotros</Link></li> 

        {isAuthenticated ? (
          <>
            <li><Link to="/profile/me">Mi Perfil</Link></li>
            <li><Link to="/settings">Configuración</Link></li>
            <li><button className="navbar-logout-btn">Cerrar Sesión</button></li>
          </>
        ) : (
          <>
            <li><Link to="/login">Iniciar Sesión</Link></li>
            <li><Link to="/register">Registrarse</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;