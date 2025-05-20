import React, { useEffect, useState } from 'react';
import { Activity } from '../../types/activityTypes';
import { getAllPublicActivities } from '../../services/activityService';
import ActivityList from '../../components/Activities/ActivityList';
import styles from './ExploreRoutesPage.module.css';

const ExploreRoutesPage: React.FC = () => {
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
        const errorMessage = err.response?.data?.message || err.message || 'No s\'han pogut carregar les rutes.';
        setError(errorMessage);
        setRoutes([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoutes();
  }, []);

  if (isLoading) {
    return <div className={styles.messageContainer}>Carregant rutes disponibles...</div>;
  }

  if (error) {
    return <div className={`${styles.messageContainer} ${styles.error}`}>Error: {error}</div>;
  }

  return (
    <div className={styles.pageContainer}>
      <h2 className={styles.pageTitle}>Explora Rutes i Activitats 🗺️</h2>
      <ActivityList activities={routes} />
    </div>
  );
};

export default ExploreRoutesPage;