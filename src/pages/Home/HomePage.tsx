import React from 'react';
import styles from './HomePage.module.css';

const HomePage: React.FC = () => {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.card}>
        <h1 className="welcome-message">Welcome to SportsTracker!</h1>
        <p className="intro-text">
          Track your runs, rides, and workouts. Log where you train, earn achievements, and join a community of active people!
        </p>

        <section className="features-section">
          <h3>Achievements & Activity Logging</h3>
          <ul>
            <li>Register your running, cycling, or other activities with location tracking.</li>
            <li>Earn badges and achievements as you reach new milestones.</li>
            <li>Review your stats and progress over time.</li>
          </ul>
        </section>

        <section className="mobile-app-section">
          <h3>Descarrega't l'aplicació ara i millora la teva rutina esportiva!</h3>
          <p>
            Take la meva aplicació with you everywhere. Download our app for:
          </p>
          <div className="app-links">
            <a href="https://play.google.com/store/apps/details?id=your.app.id" target="_blank" rel="noopener noreferrer">
              <img src="/google-play-badge.png" alt="Get it on Google Play" className="android-badge"/>
            </a>
            <a href="https://apps.apple.com/app/your-app-id" target="_blank" rel="noopener noreferrer">
              <img src="/app-store-badge-black.svg" alt="Download on the App Store" className="apple-badge"/>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;