import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { jwtDecode } from 'jwt-decode';
import styles from './LoginPage.module.css';
import { loginUser } from '../../services/userService';
import { useAuth } from '../../hooks/useAuth';
import Login from '../../components/Login/Login';
import { User } from '../../context/AuthContext';
import GoogleLoginButton from '../../components/Login/GoogleLoginButtton';

function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login: authLogin, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Si ya está autenticado, redirigir a home
  React.useEffect(() => {
    const token = localStorage.getItem('accessToken');
    
    if (token && user) {
      navigate('/');
      return;
    }
    
    if (token && !user) {
      const timeoutId = setTimeout(() => {
        if (user) {
          navigate('/');
        }
      }, 2000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [user, navigate]);

  const handleLogin = async (credentials: { username: string; password: string }) => {
    setError(null);
    
    if (!credentials.username.trim() || !credentials.password.trim()) {
      setError(t('loginPage.requiredFields'));
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(credentials.username)) {
      setError(t('loginPage.invalidEmail'));
      return;
    }

    try {
      setIsLoading(true);
      const token = await loginUser(credentials.username, credentials.password);
      
      if (token) {
        const decodedToken: any = jwtDecode(token);
        const userForContext: User = {
          id: decodedToken.id || decodedToken._id || decodedToken.userId || '',
          username: decodedToken.username || '',
          email: decodedToken.email || '',
          profilePicture: decodedToken.profilePicture || '',
          role: decodedToken.role || 'user'
        };
        
        authLogin(userForContext);
        navigate('/');
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        setError(t('loginPage.invalidCredentials'));
      } else {
        setError(t('loginPage.serverError'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Mostrar loading si hay token pero estamos esperando que cargue el usuario
  const token = localStorage.getItem('accessToken');
  if (token && !user) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.loadingContainer}>
          <p>{t('general.loading')}</p>
        </div>
      </div>
    );
  }

  // Si hay token y usuario, no mostrar nada (se redirigirá)
  if (token && user) {
    return null;
  }

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
            {error}
          </div>
        )}
        
        <Login 
          onLogin={handleLogin}
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