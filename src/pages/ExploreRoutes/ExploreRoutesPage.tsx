import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Activity } from '../../types/activityTypes';
import { getAllPublicActivities } from '../../services/activityService';
import ActivityList from '../../components/Activities/ActivityList';
import styles from './ExploreRoutesPage.module.css';

const ExploreRoutesPage: React.FC = () => {
  const { t } = useTranslation();
  const [routes, setRoutes] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchRoutes = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data: Activity[] = await getAllPublicActivities(); 
        setRoutes(data);
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || err.message || t('exploreRoutesPage.error');
        setError(errorMessage);
        setRoutes([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoutes();
  }, [t]);

  if (isLoading) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.messageContainer}>
          {t('exploreRoutesPage.loading')}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.pageContainer}>
        <div className={`${styles.messageContainer} ${styles.error}`}>
          {typeof error === 'string' ? error : t('exploreRoutesPage.error')}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>
        {t('exploreRoutesPage.title')}
      </h1>
      <ActivityList activities={routes} showAuthorInfo={true} /> 
    </div>
  );
};

export default ExploreRoutesPage;