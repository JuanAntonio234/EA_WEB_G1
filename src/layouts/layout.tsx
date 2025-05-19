import { useEffect, useState } from 'react';
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
      if(window.scrollY>lastScrollY){
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
    { href: '/', label: 'Inici' },
    { href: '/about', label: 'Sobre nosaltres' }
  ];

  return (
    <div className="layout-container">
      <Navbar title="SportsTracker" links={navLinks} 
      className={isNavbarVisible?'navbar-visible' : 'navbar-hidden'}/>
      <main className="main-content">
        {children} {/* Aquí se renderizará el contenido específico de cada página */}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;