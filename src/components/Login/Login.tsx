import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './Login.module.css';

interface LoginProps {
  onLogin: (credentials: { username: string; password: string }) => void;
  isLoading?: boolean;
}

const Login: React.FC<LoginProps> = ({ onLogin, isLoading = false }) => {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      return; // El error se maneja ahora en LoginPage
    }
    if (!isLoading) {
      onLogin({ username, password });
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.inputGroup}>
        <label htmlFor="email" className={styles.label}>
          {t('loginPage.emailLabel')}
        </label>
        <div className={styles.inputContainer}>
          <input
            id="email"
            type="email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className={styles.input}
            placeholder={t('loginPage.emailPlaceholder')}
          />
          <div className={styles.inputIcon}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="password" className={styles.label}>
          {t('loginPage.passwordLabel')}
        </label>
        <div className={styles.inputContainer}>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.input}
            placeholder={t('loginPage.passwordPlaceholder')}
          />
          <div className={styles.inputIcon}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="16" r="1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <button
            type="button"
            className={styles.passwordToggle}
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? t('loginPage.hidePassword') : t('loginPage.showPassword')}
          >
            {showPassword ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20C7 20 2.73 16.39 1 12A18.45 18.45 0 0 1 5.06 5.06L17.94 17.94Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M1 1L23 23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10.59 10.59A2 2 0 0 0 13.41 13.41" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4C17 4 21.27 7.61 23 12A18.5 18.5 0 0 1 19.42 16.42" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
        </div>
      </div>

      <button type="submit" className={styles.button} disabled={isLoading}>
        {isLoading ? (
          <>
            <div className={styles.spinner}></div>
            <span>{t('loginPage.loggingIn')}</span>
          </>
        ) : (
          <>
            <span>{t('loginPage.loginButton')}</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 21H5A2 2 0 0 1 3 19V5A2 2 0 0 1 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="16,17 21,12 16,7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </>
        )}
      </button>
    </form>
  );
};

export default Login;