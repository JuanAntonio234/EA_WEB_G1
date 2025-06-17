import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './LanguageSwitcher.module.css';

const supportedLanguages = [
  { code: 'ca', name: 'Català' },
  { code: 'es', name: 'Español' },
  { code: 'en', name: 'English' },
];

const LanguageSwitcher: React.FC = () => {
  const { i18n, t } = useTranslation();

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = event.target.value;
    i18n.changeLanguage(newLang);
  };

  return (
    <div className={styles.languageSwitcherContainer}>
      <label htmlFor="language-select" className={styles.visuallyHidden}>
        {t('languageSwitcher.selectLabel')}
      </label>
      <select
        id="language-select"
        value={i18n.resolvedLanguage}
        onChange={handleLanguageChange}
        className={styles.selectElement}
        aria-label={t('languageSwitcher.selectLabel')}
      >
        {supportedLanguages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSwitcher;
