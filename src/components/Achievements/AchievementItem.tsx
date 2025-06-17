import React from 'react';
import { useTranslation } from 'react-i18next';
import { Achievement } from '../../types/achievementTypes'; 
import styles from './AchievementItem.module.css'; 

interface AchievementItemProps {
  achievement: Achievement;
}

const AchievementItem: React.FC<AchievementItemProps> = ({ achievement }) => {
  const { t, i18n } = useTranslation();
  
  // Render icon as image if it's a filename, otherwise as emoji
  const iconElement = achievement.icon && achievement.icon.trim() !== '' ? (
    achievement.icon.includes('.') || achievement.icon.startsWith('http') ? (
      <img
        src={achievement.icon.startsWith('http') ? achievement.icon : `/achievement-icons/${achievement.icon}`}
        alt={achievement.title}
        className={styles.achievementIcon}
        onError={(e) => {
          // Fallback to trophy emoji if image fails to load
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          const fallback = target.nextElementSibling as HTMLSpanElement;
          if (fallback) {
            fallback.style.display = 'inline-block';
          }
        }}
      />
    ) : (
      <span className={styles.iconEmoji}>
        {achievement.icon}
      </span>
    )
  ) : (
    <span className={styles.iconEmoji}>
      🏆
    </span>
  );

  // Fallback emoji span (hidden by default, shown when image fails)
  const fallbackElement = (
    <span className={styles.iconFallback}>
      🏆
    </span>
  );

  // Helper function to get difficulty badge class
  const getDifficultyClass = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'bronze':
        return styles.difficultyBronze;
      case 'silver':
        return styles.difficultySilver;
      case 'gold':
        return styles.difficultyGold;
      case 'diamond':
        return styles.difficultyDiamond;
      default:
        return '';
    }
  };

  // Helper function to capitalize first letter
  const capitalizeFirst = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <div className={styles.achievementCard}>
      <div className={styles.achievementContent}>
        <div className={styles.iconContainer}>
          {iconElement}
          {fallbackElement}
        </div>
        <div className={styles.textContent}>
          <h4 className={styles.achievementTitle}>
            {achievement.title}
          </h4>
          <p className={styles.achievementDescription}>
            {achievement.description}
          </p>
          <small className={styles.achievementMeta}>
            {t('achievements.difficulty')}: 
            <span className={`${styles.difficultyBadge} ${getDifficultyClass(achievement.difficulty)}`}>
              {capitalizeFirst(achievement.difficulty)}
            </span>
            {achievement.points ? ` | ${t('achievements.points')}: ${achievement.points}` : ''}
          </small>
          {achievement.condition && (
            <p className={styles.achievementCondition}>
              <em>{t('achievements.condition')}: {achievement.condition}</em>
            </p>
          )}
          {achievement.createdAt && (
            <p className={styles.achievementDate}>
              {t('achievements.definedOn')}: {new Date(achievement.createdAt).toLocaleDateString(i18n.language)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AchievementItem;