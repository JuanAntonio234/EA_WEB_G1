import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './ProfilePage.module.css';
import { getUserById } from '../../services/userService';
import { getAchievementById } from '../../services/achievementService';
import { getChallengeById } from '../../services/challengeService';
import { User } from '../../types/userTypes';
import { Achievement } from '../../types/achievementTypes';
import { Challenge } from '../../types/challengeTypes';

const ProfilePage: React.FC = () => {
  function capitalizeFirst(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
  const { iduser } = useParams<{ iduser: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const userData = await getUserById(iduser!);
        setUser(userData);

        // Only fetch first 3 achievements
        const achievementIds = userData.achievements.slice(0, 3);
        const achievementPromises = achievementIds.map(id => getAchievementById(id));
        const achievementData = await Promise.all(achievementPromises);

        // Only fetch first 3 challenges
        const challengeIds = userData.challengesCompleted.slice(0, 3);
        const challengePromises = challengeIds.map(id => getChallengeById(id));
        const challengeData = await Promise.all(challengePromises);

        setAchievements(achievementData);
        setChallenges(challengeData);
      } catch (err) {
        setUser(null);
      }
      setLoading(false);
    };
    if (iduser) fetchProfile();
  }, [iduser]);

  if (loading) return <div className={styles.profileContainer}>Loading...</div>;
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
        <h3>Assoliments</h3>
        {achievements.length === 0 && <p>Cap assoliment encara.</p>}
        <ul className={styles.achievementsList}>
        {achievements.map(a => (
          <li key={a._id} className={styles.achievementCard}>
            <img
              src={`/achievement-icons/${a.icon}`}
              alt={a.title}
              className={styles.achievementIcon}
            />
            <div>
              <strong>{a.title}</strong> - {a.description}
              <br />
              <small>Dificultat: {capitalizeFirst(a.difficulty)}, Punts: {a.points}</small>
            </div>
          </li>
        ))}
      </ul>
      </section>
      <section className={styles.challengesSection}>
        <h3>Reptes completats</h3>
        {challenges.length === 0 && <p>Cap repte completat.</p>}
        <ul className={styles.challengesList}>
          {challenges.map(c => (
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
      </section>
    </div>
  );
};

export default ProfilePage;