import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../SearchBar/SearchBar';


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
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  const [darkMode, setDarkMode] = useState(() =>
    localStorage.getItem('darkmode') === 'true' ||
    (localStorage.getItem('darkmode') === null && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );

  const toggleDark = () => {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    setDarkMode(isDark);
    localStorage.setItem('darkmode', isDark.toString());
  };

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

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
        <div className="navbar-search">
        <SearchBar />
        </div>
        <div className='navbar-darmode-toggle'>
          <button
            className="darkmode-toggle"
            onClick={toggleDark}
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            aria-label="Toggle dark mode"
          >
            {darkMode ? "🌙" : "☀️"}
          </button>
        </div>
        <div className="navbar-end">
          <div className="navbar-item">
            {user ? (
              <div className="user-menu" ref={menuRef}>
                <div className="user-avatar-container" onClick={() => setMenuOpen(!menuOpen)}>
                  {user.profilePicture ? (
                    <img src={user.profilePicture || '/default-profile.png'} alt="Avatar" className="user-avatar" />
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
                    <Link to="/activities" onClick={() => setMenuOpen(false)}>Les meves activitats</Link>
                    <button onClick={() => { logout(); setMenuOpen(false); navigate('/');}}>
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