import React from 'react';
import { Achievement } from '../../types/achievementTypes'; 
import './AchievementItem.css'; 

interface AchievementItemProps {
  achievement: Achievement;
}

const AchievementItem: React.FC<AchievementItemProps> = ({ achievement }) => {
  const iconSrc = achievement.icon || 'https://placehold.co/60x60/E0E0E0/757575?text=Icono'; 

  return (
    <div className={`achievement-item difficulty-${achievement.difficulty.toLowerCase()}`}>
      <img 
        src={iconSrc} 
        alt={`${achievement.title} icon`} 
        className="achievement-icon" 
        onError={(e) => {
          (e.target as HTMLImageElement).src = 'https://placehold.co/60x60/E0E0E0/BDBDBD?text=Error';
        }}
      />
      <div className="achievement-details">
        <h3 className="achievement-name">{achievement.title}</h3>
        <p className="achievement-description">{achievement.description}</p>
        <p className="achievement-condition">Condición: {achievement.condition}</p>

        <div className="achievement-meta">
          <span className={`achievement-difficulty difficulty-badge difficulty-${achievement.difficulty.toLowerCase()}`}>
            {achievement.difficulty.charAt(0).toUpperCase() + achievement.difficulty.slice(1)}
          </span>
          <span className="achievement-points">
            {achievement.points} Puntos
          </span>
        </div>
      </div>
    </div>
  );
};

export default AchievementItem;
