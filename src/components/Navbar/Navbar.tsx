import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { useAuth } from '../../hooks/useAuth';

interface NavLink {
  href: string;
  label: string;
}

interface NavbarProps {
  title: string;
  links: NavLink[];
  className?: string;
}

const Navbar: React.FC<NavbarProps> = ({ title, links, className }) => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

   return (
    <nav className={`navbar ${className || ''}`}>
      <div className="navbar-brand">
        <Link to="/" className="navbar-item">{title}</Link>
      </div>
      <div className="navbar-menu">
        <div className="navbar-start">
          {links.map((link) => (
            <Link key={link.href} to={link.href} className="navbar-item">
              {link.label}
            </Link>
          ))}
        </div>
        <div className="navbar-end">
          <div className="navbar-item">
            {user ? (
              <div className="user-menu">
                <div className="user-avatar-container" onClick={() => setMenuOpen(!menuOpen)}>
                  {user.profilePicture ? (
                    <img src={user.profilePicture} alt="Avatar" className="user-avatar" />
                  ) : (
                    <div className="user-avatar">
                      {user.username?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                {menuOpen && (
                  <div className="dropdown-menu">
                    <Link to="/profile" onClick={() => setMenuOpen(false)}>Mi perfil</Link>
                    <Link to="/settings" onClick={() => setMenuOpen(false)}>Configuración</Link>
                    <button onClick={() => { logout(); setMenuOpen(false); }}>
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="buttons">
                <Link to="/signup" className="button is-primary"><strong>Sign up</strong></Link>
                <Link to="/login" className="button is-light">Log in</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;