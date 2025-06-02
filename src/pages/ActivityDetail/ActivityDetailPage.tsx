import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Activity, ReferencePoint, AuthorInfo, Song } from '../../types/activityTypes';
import { getActivityDetailsById } from '../../services/activityService';
import styles from './ActivityDetailPage.module.css';

const ActivityDetailPage: React.FC = () => {
  const { activityId } = useParams<{ activityId: string }>();
  const navigate = useNavigate();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!activityId) {
      setError('No s\'ha proporcionat un ID d\'activitat vàlid.');
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
        const errorMessage = err.response?.data?.message || err.message || 'No s\'ha pogut carregar els detalls de l\'activitat.';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivityDetail();
  }, [activityId]);

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

  const handleStartRoute = () => {
    if (!activity) return;
    alert(`Funcionalitat "Començar ruta ${activity.name}" encara no implementada.`);
  };
  
  const authorUsername = activity && typeof activity.author === 'object' ? (activity.author as AuthorInfo).username : 'Desconegut';

  if (isLoading) {
    return <div className={styles.messageContainer}>Carregant detalls de la ruta...</div>;
  }

  if (error) {
    return <div className={`${styles.messageContainer} ${styles.error}`}>Error: {error} <Link to="/explore-routes">Tornar a explorar</Link></div>;
  }

  if (!activity) {
    return <div className={styles.messageContainer}>No s'han trobat detalls per a aquesta ruta. <Link to="/explore-routes">Tornar a explorar</Link></div>;
  }

  const startDate = activity.startTime ? new Date(activity.startTime) : null;
  const endDate = activity.endTime ? new Date(activity.endTime) : null;
  const routePoints = activity.route.filter(p => typeof p !== 'string') as ReferencePoint[];

  return (
    <div className={styles.pageContainer}>
      <button onClick={() => navigate(-1)} className={styles.backButton}>&larr; Enrere</button>
      <h1 className={styles.activityTitle}>{activity.name}</h1>
      <div className={styles.activityMeta}>
        <span className={`${styles.metaItem} ${styles.activityType}`}>{activity.type.toUpperCase()}</span>
        <span className={styles.metaItem}>Creat per: <strong>{authorUsername}</strong></span>
        {startDate && <span className={styles.metaItem}><strong>Inici:</strong> {startDate.toLocaleString()}</span>}
        {endDate && <span className={styles.metaItem}><strong>Fi:</strong> {endDate.toLocaleString()}</span>}
      </div>

      <div className={styles.detailsGrid}>
        <div className={styles.detailItem}><strong>Distància:</strong> {formatDistance(activity.distance)}</div>
        <div className={styles.detailItem}><strong>Durada:</strong> {formatDuration(activity.duration)}</div>
        <div className={styles.detailItem}><strong>Desnivell Positiu:</strong> {activity.elevationGain?.toFixed(0) || '-'} m</div>
        <div className={styles.detailItem}><strong>Velocitat Mitja:</strong> {formatSpeed(activity.averageSpeed)}</div>
        {activity.caloriesBurned !== undefined && <div className={styles.detailItem}><strong>Calories Cremades:</strong> {activity.caloriesBurned.toFixed(0)} kcal</div>}
      </div>
      
      <div className={styles.section}>
        <h2>Ruta (Punts GPS)</h2>
        {routePoints && routePoints.length > 0 ? (
          <>
            <p>Aquesta ruta té {routePoints.length} punts GPS.</p>
            <div className={styles.mapPlaceholder}>Visualització del Mapa (Pendent d'Implementar)</div>
          </>
        ) : (
          <p>No hi ha informació detallada de punts GPS per a aquesta ruta.</p>
        )}
      </div>

      {activity.musicPlaylist && Array.isArray(activity.musicPlaylist) && (activity.musicPlaylist as Song[]).length > 0 && (
        <div className={styles.section}>
          <h2>Playlist de Música</h2>
          <ul>
            {(activity.musicPlaylist as Song[]).filter(song => typeof song === 'object' && song._id && song.title).map(song => (
              <li key={song._id}>{song.title} {song.artist && `- ${song.artist}`}</li>
            ))}
          </ul>
        </div>
      )}

      <button onClick={handleStartRoute} className={styles.startRouteButton}>
        Començar Aquesta Ruta
      </button>
    </div>
  );
};

export default ActivityDetailPage;