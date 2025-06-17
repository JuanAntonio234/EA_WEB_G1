import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { jwtDecode } from 'jwt-decode';
import Login from '../../components/Login/Login';
import GoogleLoginButton from '../../components/Login/GoogleLoginButtton';
import { loginUser } from '../../services/userService';
import { useAuth } from '../../hooks/useAuth';
import { User } from '../../context/AuthContext';
import styles from './LoginPage.module.css';

function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (email: string, password: string) => {
    setError(null);
    
    // Validación de campos vacíos
    if (!email.trim() || !password.trim()) {
      setError(t('loginPage.requiredFields'));
      return;
    }
    
    setIsLoading(true);
    
    try {
      const token = await loginUser(email, password);
      const user: User = jwtDecode(token);
      login(user);
      navigate('/');
      console.log('Inici de sessió vàlid:', user);
    } catch (error: any) {
      console.error('Inici de sessió fallit:', error);
      
      // Manejar diferentes tipos de error
      if (error.response?.status === 401 || error.response?.status === 403) {
        setError(t('loginPage.invalidCredentials'));
      } else if (error.response?.status === 400) {
        setError(t('loginPage.requiredFields'));
      } else if (error.message?.includes('Network')) {
        setError(t('loginPage.networkError'));
      } else {
        setError(t('loginPage.loginFailed'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.formContainer}>
        <div className={styles.titleContainer}>
          <h1 className={styles.pageTitle}>{t('loginPage.title')}</h1>
          <p className={styles.pageSubtitle}>{t('loginPage.subtitle')}</p>
        </div>
        
        {error && (
          <div className={styles.errorMessage}>
            <div className={styles.errorIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2"/>
                <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <span>{error}</span>
            <button 
              className={styles.errorClose}
              onClick={() => setError(null)}
              aria-label={t('general.close')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2"/>
                <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </button>
          </div>
        )}
        
        <Login 
          onLogin={({ username, password }) => handleLogin(username, password)}
          isLoading={isLoading}
        />
        
        <div className={styles.googleLoginContainer}>
          <div className={styles.divider}>
            <span className={styles.dividerText}>{t('loginPage.orContinueWith')}</span>
          </div>
          <GoogleLoginButton />
        </div>
        
        <div className={styles.registerLink}>
          <p>
            {t('loginPage.noAccount')}{' '}
            <a href="/register" className={styles.link}>
              {t('loginPage.registerHere')}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;