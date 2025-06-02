import React, { useEffect, useState } from 'react';
import { Achievement } from '../../types/achievementTypes'; 
import { getUserById } from '../../services/userService'; // <-- import this
import { getAchievementById } from '../../services/achievementService'; // <-- import this
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
        const userData = await getUserById(user.id);
        if (userData && userData.achievements && userData.achievements.length > 0) {
          const achievementPromises = userData.achievements.map((id: string) => getAchievementById(id));
          const achievementData = await Promise.all(achievementPromises);
          setAchievements(achievementData);
        } else {
          setAchievements([]);
          setError('No tens assoliments encara.');
        }
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || err.message || 'No s\'han pogut carregar els assoliments.';
        setError(errorMessage);
        setAchievements([]);
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