import React from 'react';
import { Activity } from '../../types/activityTypes';
import ActivityCard from './ActivityCard';
import styles from './ActivityList.module.css';

interface ActivityListProps {
  activities: Activity[];
  lastItemRef?: (node: HTMLDivElement | null) => void;
}

const ActivityList: React.FC<ActivityListProps> = ({ activities, lastItemRef }) => {
  if (!activities || activities.length === 0) {
    return <p className={styles.noActivitiesMessage}>No s'han trobat rutes o activitats disponibles.</p>;
  }

  return (
    <div className={styles.activityListContainer}> 
      {activities.map((activity, index) => {
        const isLastItem = index === activities.length - 1;
        return (
          <div 
            key={activity._id}
            ref={isLastItem && lastItemRef ? lastItemRef : null}
            className={styles.activityItem} 
          >
            <ActivityCard activity={activity} />
          </div>
        );
      })}
    </div>
  );
};

export default ActivityList;
