import React from 'react';
import './FeaturesPage';

const FeaturesPage: React.FC = () => {
  return (
    <div className="features-page container">
      <h1>Características de MiClonStrava</h1>
      <p className="features-intro">
        Descubre todo lo que nuestra aplicación te ofrece para llevar tu entrenamiento al siguiente nivel.
      </p>

      <div className="feature-list">
        <div className="feature-detail-item">
          <h2>Seguimiento GPS Detallado</h2>
          <p>Registra con precisión tus rutas, distancia, ritmo y elevación para carreras, ciclismo, senderismo y más. Visualiza tus actividades en mapas interactivos.</p>
        </div>
        <div className="feature-detail-item">
          <h2>Análisis de Rendimiento</h2>
          <p>Obtén estadísticas completas de tus entrenamientos. Analiza tu progreso a lo largo del tiempo, compara actividades y descubre tus puntos fuertes y áreas de mejora.</p>
        </div>
        <div className="feature-detail-item">
          <h2>Comunidad y Conexión Social</h2>
          <p>Conéctate con amigos y otros atletas. Comparte tus actividades, comenta las de otros, únete a clubs y participa en desafíos para mantenerte motivado.</p>
        </div>
        <div className="feature-detail-item">
          <h2>Segmentos y Competición</h2>
          <p>Compite en segmentos populares y compara tus tiempos con los de la comunidad. ¡Lucha por ser el Rey o la Reina de la Montaña (KOM/QOM)!</p>
        </div>
        <div className="feature-detail-item">
          <h2>Privacidad y Control</h2>
          <p>Tú decides qué compartes y con quién. Configura zonas de privacidad y ajusta tus preferencias para controlar tu información.</p>
        </div>
      </div>
    </div>
  );
};

export default FeaturesPage;