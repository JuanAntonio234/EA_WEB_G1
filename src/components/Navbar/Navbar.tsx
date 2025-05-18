import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

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
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Si el menú está abierto y el click NO está dentro del menú, lo cerramos
      if (menuOpen && menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    // Escuchamos el click en todo el documento
    document.addEventListener('mousedown', handleClickOutside);
    // Cleanup: removemos el listener cuando se desmonta o cambia menuOpen
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

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
              <div className="user-menu" ref={menuRef}>
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
                    <Link to={`/profile/${user.id}`} onClick={() => setMenuOpen(false)}>Mi perfil</Link>
                    <Link to="/settings" onClick={() => setMenuOpen(false)}>Configuración</Link>
                    <button onClick={() => { logout(); setMenuOpen(false); navigate('/home');}}>
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="buttons">
                <Link to="/register" className="button is-primary"><strong>Sign up</strong></Link>
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