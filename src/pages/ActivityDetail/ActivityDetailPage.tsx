import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Activity, ReferencePoint, AuthorInfo, Song } from '../../types/activityTypes';
import { getActivityDetailsById } from '../../services/activityService';
import styles from './ActivityDetailPage.module.css';

const ActivityDetailPage: React.FC = () => {
  const { t } = useTranslation();
  const { activityId } = useParams<{ activityId: string }>();
  const navigate = useNavigate();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!activityId) {
      setError(t('activityDetailPage.errorDefault'));
      setIsLoading(false);
      return;
    }

    const fetchActivityDetail = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getActivityDetailsById(activityId);
        setActivity(data);
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || err.message || t('activityDetailPage.errorDefault');
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivityDetail();
  }, [activityId, t]);

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
  };

  const handleStartRoute = () => {
    if (!activity) return;
    // TODO: Implementar funcionalidad de iniciar ruta
    alert(t('activityDetailPage.startRouteButton') + `: ${activity.name}`);
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: activity?.name || t('activityDetailPage.routeInfoTitle'),
          text: t('activityDetailPage.routeInfoTitle'),
          url: shareUrl,
        });
      } catch (err) {
        alert(t('activityDetailPage.errorDefault'));
      }
    } else if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert(t('general.linkCopied', 'Link copied to clipboard!'));
      } catch (err) {
        alert(t('activityDetailPage.errorDefault'));
      }
    } else {
      window.prompt(t('general.copyLink', 'Copy this link:'), shareUrl);
    }
  };

  const authorUsername = activity && typeof activity.author === 'object' 
    ? (activity.author as AuthorInfo).username 
    : t('activityCard.unknownAuthor');

  if (isLoading) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.messageContainer}>
          {t('activityDetailPage.loading')}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.pageContainer}>
        <div className={`${styles.messageContainer} ${styles.error}`}>
          {error}
          <br />
          <Link to="/explore-routes" className={styles.linkButton}>
            {t('activityDetailPage.returnToExplore')}
          </Link>
        </div>
      </div>
    );
  }

  if (!activity) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.messageContainer}>
          {t('activityDetailPage.notFound')}
          <br />
          <Link to="/explore-routes" className={styles.linkButton}>
            {t('activityDetailPage.returnToExplore')}
          </Link>
        </div>
      </div>
    );
  }

  const startDate = activity.startTime ? new Date(activity.startTime) : null;
  const endDate = activity.endTime ? new Date(activity.endTime) : null;
  const routePoints = activity.route.filter(p => typeof p !== 'string') as ReferencePoint[];

  return (
    <div className={styles.pageContainer}>
      <button onClick={() => navigate(-1)} className={styles.backButton}>
        &larr; {t('activityDetailPage.backButton')}
      </button>
      
      <h1 className={styles.activityTitle}>{activity.name}</h1>
      
      <div className={styles.activityMeta}>
        <span className={`${styles.metaItem} ${styles.activityType}`}>
          {activity.type.toUpperCase()}
        </span>
        <span className={styles.metaItem}>
          {t('activityDetailPage.createdBy')}: <strong>{authorUsername}</strong>
        </span>
        {startDate && (
          <span className={styles.metaItem}>
            <strong>{t('activityDetailPage.startTime')}:</strong> {startDate.toLocaleString()}
          </span>
        )}
        {endDate && (
          <span className={styles.metaItem}>
            <strong>{t('activityDetailPage.endTime')}:</strong> {endDate.toLocaleString()}
          </span>
        )}
      </div>

      <div className={styles.detailsGrid}>
        <div className={styles.detailItem}>
          <strong>{t('activityDetailPage.distance')}:</strong> {formatDistance(activity.distance)}
        </div>
        <div className={styles.detailItem}>
          <strong>{t('activityDetailPage.duration')}:</strong> {formatDuration(activity.duration)}
        </div>
        <div className={styles.detailItem}>
          <strong>{t('activityDetailPage.elevationGain')}:</strong> {activity.elevationGain?.toFixed(0) || '-'} m
        </div>
        <div className={styles.detailItem}>
          <strong>{t('activityDetailPage.avgSpeed')}:</strong> {formatSpeed(activity.averageSpeed)}
        </div>
        {activity.caloriesBurned !== undefined && (
          <div className={styles.detailItem}>
            <strong>{t('activityDetailPage.caloriesBurned')}:</strong> {activity.caloriesBurned.toFixed(0)} kcal
          </div>
        )}
      </div>
      
      <div className={styles.section}>
        <h2>{t('activityDetailPage.routeInfoTitle')}</h2>
        {routePoints && routePoints.length > 0 ? (
          <>
            <div className={styles.mapReferencePointsCounter}>
              {t('activityDetailPage.routePointsInfo', { count: routePoints.length })}
            </div>
            <div className={styles.mapPlaceholder}>
              {t('activityDetailPage.mapPlaceholder')}
            </div>
          </>
        ) : (
          <p>{t('activityDetailPage.noRoutePoints')}</p>
        )}
      </div>

      {activity.musicPlaylist && 
       Array.isArray(activity.musicPlaylist) && 
       (activity.musicPlaylist as Song[]).length > 0 && (
        <div className={styles.section}>
          <h2>{t('activityDetailPage.playlistTitle')}</h2>
          <ul className={styles.playlistList}>
            {(activity.musicPlaylist as Song[])
              .filter(song => typeof song === 'object' && song._id && song.title)
              .map(song => (
                <li key={song._id} className={styles.playlistItem}>
                  {song.title} {song.artist && `- ${song.artist}`}
                </li>
              ))}
          </ul>
        </div>
      )}

      <div className={styles.actionButtons}>
        <button onClick={handleStartRoute} className={styles.startRouteButton}>
          {t('activityDetailPage.startRouteButton')}
        </button>
        <button onClick={handleShare} className={styles.shareButton}>
          {t('general.share', 'Share')}
        </button>
      </div>
    </div>
  );
};

export default ActivityDetailPage;