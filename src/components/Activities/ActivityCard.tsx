import React from 'react';
import { Activity, AuthorInfo } from '../../types/activityTypes';
import { Link } from 'react-router-dom';
import styles from './ActivityCard.module.css'; 
import '../../index.css';
import { useTranslation } from 'react-i18next';

interface Props {
  activity: Activity;
  showAuthorInfo?: boolean; 
}

const ActivityCard: React.FC<Props> = ({ activity, showAuthorInfo = true }: Props) => {
  const { t } = useTranslation();

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
    : t('activityCard.unknownAuthor', 'Desconegut'); // Afegeix 'activityCard.unknownAuthor' als teus JSONs

  return (
    <div className={styles.activityCard}>
      <h3 className={styles.activityName}>{activity.name}</h3>
      <p className={styles.activityType}>{activity.type.toUpperCase()}</p>
      <div className={styles.activityDetails}>
        <p><strong>{t('activityCard.distance')}:</strong> {formatDistance(activity.distance)}</p>
        <p><strong>{t('activityCard.duration')}:</strong> {formatDuration(activity.duration)}</p>
        <p><strong>{t('activityCard.elevation')}:</strong> {activity.elevationGain?.toFixed(0) || '-'} m</p>
        <p><strong>{t('activityCard.avgSpeed')}:</strong> {formatSpeed(activity.averageSpeed)}</p>
        {showAuthorInfo && ( 
          <p><strong>{t('activityCard.createdBy')}:</strong> {authorDisplay}</p>
        )}
        {startDate && <p><strong>{t('activityCard.startTime')}:</strong> {startDate.toLocaleString()}</p>}
        {endDate && <p><strong>{t('activityCard.endTime')}:</strong> {endDate.toLocaleString()}</p>}
      </div>
      <Link to={`/activities/${activity._id}`} className={styles.detailsButton}>
        {t('activityCard.detailsButton')}
      </Link>
    </div>
  );
};

export default ActivityCard;
