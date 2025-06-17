import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar/Navbar'; 
import './layout.css'; 
import Footer from '../components/Footer/Footer';
import { useAccessibility } from '../context/AccessibilityContext'; // 1. IMPORTAR

interface LayoutProps {
  children: React.ReactNode; 
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { fontScale } = useAccessibility(); 
  const [isNavbarVisible, setNavbarVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll=()=>{
      if(window.scrollY > lastScrollY && window.scrollY > 50){
        setNavbarVisible(false);
      }else{
        setNavbarVisible(true);
      }
      setLastScrollY(window.scrollY);
    }
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  },[lastScrollY]);

  const navLinks = [
    { href: '/', labelKey: 'navbar.home' },
    { href: '/explore-routes', labelKey: 'navbar.exploreRoutes' },
  ];
  
  return (
    <div className="layout-container" style={{ fontSize: `${fontScale}rem` }}>
      <Navbar 
        title="TRAZER"  
        links={navLinks} 
        className={isNavbarVisible ? 'navbar-visible' : 'navbar-hidden'}
      />
      <main className="main-content">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;