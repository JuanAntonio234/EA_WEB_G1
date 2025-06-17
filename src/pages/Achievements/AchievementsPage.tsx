import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Achievement } from '../../types/achievementTypes'; 
import { getUserById } from '../../services/userService';
import { getAchievementById } from '../../services/achievementService';
import AchievementList from '../../components/Achievements/AchievementList'; 
import { useAuth } from '../../hooks/useAuth';
import styles from './AchievementsPage.module.css';

const AchievementsPage: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();
  const { user } = useAuth(); 

  useEffect(() => {
    if (!user || !user.id) {
      setError(t('achievementsPage.errorUserNotAuthenticated'));
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
          setError(t('achievementsPage.noAchievements'));
        }
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || err.message || t('achievementsPage.error');
        setError(errorMessage);
        setAchievements([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAchievements();
  }, [user, t]);

  if (isLoading) {
    return <div className={styles.loadingMessage}>{t('achievementsPage.loading')}</div>;
  }

  if (error) {
    return <div className={styles.errorMessage}>{t('general.error')}: {error}</div>;
  }

  return (
    <div className={styles.achievementsContainer}>
      <h2 className={styles.achievementsTitle}>
        {t('achievementsPage.title')}
      </h2>
      <AchievementList achievements={achievements} />
    </div>
  );
};

export default AchievementsPage;