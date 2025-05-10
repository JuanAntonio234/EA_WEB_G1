import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

interface NavLink {
  href: string;
  label: string;
}

interface NavbarProps {
  title: string;
  links: NavLink[];
  className?: string;
}

const Navbar: React.FC<NavbarProps> = ({ title, links,className }) => {
  return (
    <nav className={`navbar ${className} ?? ''}`}>
      <div className="navbar-brand">
        <Link to="/" className="navbar-item">
          {title}
        </Link>
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
            <div className="buttons">
              <Link to="/signup" className="button is-primary">
                <strong>Sign up</strong>
              </Link>
              <Link to="/login" className="button is-light">
                Log in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
