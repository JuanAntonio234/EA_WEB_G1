import { useCallback, useEffect, useState } from 'react';
import { getActivitiesByUserId } from '../../services/activityService';
import { Activity } from '../../types/activityTypes';
import ActivityList from '../../components/Activities/ActivityList';
import styles from './ActivitiesPage.module.css';

const ActivitiesPage = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userId = localStorage.getItem('userId');

  const fetchActivities = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await getActivitiesByUserId(userId);
      
      if (Array.isArray(data)) {
        const sortedActivities = data.sort(
          (a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
        );
        setActivities(sortedActivities);
      } else {
        console.warn("La respuesta de la API no es un array como se esperaba.", data);
        setActivities([]);
      }

    } catch (err) {
      console.error('Error fetching activities:', err);
      setError('No se pudieron cargar las actividades.');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  if (isLoading) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Mis Actividades</h1>
        <p className={styles.messageContainer}>Cargando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Mis Actividades</h1>
        <p className={`${styles.messageContainer} ${styles.error}`}>{error}</p>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Mis Actividades</h1>
        <p className={styles.messageContainer}>Por favor, inicia sesión para ver tus actividades.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Mis Actividades</h1>
      {activities.length > 0 ? (
        <ActivityList activities={activities} showAuthorInfo={false} />
      ) : (
        <p className={styles.messageContainer}>Aún no tienes actividades registradas.</p>
      )}
    </div>
  );
};

export default ActivitiesPage;
