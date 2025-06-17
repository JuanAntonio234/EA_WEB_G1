import React, { useEffect, useState, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './ProfilePage.module.css';
import { 
  getUserById, 
  getUserFollowers, 
  getUserFollowing,
  checkFollowStatus,
  followUser,
  unfollowUser 
} from '../../services/userService';
import { getAchievementById } from '../../services/achievementService';
import { getChallengeById } from '../../services/challengeService';
import { User } from '../../types/userTypes';
import { Achievement } from '../../types/achievementTypes';
import { Challenge } from '../../types/challengeTypes';
import { useAuth } from '../../hooks/useAuth';

const ProfilePage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { iduser } = useParams<{ iduser: string }>();
  const navigate = useNavigate();
  const { user: loggedInUser } = useAuth();

  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [followers, setFollowers] = useState<User[]>([]);
  const [following, setFollowing] = useState<User[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isMyProfile = loggedInUser && loggedInUser.id === iduser;

  const capitalizeFirst = (str: string | undefined) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const fetchProfile = useCallback(async () => {
    if (!iduser) {
      setError(t('profilePage.notFound'));
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const userData = await getUserById(iduser);
      setProfileUser(userData);
      setFollowerCount(userData.followersCount || 0);

      if (loggedInUser && loggedInUser.id !== iduser) {
        const followStatus = await checkFollowStatus(loggedInUser.id, iduser);
        setIsFollowing(followStatus.isFollowing);
      }
      
      if (isMyProfile) {
        const [followersData, followingData] = await Promise.all([
          getUserFollowers(iduser),
          getUserFollowing(iduser),
        ]);
        setFollowers(followersData);
        setFollowing(followingData);
      }

      if (userData?.achievements?.length) {
        const achievementIds = userData.achievements.slice(0, 3);
        const achievementPromises = achievementIds.map(id => getAchievementById(id));
        setAchievements(await Promise.all(achievementPromises));
      } else {
        setAchievements([]);
      }
      
      if (userData?.challengesCompleted?.length) {
        const challengeIds = userData.challengesCompleted.slice(0, 3);
        const challengePromises = challengeIds.map(id => getChallengeById(id));
        setChallenges(await Promise.all(challengePromises));
      } else {
        setChallenges([]);
      }

    } catch (err) {
      console.error("Error fetching profile data:", err);
      setError(t('profilePage.notFound'));
    } finally {
      setLoading(false);
    }
  }, [iduser, t, loggedInUser, isMyProfile]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);
  
  const handleFollowToggle = async () => {
    if (!loggedInUser || !profileUser || isMyProfile || isFollowLoading) return;

    setIsFollowLoading(true);
    try {
      if (isFollowing) {
        await unfollowUser(loggedInUser.id, profileUser._id);
        setIsFollowing(false);
        setFollowerCount(prev => prev - 1);
      } else {
        await followUser(loggedInUser.id, profileUser._id);
        setIsFollowing(true);
        setFollowerCount(prev => prev + 1);
      }
    } catch (err) {
      console.error('Error in follow/unfollow action:', err);
    } finally {
      setIsFollowLoading(false);
    }
  };

  if (loading) return <div className={styles.profileContainer}><p>{t('profilePage.loading')}</p></div>;
  if (error || !profileUser) return <div className={styles.profileContainer}><p>{error || t('profilePage.notFound')}</p></div>;

  return (
    <div className={styles.profileContainer}>
      <h1 className={styles.profileTitle}>{t('profilePage.title', { username: profileUser.username })}</h1>
      
      <div className={styles.profileHeader}>
        <img
          src={profileUser.profilePicture || '/default-profile.png'}
          alt={profileUser.username}
          className={styles.profileIcon}
        />
        <div className={styles.profileInfo}>
          <p><strong>{t('profilePage.level')}:</strong> {profileUser.level}</p>
          <p><strong>{t('profilePage.bio')}:</strong> {profileUser.bio || '-'}</p>
          <p><strong>{followerCount}</strong> Seguidores | <strong>{profileUser.followingCount || 0}</strong> Siguiendo</p>
          
          <div className={styles.profileActions}>
            {isMyProfile ? (
              <>
                <button onClick={() => navigate('/profile/edit')} className={styles.editProfileButton}>
                  {t('navbar.settings')} 
                </button>
                <button onClick={() => navigate('/feed')} className={styles.feedButton}>
                  {t('navbar.feed')}
                </button>
              </>
            ) : (
              loggedInUser && (
                <button 
                  onClick={handleFollowToggle} 
                  className={isFollowing ? styles.unfollowButton : styles.followButton}
                  disabled={isFollowLoading}
                >
                  {isFollowLoading ? 'Cargando...' : (isFollowing ? 'Dejar de seguir' : 'Seguir')}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {isMyProfile && (
        <div className={styles.followStatsContainer}>
          <section className={styles.followersSection}>
            <h3>{t('profilePage.followersSectionTitle')} ({followers.length})</h3>
            {followers.length === 0 ? (
              <p>{t('profilePage.noFollowers')}</p>
            ) : (
              <ul style={{ listStyleType: 'none', margin: 0, padding: 0 }}>
                {followers.map(follower => (
                  <li key={follower._id} style={{ marginBottom: '8px' }}>
                    <Link to={`/profile/${follower._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      {follower.username}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className={styles.followingSection}>
            <h3>{t('profilePage.followingSectionTitle')} ({following.length})</h3>
            {following.length === 0 ? (
              <p>{t('profilePage.noFollowing')}</p>
            ) : (
              <ul style={{ listStyleType: 'none', margin: 0, padding: 0 }}>
                {following.map(follow => (
                  <li key={follow._id} style={{ marginBottom: '8px' }}>
                    <Link to={`/profile/${follow._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      {follow.username}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}
      
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
             <span className={styles.achievementIconFallback}>🏆</span>
            )}
            <div>
              <strong>{a.title}</strong> - {a.description}
              <br />
              <small>{t('profilePage.difficulty')}: {capitalizeFirst(a.difficulty)}, {t('profilePage.points')}: {a.points}</small>
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
