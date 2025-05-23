import { useCallback, useEffect, useRef, useState } from 'react';
import { getActivitiesByUserId } from '../../services/activityService';
import { Activity } from '../../types/activityTypes';
import ActivityList from '../../components/Activities/ActivityList';
import styles from './ActivitiesPage.module.css';

const ActivitiesPage = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);

  const userId = localStorage.getItem('userId');

  const fetchActivities = useCallback(
    async (page: number) => {
      if (!userId || !hasMore) return;

      try {
        const data = await getActivitiesByUserId(userId, page, 4);
        console.log('Respuesta del backend:', data);

        setActivities(prev => {
          const existingIds = new Set(prev.map(a => a._id));
          const newActivities = data.activities.filter(a => !existingIds.has(a._id));
          return [...prev, ...newActivities];
        });

        setHasMore(data.currentPage < data.totalPages);
      } catch (error) {
        console.error('Error fetching activities:', error);
      }
    },
    [userId, hasMore]
  );

  useEffect(() => {
    fetchActivities(currentPage);
  }, [fetchActivities, currentPage]);

  const lastItemRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          setCurrentPage(prev => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [hasMore]
  );

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Mis Actividades</h1>
      <ActivityList activities={activities} lastItemRef={lastItemRef} />
    </div>
  );
};

export default ActivitiesPage;