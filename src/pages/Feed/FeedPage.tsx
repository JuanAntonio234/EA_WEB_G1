import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Activity } from '../../types/activityTypes';
import ActivityList from '../../components/Activities/ActivityList';
import { mockFeedActivities } from '../../mockdata/mockFeedActivities';
import styles from './FeedPage.module.css';
import { useAuth } from '../../hooks/useAuth';

const FeedPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [feedActivities, setFeedActivities] = useState<Activity[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true, state: { from: '/feed' } });
      return; 
    }
    const fetchFeed = () => {
      setIsLoadingData(true);
      setError(null);
      try {
        setTimeout(() => {
          const sortedActivities = [...mockFeedActivities].sort(
            (a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
          );
          setFeedActivities(sortedActivities);
          setIsLoadingData(false);
        }, 500); 
      } catch (err) {
        console.error("Error simulating feed fetch:", err);
        setError(t('feedPage.error'));
        setIsLoadingData(false);
      }
    };

    fetchFeed();
  }, [t, user, navigate]); 
  if (isLoadingData && !error) { 
    return <div className={styles.messageContainer}>{t('feedPage.loading')}</div>;
  }

  if (error) {
    return <div className={`${styles.messageContainer} ${styles.error}`}>{error}</div>;
  }
  
  if (!user) {
    return <div className={styles.messageContainer}>{t('feedPage.notLoggedIn')}</div>;
  }

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>{t('feedPage.title')}</h1>
      <ActivityList activities={feedActivities} showAuthorInfo={true} />
    </div>
  );
};

export default FeedPage;
