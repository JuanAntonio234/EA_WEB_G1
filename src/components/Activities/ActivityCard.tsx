import React from 'react';
import { Activity, AuthorInfo } from '../../types/activityTypes';
import { Link } from 'react-router-dom';
import styles from './ActivityCard.module.css'; 
import '../../index.css';
import './ActivityStyles.css';


interface Props {
  activity: Activity;
}

const ActivityCard: React.FC<Props> = ({ activity }: Props) => {
  const startDate = activity.startTime ? new Date(activity.startTime) : null;
  const endDate = activity.endTime ? new Date(activity.endTime) : null;

  const formatDuration = (minutes: number): string => {
    if (isNaN(minutes) || minutes === null || minutes === undefined) return '-';
    if (minutes < 1) return '< 1 min';
    if (minutes < 60) return `${minutes.toFixed(0)} min`;
    const h = Math.floor(minutes / 60);
    const m = Math.round(minutes % 60);
    return `${h}h${m > 0 ? ` ${m}min` : ''}`;
  };

  const formatDistance = (meters: number): string => {
    if (isNaN(meters) || meters === null || meters === undefined) return '-';
    if (meters < 1000) return `${meters.toFixed(0)} m`;
    return `${(meters / 1000).toFixed(2)} km`;
  };

  const formatSpeed = (speedKmh: number): string => {
    if (isNaN(speedKmh) || speedKmh === null || speedKmh === undefined) return '-';
    return `${speedKmh.toFixed(1)} km/h`;
  }
  
  const authorDisplay = typeof activity.author === 'object' 
    ? (activity.author as AuthorInfo).username 
    : 'Desconegut';

  return (
    <div className={styles.activityCard}>
      <h3 className={styles.activityName}>{activity.name}</h3>
      <p className={styles.activityType}>{activity.type.toUpperCase()}</p>
      <div className={styles.activityDetails}>
        <p><strong>Distància:</strong> {formatDistance(activity.distance)}</p>
        <p><strong>Durada:</strong> {formatDuration(activity.duration)}</p>
        <p><strong>Desnivell:</strong> {activity.elevationGain?.toFixed(0) || '-'} m</p>
        <p><strong>Vel. mitja:</strong> {formatSpeed(activity.averageSpeed)}</p>
        <p><strong>Creat per:</strong> {authorDisplay}</p>
        {startDate && <p><strong>Inici:</strong> {startDate.toLocaleString()}</p>}
        {endDate && <p><strong>Fi:</strong> {endDate.toLocaleString()}</p>}
      </div>
      <Link to={`/activities/${activity._id}`} className={styles.detailsButton}>
        Veure Detalls
      </Link>
    </div>
  );
};

export default ActivityCard;