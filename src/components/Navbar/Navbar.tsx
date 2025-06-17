import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from 'react-i18next';
import SearchBar from '../SearchBar/SearchBar';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';

interface NavLink {
  href: string;
  labelKey: string;
}

interface NavbarProps {
  title: string;
  links: NavLink[];
  className?: string;
}

const Navbar: React.FC<NavbarProps> = ({ title, links, className }) => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
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
        <Link to="/" className="navbar-item">{t(title)}</Link>
      </div>
      <div className="navbar-menu">
        <div className="navbar-start">
          {links.map((link) => (
            <Link key={link.href} to={link.href} className="navbar-item">
              {t(link.labelKey)}
            </Link>
          ))}
        </div>
        <div className="navbar-search">
        <SearchBar />
        </div>
        <div className='navbar-controls-right'>
            <div className='navbar-darkmode-toggle'>
            <button
                className="darkmode-toggle"
                onClick={toggleDark}
                title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                aria-label="Toggle dark mode"
            >
                {darkMode ? "🌙" : "☀️"}
            </button>
            </div>
            <LanguageSwitcher />
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
                    <Link to={`/profile/${user.id}`} onClick={() => setMenuOpen(false)}>
                      {t('navbar.myProfile')}
                    </Link>
                    <Link to="/activities" onClick={() => setMenuOpen(false)}>
                      {t('navbar.myActivities')}
                    </Link>
                    <Link to="/my-achievements" onClick={() => setMenuOpen(false)}>
                      {t('navbar.myAchievements')}
                    </Link>
                    <Link to="/profile/edit" onClick={() => setMenuOpen(false)}>
                      {t('navbar.settings')}
                    </Link>
                    <Link to="/change-password" onClick={() => setMenuOpen(false)}>
                      {t('navbar.changePassword')}
                    </Link>
                    <button onClick={() => { logout(); setMenuOpen(false); navigate('/');}}>
                      {t('navbar.logout')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="buttons">
                <Link to="/register" className="button is-primary"><strong>{t('navbar.signup')}</strong></Link>
                <Link to="/login" className="button is-light">{t('navbar.login')}</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
