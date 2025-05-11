import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import './MainLayout';

const MainLayout: React.FC = () => {
  return (
    <div className="main-layout">
      <Navbar />
      <main className="main-content">
        <Outlet /> {/* Aquí se renderizarán las páginas */}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;