import React, { useEffect, useState, useRef } from 'react';
import Navbar from '../components/Navbar/Navbar';
import './layout.css';
import Footer from '../components/Footer/Footer';
import { useAccessibility } from '../context/AccessibilityContext';

interface LayoutProps {
  children: React.ReactNode;
}

const navLinks = [
  { href: '/', labelKey: 'navbar.home' },
  { href: '/explore-routes', labelKey: 'navbar.exploreRoutes' },
];

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { 
    fontScale, 
    isReadingMode, 
    isDyslexiaFont, 
    areLinksHighlighted 
  } = useAccessibility();

  const [isNavbarVisible, setNavbarVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      return; 
    }

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        setNavbarVisible(false);
      } else {
        setNavbarVisible(true);
      }
      // Actualizamos el ref sin causar un nuevo render.
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); 

  const layoutClasses = [
    'layout-container',
    isReadingMode ? 'reading-mode' : '',
    isDyslexiaFont ? 'dyslexia-font' : '',
    areLinksHighlighted ? 'highlight-links' : ''
  ].filter(Boolean).join(' '); 

  return (
    <div className={layoutClasses} style={{ fontSize: `${fontScale}rem` }}>
      <a href="#main-content" className="skip-link">
        Saltar al contenido principal
      </a>

      <Navbar
        title="TRAZER"
        links={navLinks}
        className={isNavbarVisible ? 'navbar-visible' : 'navbar-hidden'}
      />

      <main id="main-content" className="main-content">
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default Layout;