import React from 'react';
import { Achievement } from '../../types/achievementTypes'; 
import AchievementItem from './AchievementItem';

interface AchievementListProps {
  achievements: Achievement[];
}

const AchievementList: React.FC<AchievementListProps> = ({ achievements }) => {
  if (!achievements || achievements.length === 0) {
    return <p style={{ textAlign: 'center', color: '#777', marginTop: '20px' }}>Encara no has desbloquejat cap assoliment. Continua esforçant-te! 💪</p>;
  }

  return (
    <div className="achievements-list" style={{ maxWidth: '700px', margin: '0 auto' }}>
      {achievements.map((ach) => (
        <AchievementItem key={ach._id} achievement={ach} />
      ))}
    </div>
  );
};

export default AchievementList;