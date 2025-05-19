import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom'; 
import styles from './ProfilePage.module.css';
import { getUserById } from '../../services/userService';
import { getAchievementById } from '../../services/achievementsService';
import { getChallengeById } from '../../services/challengeService'; 
import { User } from '../../types/userTypes';
import { Achievement } from '../../types/achievementTypes';
import { Challenge } from '../../types/challengeTypes'; 

const ProfilePage: React.FC = () => {
  function capitalizeFirst(str: string) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  const { iduser } = useParams<{ iduser: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [achievementsPreview, setAchievementsPreview] = useState<Achievement[]>([]); 
  const [challengesPreview, setChallengesPreview] = useState<Challenge[]>([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); 

  const MAX_PREVIEW_ITEMS = 3;

  useEffect(() => {
    const fetchProfile = async () => {
      if (!iduser) {
        setError("ID d'usuari no proporcionat.");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null); 
      try {
        const userData = await getUserById(iduser);
        setUser(userData);

        if (userData && userData.achievements) {
          const achievementIdsToFetch = userData.achievements.slice(0, MAX_PREVIEW_ITEMS);
          if (achievementIdsToFetch.length > 0) {
            const achievementPromises = achievementIdsToFetch.map(id => 
              getAchievementById(id).catch(err => {
                console.error(`Error en carregar l'assoliment ${id} per al perfil:`, err);
                return null; 
              })
            );
            const achievementData = await Promise.all(achievementPromises);
            setAchievementsPreview(achievementData.filter(a => a !== null) as Achievement[]);
          } else {
            setAchievementsPreview([]);
          }
        } else {
          setAchievementsPreview([]);
        }

        if (userData && userData.challengesCompleted) {
          const challengeIdsToFetch = userData.challengesCompleted.slice(0, MAX_PREVIEW_ITEMS);
          if (challengeIdsToFetch.length > 0) {
            const challengePromises = challengeIdsToFetch.map(id => 
              getChallengeById(id).catch(err => {
                console.error(`Error en carregar el repte ${id} per al perfil:`, err);
                return null;
              })
            );
            const challengeData = await Promise.all(challengePromises);
            setChallengesPreview(challengeData.filter(c => c !== null) as Challenge[]);
          } else {
            setChallengesPreview([]);
          }
        } else {
          setChallengesPreview([]);
        }

      } catch (err: any) {
        console.error("Error en carregar el perfil:", err);
        setUser(null); 
        setError(err.message || "No s'ha pogut carregar el perfil de l'usuari.");
      }
      setLoading(false);
    };
    fetchProfile();
  }, [iduser]);

  if (loading) return <div className={styles.profileContainer}>Loading...</div>;
  if (error) return <div className={styles.profileContainer}>{error}</div>; 
  if (!user) return <div className={styles.profileContainer}>User not found</div>;

  return (
    <div className={styles.profileContainer}>
      <h1 className={styles.profileTitle}>Perfil de {user.username}</h1>
      <div className={styles.profileHeader}>
        <img
          src={user.profilePicture || '/default-profile.png'} 
          alt="Profile"
          className={styles.profileIcon}
        />
        <div className={styles.profileInfo}>
          <p><strong>Nivell:</strong> {user.level}</p>
          <p><strong>Biografia:</strong> {user.bio || '-'}</p>
          <p><strong>Distància total:</strong> {user.totalDistance} km</p>
          <p><strong>Temps total:</strong> {user.totalTime} hrs</p>
        </div>
      </div>

      <section className={styles.achievementsSection}>
        <h3>
          <Link to="/achievements" className={styles.sectionTitleLink}>
            Assoliments
          </Link>
        </h3>
        {achievementsPreview.length === 0 && <p>Cap assoliment encara.</p>}
        <ul className={styles.achievementsList}>
        {achievementsPreview.map(a => (
          <li key={a._id} className={styles.achievementCard}>
            <img
              src={a.icon || `/achievement-icons/default-achievement.png`} 
              alt={a.title}
              className={styles.achievementIcon}
              onError={(e) => (e.currentTarget.src = '/achievement-icons/default-achievement.png')} // Fallback
            />
            <div>
              <strong>{a.title}</strong> - {a.description}
              <br />
              <small>Dificultat: {capitalizeFirst(a.difficulty)}, Punts: {a.points}</small>
            </div>
          </li>
        ))}
      </ul>
      {user.achievements && user.achievements.length > MAX_PREVIEW_ITEMS && (
        <div className={styles.seeAllLinkContainer}>
          <Link to="/achievements" className={styles.seeAllLink}>
            Veure tots els assoliments ({user.achievements.length})...
          </Link>
        </div>
      )}
      </section>

      <section className={styles.challengesSection}>
        <h3>Reptes completats</h3>
        {challengesPreview.length === 0 && <p>Cap repte completat.</p>}
        <ul className={styles.challengesList}>
          {challengesPreview.map(c => (
            <li key={c._id} className={styles.challengeCard}>
              <strong>{c.title}</strong> - {c.description}
              <br />
              <small>
                Objectiu: {c.goalType} - {c.goalValue}, Recompensa: {c.reward}
                <br />
                {c.startDate && c.endDate && (
                  <>
                    Des de: {new Date(c.startDate).toLocaleDateString()} fins {new Date(c.endDate).toLocaleDateString()}
                  </>
                )}
              </small>
            </li>
          ))}
        </ul>
        {user.challengesCompleted && user.challengesCompleted.length > MAX_PREVIEW_ITEMS && (
          <div className={styles.seeAllLinkContainer}>
            <p>I {user.challengesCompleted.length - MAX_PREVIEW_ITEMS} reptes més...</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default ProfilePage;
