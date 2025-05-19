import { useEffect, useState } from 'react';
import { getActivitiesByUserId } from '../../services/activityService';
import { Activity } from '../../types/activityTypes';
import ActivityList from '../../components/Activities/ActivityList';
import styles from './ActivitiesPage.module.css';

const ActivitiesPage = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const userId = localStorage.getItem('userId'); 

  const fetchActivities = async (page: number) => {
    if (!userId) return;
console.log('userId:', userId);
    try {
      const data = await getActivitiesByUserId(userId, page, 4);
      console.log('Respuesta del backend:', data);

      setActivities(data.activities);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  useEffect(() => {
    fetchActivities(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Mis Actividades</h1>
      <ActivityList activities={activities} />

      {/* Controles de paginación */}
      <div className={styles.pagination}>
        <button
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
          className={styles.pageButton}
        >
          Anterior
        </button>
        <span className={styles.pageInfo}>Página {currentPage} de {totalPages}</span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
          className={styles.pageButton}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default ActivitiesPage;
