import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './HomePage.module.css';

const HomePage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.pageContainer}>
      <div className={styles.card}>
        <h1 className="welcome-message">{t('homePage.welcomeMessage')}</h1>
        <p className="intro-text">
          {t('homePage.introText')}
        </p>

        <section className="features-section">
          <h3>{t('homePage.featuresTitle')}</h3>
          <ul>
            <li>{t('homePage.feature1')}</li>
            <li>{t('homePage.feature2')}</li>
            <li>{t('homePage.feature3')}</li>
          </ul>
        </section>

        <section className="mobile-app-section">
          <h3>{t('homePage.mobileAppTitle')}</h3>
          <p>
            {t('homePage.mobileAppText')} 
          </p>
          <div className={styles.appLinks}>
            <a href="https://play.google.com/store/apps/details?id=your.app.id" target="_blank" rel="noopener noreferrer">
              <img src="/google-play-badge.png" alt={t('homePage.googlePlayAlt')} className={styles.androidBadge}/>
            </a>
            <a href="https://apps.apple.com/app/your-app-id" target="_blank" rel="noopener noreferrer">
              <img src="/app-store-badge-black.svg" alt={t('homePage.appStoreAlt')} className={styles.appleBadge}/>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
