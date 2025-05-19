import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Achievement } from '../../types/achievementTypes'; 
import { User } from '../../types/userTypes'; 
import { getAchievementById } from '../../services/achievementsService'; 
import { getUserById } from '../../services/userService'; 
import AchievementList from '../../components/Achievements/AchievementList'; 
import { useAuth } from '../../context/AuthContext'; 
import './AchievementsPage.css'; 

const AchievementsPage: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const { isAuthenticated } = useAuth(); 
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/achievements' }, replace: true });
      return; 
    }

    const fetchUserAndAchievements = async () => {
      try {
        setLoading(true);
        setError(null);

        const currentUserId = localStorage.getItem('userId');
        if (!currentUserId) {
          throw new Error('No se encontró el ID del usuario. Por favor, inicia sesión de nuevo.');
        }

        const userData: User = await getUserById(currentUserId);

        const unlockedAchievementIds = userData.achievements;

        if (!unlockedAchievementIds || unlockedAchievementIds.length === 0) {
          setAchievements([]); 
          setLoading(false);
          return;
        }

        const achievementPromises = unlockedAchievementIds.map(id => 
          getAchievementById(id).catch(err => {
            console.error(`Error al obtener el logro con ID ${id}:`, err);
            return null; 
          })
        );
        
        const resolvedPromises = await Promise.all(achievementPromises);

        const successfullyFetchedAchievements = resolvedPromises.filter(
          (achievement): achievement is Achievement => achievement !== null
        );
        
        setAchievements(successfullyFetchedAchievements);

      } catch (err: any) {
        let errorMessage = 'Ocurrió un error desconocido al cargar los datos de logros.';
        if (err instanceof Error) {
            errorMessage = err.message;
        } else if (typeof err === 'string') {
            errorMessage = err;
        }
        
        setError(errorMessage);

        const lowerCaseError = errorMessage.toLowerCase();
        if (lowerCaseError.includes("no autorizado") || 
            lowerCaseError.includes("autenticado") ||
            lowerCaseError.includes("no se encontró el id del usuario") ||
            (err.response && (err.response.status === 401 || err.response.status === 403))) {
            localStorage.removeItem('userId');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
          navigate('/login', { state: { from: '/achievements' }, replace: true });
        }
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) { 
        fetchUserAndAchievements();
    }
  }, [isAuthenticated, navigate]); 

  if (!isAuthenticated && !loading) { 
    return <p>Redirigiendo a la página de inicio de sesión...</p>;
  }

  if (loading) {
    return <div className="achievements-status">Cargando tus logros...</div>;
  }

  if (error) {
    return <div className="achievements-status error-message">Error: {error}</div>;
  }

  return (
    <div className="achievements-page-container">
      <h1 className="achievements-page-title">Mis Logros</h1>
      {achievements.length === 0 && !loading && ( 
        <p className="achievements-status">Aún no has desbloqueado ningún logro, ¡sigue esforzándote!</p>
      )}
      <AchievementList achievements={achievements} />
    </div>
  );
};

export default AchievementsPage;
