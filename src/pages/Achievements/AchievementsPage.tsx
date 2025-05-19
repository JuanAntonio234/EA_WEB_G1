import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Achievement } from '../../types/achievementTypes'; 
import { User } from '../../types/userTypes'; 

import { getAchievementById } from '../../services/achievementsService'; 
import { getUserById } from '../../services/userService'; 

import AchievementList from '../../components/Achievements/AchievementList'; 
import { useAuth } from '../../context/AuthContext'; 
import styles from './AchievementsPage.module.css'; 

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
        console.log("AchievementsPage: Intentando obtener userId de localStorage. Valor:", currentUserId);

        if (!currentUserId) {
          console.error("AchievementsPage: No se encontró userId en localStorage.");
          throw new Error('No se encontró el ID del usuario. Por favor, inicia sesión de nuevo.');
        }

        console.log("AchievementsPage: Llamando a getUserById con userId:", currentUserId);
        const userData: User = await getUserById(currentUserId);
        
        const unlockedAchievementIds = userData.achievements; 
        console.log("AchievementsPage: IDs de logros del usuario:", unlockedAchievementIds);

        if (!unlockedAchievementIds || unlockedAchievementIds.length === 0) {
          setAchievements([]); 
          console.log("AchievementsPage: El usuario no tiene logros asignados.");
          setLoading(false);
          return;
        }

        console.log("AchievementsPage: Obteniendo detalles para los IDs de logros:", unlockedAchievementIds);
        const achievementPromises = unlockedAchievementIds.map(id => 
          getAchievementById(id).catch(err => {
            console.error(`AchievementsPage: Error al obtener el logro con ID ${id}:`, err);
            return null; 
          })
        );
        
        const resolvedPromises = await Promise.all(achievementPromises);

        const successfullyFetchedAchievements = resolvedPromises.filter(
          (achievement): achievement is Achievement => achievement !== null
        );
        
        console.log("AchievementsPage: Logros obtenidos con éxito:", successfullyFetchedAchievements);
        setAchievements(successfullyFetchedAchievements);

      } catch (err: any) {
        let errorMessage = 'Ocurrió un error desconocido al cargar los datos de logros.';
        if (err instanceof Error) {
            errorMessage = err.message;
        } else if (typeof err === 'string') {
            errorMessage = err;
        }
        console.error("AchievementsPage: Error en fetchUserAndAchievements:", errorMessage, err);
        setError(errorMessage);
        
        const lowerCaseError = errorMessage.toLowerCase();
        if (lowerCaseError.includes("no autorizado") || 
            lowerCaseError.includes("autenticado") ||
            lowerCaseError.includes("no se encontró el id del usuario") ||
            (err.response && (err.response.status === 401 || err.response.status === 403))) {
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
    return <div className={styles.achievementsStatus}>Cargando tus logros...</div>;
  }

  if (error) {
    return <div className={`${styles.achievementsStatus} ${styles.errorMessage}`}>Error: {error}</div>;
  }

  return (
    <div className={styles.achievementsPageContainer}>
      <h1 className={styles.achievementsPageTitle}>Mis Logros</h1>
      {achievements.length === 0 && !loading && (
        <p className={styles.achievementsStatus}>Aún no has desbloqueado ningún logro, ¡sigue esforzándote!</p>
      )}
      <AchievementList achievements={achievements} />
    </div>
  );
};

export default AchievementsPage;
