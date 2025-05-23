import ActivityCard from './ActivityCard';
import { Activity } from '../../types/activityTypes';
import './ActivityStyles.css';

interface Props {
  activities: Activity[];
  lastItemRef?: (node: HTMLDivElement) => void;
}

const ActivityList = ({ activities, lastItemRef }: Props) => {
  return (
    <div className="activity-list">
      {activities.map((activity, index) => {
        const isLast = index === activities.length - 1;
        return (
          <div
            key={activity._id}
            className="activity-item"
            ref={isLast ? lastItemRef : null}
          >
            <ActivityCard activity={activity} />
          </div>
        );
      })}
    </div>
  );
};

export default ActivityList;