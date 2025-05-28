import React, { useEffect, useState } from 'react';
import { Achievement } from '../../types/achievementTypes'; 
import { getUserAchievements } from '../../services/achievementService'; 
import AchievementList from '../../components/Achievements/AchievementList'; 
import { useAuth } from '../../hooks/useAuth';

const AchievementsPage: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth(); 

  useEffect(() => {
    if (!user || !user.id) {
      setError("Informació d'usuari no disponible. Assegura't d'haver iniciat sessió.");
      setIsLoading(false);
      return;
    }

    const fetchAchievements = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getUserAchievements(user.id);
        console.log('Data rebuda del servei:', data);
        if (Array.isArray(data)) { 
            setAchievements(data);
        } else {
        console.error('Error: La data rebuda del servei no és un array!', data);
        setAchievements([]); 
        setError('S\'ha rebut un format de dades inesperat del servidor.');
        }

      } catch (err: any) {
        const errorMessage = err.response?.data?.message || err.message || 'No s\'han pogut carregar els assoliments.';
        setError(errorMessage);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAchievements();
  }, [user]); 

  if (isLoading) {
    return <div style={{ textAlign: 'center', padding: '20px' }}>Carregant assoliments...</div>;
  }

  if (error) {
    return <div style={{ color: 'red', textAlign: 'center', padding: '20px' }}>Error: {error}</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#2c3e50' }}>Els Meus Assoliments 🏆</h2>
      <AchievementList achievements={achievements} />
    </div>
  );
};

export default AchievementsPage;