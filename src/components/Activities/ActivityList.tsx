import { Activity } from '../../types/activityTypes';
import ActivityCard from './ActivityCard';
import './ActivityStyles.css';

interface Props {
  activities: Activity[];
}

const ActivityList = ({ activities }: Props) => {
  return (
    <div className="activity-list">
      {activities.map(activity => (
        <div key={activity._id} className="activity-item">
          <ActivityCard activity={activity} />
        </div>
      ))}
    </div>
  );
};

export default ActivityList;
