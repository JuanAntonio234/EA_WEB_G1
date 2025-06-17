import React from 'react';
import { useTranslation } from 'react-i18next';
import { Achievement } from '../../types/achievementTypes'; 

interface AchievementItemProps {
  achievement: Achievement;
}

const AchievementItem: React.FC<AchievementItemProps> = ({ achievement }) => {
  const { t, i18n } = useTranslation();
  
  const iconElement = (
    <span style={{ 
      fontSize: '2em', 
      marginRight: '15px', 
      minWidth: '50px', 
      textAlign: 'center' 
    }}>
      {achievement.icon || '🏆'}
    </span>
  );

  // Helper function to capitalize first letter
  const capitalizeFirst = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <div style={{ 
      border: '1px solid #e0e0e0', 
      padding: '16px', 
      marginBottom: '12px', 
      borderRadius: '8px', 
      backgroundColor: '#fff', 
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)' 
    }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {iconElement}
        <div style={{ flexGrow: 1 }}>
          <h4 style={{ marginTop: 0, marginBottom: '4px', color: '#333' }}>
            {achievement.title}
          </h4>
          <p style={{ fontSize: '0.9em', color: '#666', marginBottom: '8px' }}>
            {achievement.description}
          </p>
          <small style={{ fontSize: '0.8em', color: '#777' }}>
            {t('achievements.difficulty')}: <span style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
              {capitalizeFirst(achievement.difficulty)}
            </span>
            {achievement.points ? ` | ${t('achievements.points')}: ${achievement.points}` : ''}
          </small>
          {achievement.condition && (
            <p style={{ fontSize: '0.8em', color: '#777', marginTop: '4px', marginBottom: 0 }}>
              <em>{t('achievements.condition')}: {achievement.condition}</em>
            </p>
          )}
          {achievement.createdAt && (
            <p style={{ fontSize: '0.75em', color: '#999', marginTop: '4px', marginBottom: 0 }}>
              {t('achievements.definedOn')}: {new Date(achievement.createdAt).toLocaleDateString(i18n.language)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AchievementItem;