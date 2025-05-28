import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getActivitiesByUserId, PaginatedActivities } from '../../services/activityService'; 
import { Activity } from '../../types/activityTypes';
import ActivityList from '../../components/Activities/ActivityList';
import styles from './ActivitiesPage.module.css'; 
import { useTranslation } from 'react-i18next';

const ActivitiesPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [userActivities, setUserActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 4; 

  useEffect(() => {
    if (user && user.id) { 
      const fetchActivities = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const paginatedData: PaginatedActivities = await getActivitiesByUserId(user.id, currentPage, itemsPerPage);
          setUserActivities(paginatedData.activities);
          setTotalPages(paginatedData.totalPages);
        } catch (err: any) {
          setError(t('activitiesPage.errorLoading', "Error carregant les teves activitats."));
          setUserActivities([]);
          setTotalPages(0);
        } finally {
          setIsLoading(false);
        }
      };
      fetchActivities();
    } else {
      setIsLoading(false);
    }
  }, [user, currentPage, itemsPerPage, t]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (isLoading) {
    return <div className={styles.messageContainer}>{t('general.loading', 'Carregant...')}</div>;
  }

  if (error) {
    return <div className={`${styles.messageContainer} ${styles.error}`}>{error}</div>;
  }
  
  if (!user) {
    return <div className={styles.messageContainer}>{t('activitiesPage.notLoggedIn', "Has d'iniciar sessió per veure les teves activitats.")}</div>;
  }

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>{t('navbar.myActivities', "Les Meves Activitats")}</h1>
      <ActivityList activities={userActivities} showAuthorInfo={false} /> 
      
      {totalPages > 1 && (
        <div className={styles.paginationControls}>
          <button onClick={handlePrevPage} disabled={currentPage <= 1}>
            {t('general.previous', 'Anterior')}
          </button>
          <span> {t('exploreRoutesPage.pagination', "Pàgina {{currentPage}} de {{totalPages}}", { currentPage, totalPages })} </span>
          <button onClick={handleNextPage} disabled={currentPage >= totalPages}>
            {t('general.next', 'Següent')}
          </button>
        </div>
      )}
    </div>
  );
};

export default ActivitiesPage;
