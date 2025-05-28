import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './ProfilePage.module.css';
import { getUserById } from '../../services/userService';
import { getAchievementById } from '../../services/achievementService';
import { getChallengeById } from '../../services/challengeService';
import { User } from '../../types/userTypes';
import { Achievement } from '../../types/achievementTypes';
import { Challenge } from '../../types/challengeTypes';
import { useAuth } from '../../hooks/useAuth';

const ProfilePage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { iduser } = useParams<{ iduser: string }>();
  const { user: loggedInUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  const isMyProfile = loggedInUser && loggedInUser.id === iduser;

  const capitalizeFirst = (str: string | undefined) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        if (!iduser) {
          setUser(null);
          throw new Error("User ID is missing");
        }
        const userData = await getUserById(iduser);
        setUser(userData);

        if (userData && userData.achievements && userData.achievements.length > 0) {
          const achievementIds = userData.achievements.slice(0, 3);
          const achievementPromises = achievementIds.map(id => getAchievementById(id));
          const achievementData = await Promise.all(achievementPromises);
          setAchievements(achievementData);
        } else {
          setAchievements([]);
        }
        
        if (userData && userData.challengesCompleted && userData.challengesCompleted.length > 0) {
          const challengeIds = userData.challengesCompleted.slice(0, 3);
          const challengePromises = challengeIds.map(id => getChallengeById(id));
          const challengeData = await Promise.all(challengePromises);
          setChallenges(challengeData);
        } else {
          setChallenges([]);
        }

      } catch (err) {
        console.error("Error fetching profile data:", err);
        setUser(null);
        setAchievements([]);
        setChallenges([]);
      }
      setLoading(false);
    };
    if (iduser) fetchProfile();
  }, [iduser]);

  if (loading) return <div className={styles.profileContainer}><p>{t('profilePage.loading')}</p></div>;
  if (!user) return <div className={styles.profileContainer}><p>{t('profilePage.notFound')}</p></div>;

  return (
    <div className={styles.profileContainer}>
      <h1 className={styles.profileTitle}>{t('profilePage.title', { username: user.username })}</h1>
      <div className={styles.profileHeader}>
        <img
          src={user.profilePicture || '/default-profile.png'}
          alt={user.username}
          className={styles.profileIcon}
        />
        <div className={styles.profileInfo}>
          <p><strong>{t('profilePage.level')}:</strong> {user.level}</p>
          <p><strong>{t('profilePage.bio')}:</strong> {user.bio || '-'}</p>
          <p><strong>{t('profilePage.totalDistance')}:</strong> {user.totalDistance.toFixed(2) || 0} km</p>
          <p><strong>{t('profilePage.totalTime')}:</strong> {user.totalTime.toFixed(2) || 0} hrs</p>
        </div>
      </div>
      <section className={styles.achievementsSection}>
        <div className={styles.sectionHeader}>
          <h3>
            <Link to="/my-achievements" className={styles.sectionTitleLink}>
              {t('profilePage.achievementsSectionTitle')}
            </Link>
          </h3>
          {isMyProfile && achievements.length > 0 && (
            <Link to="/my-achievements" className={styles.viewAllLink}>
              {t('profilePage.viewAllAchievements')}
            </Link>
          )}
        </div>
        {achievements.length === 0 && <p>{t('profilePage.noAchievements')}</p>}
        <ul className={styles.achievementsList}>
        {achievements.map(a => (
    <li key={a._id} className={styles.achievementCard}>
      {a.icon ? (
        <img
          src={a.icon.startsWith('http') ? a.icon : `/achievement-icons/${a.icon}.png`}
          alt={a.title}
          className={styles.achievementIcon}
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
      ) : (
        <span className={styles.achievementIcon} style={{ fontSize: '2rem', display: 'inline-block' }}>🏆</span>
      )}
      <div>
        <strong>{a.title}</strong> - {a.description}
        <br />
        <small>
          {t('profilePage.difficulty')}: {capitalizeFirst(a.difficulty)}, {t('profilePage.points')}: {a.points}
        </small>
      </div>
    </li>
  ))}
      </ul>
      {isMyProfile && achievements.length === 0 && (
         <Link to="/my-achievements" className={styles.viewAllLink}>{t('profilePage.consultAchievements')}</Link>
      )}
      </section>
      <section className={styles.challengesSection}>
        <h3>{t('profilePage.challengesSectionTitle')}</h3>
        {challenges.length === 0 && <p>{t('profilePage.noChallenges')}</p>}
        <ul className={styles.challengesList}>
          {challenges.map(c => (
            <li key={c._id} className={styles.challengeCard}>
              <strong>{c.title}</strong> - {c.description}
              <br />
              <small>
                {t('profilePage.goal')}: {c.goalType} - {c.goalValue}, {t('profilePage.reward')}: {c.reward}
                <br />
                {c.startDate && c.endDate && (
                  <>
                    {t('profilePage.dateRange', { startDate: new Date(c.startDate).toLocaleDateString(i18n.language), endDate: new Date(c.endDate).toLocaleDateString(i18n.language) })}
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
