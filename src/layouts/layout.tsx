import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar/Navbar'; 
import './layout.css'; 
import Footer from '../components/Footer/Footer';

interface LayoutProps {
  children: React.ReactNode; 
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
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
    { href: '/about', labelKey: 'navbar.about' }
  ];

  return (
    <div className="layout-container">
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
