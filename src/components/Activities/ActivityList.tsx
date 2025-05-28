import React from 'react';
import { Activity } from '../../types/activityTypes';
import ActivityCard from './ActivityCard';
import styles from './ActivityList.module.css';
import { useTranslation } from 'react-i18next';

interface ActivityListProps {
  activities: Activity[];
  showAuthorInfo?: boolean; 
}

const ActivityList: React.FC<ActivityListProps> = ({ activities, showAuthorInfo }) => {
  const { t } = useTranslation();

  if (!activities || activities.length === 0) {
    return <p className={styles.noActivitiesMessage}>{t('exploreRoutesPage.noRoutes', "No s'han trobat activitats.")}</p>;
  }

  return (
    <div className={styles.activityListContainer}> 
      {activities.map((activity) => (
        <ActivityCard 
          key={activity._id} 
          activity={activity} 
          showAuthorInfo={showAuthorInfo} // Passa la propietat
        />
      ))}
    </div>
  );
};

export default ActivityList;
