import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './UserProfilePage';
import Button from '../../components/Button/Button';

// Definición de tipos para los datos mock (y futuros datos de API)
interface UserProfileData {
  id: string;
  name: string;
  email: string;
  joinDate: string;
  avatarUrl: string;
  bio?: string;
}

interface UserStats {
  totalDistance: string;
  totalActivities: number;
  lastActivitySummary: string;
}

interface Activity {
  id: string;
  name: string;
  distance: string;
  date: string;
  type: 'Carrera' | 'Bicicleta' | 'Senderismo'; // Ejemplo de tipos
}

// Props para la página, isMyProfile puede venir de App.tsx
interface UserProfilePageProps {
  isMyProfile?: boolean;
}

const UserProfilePage: React.FC<UserProfilePageProps> = ({ isMyProfile }) => {
  const { userId } = useParams<{ userId: string }>(); // Obtiene el userId de la URL si existe
  const [userData, setUserData] = useState<UserProfileData | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Determinar qué perfil cargar (el propio o el de otro usuario)
  const profileIdToLoad = isMyProfile ? 'me' : userId;

  useEffect(() => {
    // --- SIMULACIÓN DE CARGA DE DATOS DE API ---
    setIsLoading(true);
    console.log(`Cargando perfil para: ${profileIdToLoad}`);

    setTimeout(() => {
      // Datos mock (en una app real, esto vendría de una llamada a la API)
      const mockUserData: UserProfileData = {
        id: profileIdToLoad || 'mockUser123',
        name: isMyProfile ? "Mi Nombre Perfil" : `Usuario ${profileIdToLoad}`,
        email: isMyProfile ? "miemail@ejemplo.com" : `usuario${profileIdToLoad}@ejemplo.com`,
        joinDate: "15 de Enero, 2024",
        avatarUrl: `https://i.pravatar.cc/150?u=${profileIdToLoad || 'default'}`, // Avatar aleatorio
        bio: isMyProfile ? "Apasionado por el trail running y el ciclismo de montaña." : "Le encanta correr por las mañanas.",
      };

      const mockUserStats: UserStats = {
        totalDistance: "350 km",
        totalActivities: 42,
        lastActivitySummary: "Carrera Urbana - 10km",
      };

      const mockRecentActivities: Activity[] = [
        { id: '1', name: "Ruta del Sol", distance: "12.5 km", date: "Hace 2 días", type: 'Bicicleta' },
        { id: '2', name: "Entrenamiento Matutino", distance: "7.0 km", date: "Hace 3 días", type: 'Carrera' },
        { id: '3', name: "Paseo por el Bosque", distance: "5.8 km", date: "Hace 5 días", type: 'Senderismo' },
      ];

      setUserData(mockUserData);
      setUserStats(mockUserStats);
      setRecentActivities(mockRecentActivities);
      setIsLoading(false);
    }, 1000); // Simular delay de red

    // --- FIN DE SIMULACIÓN ---
  }, [profileIdToLoad, isMyProfile]);

  if (isLoading) {
    return <div className="profile-page container"><p>Cargando perfil...</p></div>;
  }

  if (!userData) {
    return <div className="profile-page container"><p>No se pudo cargar el perfil.</p></div>;
  }

  return (
    <div className="profile-page container">
      <header className="profile-header">
        <img src={userData.avatarUrl} alt={`Avatar de ${userData.name}`} className="profile-avatar" />
        <div className="profile-info">
          <h1>{userData.name}</h1>
          <p className="profile-email">{userData.email}</p>
          <p className="profile-joindate">Miembro desde: {userData.joinDate}</p>
          {userData.bio && <p className="profile-bio">{userData.bio}</p>}
          {isMyProfile && <Button variant="secondary" onClick={() => alert('Editar perfil no implementado')}>Editar Perfil</Button>}
        </div>
      </header>

      <section className="profile-stats">
        <h2>Estadísticas Destacadas</h2>
        {userStats ? (
          <div className="stats-grid">
            <div className="stat-item">
              <span>{userStats.totalActivities}</span>
              <p>Actividades Totales</p>
            </div>
            <div className="stat-item">
              <span>{userStats.totalDistance}</span>
              <p>Distancia Total</p>
            </div>
            <div className="stat-item">
              <span>{userStats.lastActivitySummary}</span>
              <p>Última Actividad (Resumen)</p>
            </div>
          </div>
        ) : <p>No hay estadísticas disponibles.</p>}
      </section>

      <section className="profile-activities">
        <h2>Actividades Recientes</h2>
        {recentActivities.length > 0 ? (
          <ul className="activity-list">
            {recentActivities.map(activity => (
              <li key={activity.id} className="activity-item">
                <h3>{activity.name} ({activity.type})</h3>
                <p>Distancia: {activity.distance}</p>
                <p>Fecha: {activity.date}</p>
              </li>
            ))}
          </ul>
        ) : <p>No hay actividades recientes para mostrar.</p>}
      </section>
    </div>
  );
};

export default UserProfilePage;