import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './ActivityDetailPage.css';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import Button from '../../components/Button/Button'; 

interface ActivityData {
  id: string;
  name: string;
  type: string;
  date: string;
  distance: string;
  duration: string;
  elevation: string;
  pace: string;
  calories: string;
  description?: string;
  mapImageUrl?: string; 
}

// Mock data - en una app real, esto vendría de una API
const mockActivities: ActivityData[] = [
  { id: '1', name: "Ruta del Sol", type: "Bicicleta", date: "Hace 2 días", distance: "12.5 km", duration: "45 min", elevation: "120 m", pace: "3:36 min/km", calories: "350 kcal", mapImageUrl: "https://via.placeholder.com/800x400.png?text=Mapa+de+Ruta+del+Sol", description: "Un paseo agradable por la mañana con buen tiempo." },
  { id: '2', name: "Entrenamiento Matutino", type: "Carrera", date: "Hace 3 días", distance: "7.0 km", duration: "35 min", elevation: "50 m", pace: "5:00 min/km", calories: "400 kcal", mapImageUrl: "https://via.placeholder.com/800x400.png?text=Mapa+Entrenamiento" },
  { id: '3', name: "Paseo por el Bosque", type: "Senderismo", date: "Hace 5 días", distance: "5.8 km", duration: "1h 15min", elevation: "250 m", pace: "12:55 min/km", calories: "500 kcal", description: "Ruta con bonitas vistas y algo de barro." },
];

const ActivityDetailPage: React.FC = () => {
  const { activityId } = useParams<{ activityId: string }>();
  const [activity, setActivity] = useState<ActivityData | null | undefined>(undefined); // undefined para estado inicial, null si no se encuentra
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    console.log(`Buscando actividad con ID: ${activityId}`);
    // Simular carga de API
    setTimeout(() => {
      const foundActivity = mockActivities.find(act => act.id === activityId);
      setActivity(foundActivity || null); // null si no se encuentra
      setIsLoading(false);
    }, 500);
  }, [activityId]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!activity) {
    return (
      <div className="activity-detail-page container">
        <h2>Actividad no encontrada</h2>
        <p>No pudimos encontrar la actividad que estás buscando.</p>
        <Link to="/profile/me"> {/* O a un dashboard/feed */}
          <Button>Volver a mi perfil</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="activity-detail-page container">
      <header className="activity-header">
        <h1>{activity.name}</h1>
        <p className="activity-meta">
          {activity.type} - {activity.date}
        </p>
      </header>

      {activity.mapImageUrl && (
        <div className="activity-map">
          <img src={activity.mapImageUrl} alt={`Mapa de ${activity.name}`} />
        </div>
      )}

      <section className="activity-stats-overview">
        <div className="stat-card"><span>Distancia</span><p>{activity.distance}</p></div>
        <div className="stat-card"><span>Duración</span><p>{activity.duration}</p></div>
        <div className="stat-card"><span>Ritmo</span><p>{activity.pace}</p></div>
        <div className="stat-card"><span>Elevación</span><p>{activity.elevation}</p></div>
        <div className="stat-card"><span>Calorías</span><p>{activity.calories}</p></div>
      </section>

      {activity.description && (
        <section className="activity-description">
          <h2>Descripción</h2>
          <p>{activity.description}</p>
        </section>
      )}

      <section className="activity-actions">
        {/* Placeholders para acciones futuras */}
        <Button variant="secondary" onClick={() => alert('Editar no implementado')}>Editar Actividad</Button>
        <Button variant="primary" style={{backgroundColor: '#dc3545', marginLeft: '10px'}} onClick={() => alert('Eliminar no implementado')}>Eliminar Actividad</Button>
      </section>

      {/* Sección de comentarios (UI Placeholder) */}
      <section className="activity-comments">
        <h2>Comentarios</h2>
        <div className="comment-item">
          <p><strong>Usuario Ejemplo:</strong> ¡Buena ruta!</p>
          <span>Hace 1 hora</span>
        </div>
        <textarea placeholder="Añade un comentario..." rows={3}></textarea>
        <Button onClick={() => alert('Comentario no implementado')}>Enviar Comentario</Button>
      </section>
    </div>
  );
};

export default ActivityDetailPage;