import React from 'react';
import { Activity } from '../../types/activityTypes';
import ActivityCard from '../../components/Activities/ActivityCard';
import styles from './ActivityList.module.css';

interface ActivityListProps {
  activities: Activity[];
  showAuthorInfo?: boolean;
}

const ActivityList: React.FC<ActivityListProps> = ({ activities }) => {
  if (!activities || activities.length === 0) {
    return <p className={styles.noActivitiesMessage}>No s'han trobat rutes o activitats disponibles.</p>;
  }

  return (
    <div className={styles.activityListContainer}> 
      {activities.map((activity) => (
        <ActivityCard key={activity._id} activity={activity}  />
      ))}
    </div>
  );
};

export default ActivityList;