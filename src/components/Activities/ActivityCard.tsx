import { Activity } from '../../types/activityTypes';
import '../../index.css';
import './ActivityStyles.css';


interface Props {
  activity: Activity;
}

const ActivityCard = ({ activity }: Props) => {
  const startDate = new Date(activity.startTime);
  const endDate = new Date(activity.endTime);

  return (
    <div className="activity-card">
      <h2>{activity.name}</h2>
      <p className="activity-type">{activity.type.toUpperCase()}</p>
      <p><strong>Duración:</strong> {activity.duration.toFixed(2)} min</p>
      <p><strong>Distancia:</strong> {activity.distance} km</p>
      <p><strong>Altitud:</strong> {activity.elevationGain} m</p>
      <p><strong>Velocidad media:</strong> {activity.averageSpeed} km/h</p>
      <p><strong>Inicio:</strong> {startDate.toLocaleString()}</p>
      <p><strong>Fin:</strong> {endDate.toLocaleString()}</p>
    </div>
  );
};

export default ActivityCard;
