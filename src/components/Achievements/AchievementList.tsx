import React from 'react';
import { useTranslation } from 'react-i18next';
import { Achievement } from '../../types/achievementTypes'; 
import AchievementItem from './AchievementItem';
import styles from './AchievementList.module.css';

interface AchievementListProps {
  achievements: Achievement[];
}

const AchievementList: React.FC<AchievementListProps> = ({ achievements }) => {
  const { t } = useTranslation();

  if (!achievements || achievements.length === 0) {
    return (
      <p className={styles.noAchievementsMessage}>
        {t('achievementsPage.noAchievements')}
      </p>
    );
  }

  return (
    <div className={styles.achievementsList}>
      {achievements.map((ach) => (
        <AchievementItem key={ach._id} achievement={ach} />
      ))}
    </div>
  );
};

export default AchievementList;