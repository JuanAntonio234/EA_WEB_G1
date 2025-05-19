import React from 'react';
import { Achievement } from '../../types/achievementTypes';
import AchievementItem from './AchievementItem';
import './AchievementList.css'; 

interface AchievementListProps {
  achievements: Achievement[];
}

const AchievementList: React.FC<AchievementListProps> = ({ achievements }) => {
  if (!achievements || achievements.length === 0) {
    return <p className="no-achievements-message">¡Aún no has desbloqueado ningún logro! Sigue explorando y completando rutas.</p>;
  }

  return (
    <div className="achievement-list">
      {achievements.map((achievement) => (
        <AchievementItem key={achievement._id} achievement={achievement} />
      ))}
    </div>
  );
};

export default AchievementList;
