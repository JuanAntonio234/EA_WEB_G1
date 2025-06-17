import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Activity } from '../../types/activityTypes';
import ActivityList from '../../components/Activities/ActivityList';
import styles from './FeedPage.module.css';
import { useAuth } from '../../hooks/useAuth';
import { getFullActivityFeed } from '../../services/activityService'; 

const FeedPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [feedActivities, setFeedActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeed = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);
    
    try {
      const activities = await getFullActivityFeed(user.id);
      
      const sortedActivities = activities.sort(
        (a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
      );
      
      setFeedActivities(sortedActivities);

    } catch (err) {
      console.error("Error fetching activity feed:", err);
      setError(t('feedPage.error'));
    } finally {
      setIsLoading(false);
    }
  }, [user, t]);

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true, state: { from: '/feed' } });
    } else {
      fetchFeed();
    }
  }, [user, navigate, fetchFeed]);
  
  if (isLoading) {
    return <div className={styles.messageContainer}>{t('feedPage.loading')}</div>;
  }

  if (error) {
    return <div className={`${styles.messageContainer} ${styles.error}`}>{error}</div>;
  }
  
  if (!user) {
    return null;
  }

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>{t('feedPage.title')}</h1>
      
      {feedActivities.length > 0 ? (
        <ActivityList activities={feedActivities} showAuthorInfo={true} />
      ) : (
        <p className={styles.messageContainer}>{t('feedPage.noActivities')}</p>
      )}
    </div>
  );
};

export default FeedPage;
