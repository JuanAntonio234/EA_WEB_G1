// src/pages/HomePage/HomePage.tsx
import React from 'react';
import './HomePage';
import Button from '../../components/Button/Button'; // Importa el botón

const HomePage: React.FC = () => {
  const handleDownloadAndroid = () => {
    alert('Redirigiendo a Play Store (simulado)');
    // window.location.href = "https://play.google.com/store/apps/details?id=com.tuapp.id";
  };

  const handleDownloadIOS = () => {
    alert('Redirigiendo a App Store (simulado)');
    // window.location.href = "https://apps.apple.com/app/tu-app-nombre/idYOUR_APPLE_ID";
  };

  return (
    <div className="home-page container"> {/* Usa la clase container */}
      <header className="home-hero">
        <h1>Bienvenido a MiClonStrava</h1>
        <p>Monitoriza tus carreras, salidas en bici y mucho más. ¡Únete a nuestra comunidad!</p>
        <div className="hero-buttons">
          <Button onClick={handleDownloadAndroid} variant="primary">
            Descargar para Android
          </Button>
          <Button onClick={handleDownloadIOS} variant="secondary">
            Descargar para iOS
          </Button>
        </div>
      </header>

      <section className="home-features-overview">
        <h2>¿Por qué elegirnos?</h2>
        <div className="features-grid">
          <div className="feature-item">
            <h3>Seguimiento Preciso</h3>
            <p>GPS detallado para todas tus actividades.</p>
          </div>
          <div className="feature-item">
            <h3>Comunidad Activa</h3>
            <p>Comparte y compite con amigos.</p>
          </div>
          <div className="feature-item">
            <h3>Análisis Detallado</h3>
            <p>Estadísticas para mejorar tu rendimiento.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;