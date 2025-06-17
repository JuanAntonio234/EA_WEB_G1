import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { jwtDecode } from 'jwt-decode';
import styles from './RegisterPage.module.css';
import { register } from '../../services/userService';
import { useAuth } from '../../hooks/useAuth';
import { RegisterData } from '../../types/userTypes';
import Register from '../../components/Register/Register';
import { User } from '../../context/AuthContext';

function RegisterPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login, user } = useAuth();
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

  const handleRegister = async (newUser: RegisterData) => {
    setError(null);
    
    if (!newUser.username.trim() || !newUser.email.trim() || !newUser.password.trim()) {
      setError(t('registerPage.requiredFields'));
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newUser.email)) {
      setError(t('registerPage.invalidEmail'));
      return;
    }

    if (newUser.password.length < 6) {
      setError(t('registerPage.passwordTooShort'));
      return;
    }

    try {
      setIsLoading(true);
      const token = await register(newUser);
      
      if (token) {
        const decodedToken: any = jwtDecode(token);
        const userForContext: User = {
          id: decodedToken.id || decodedToken._id || decodedToken.userId || '',
          username: decodedToken.username || '',
          email: decodedToken.email || '',
          profilePicture: decodedToken.profilePicture || '',
          role: decodedToken.role || 'user'
        };
        
        login(userForContext);
        navigate('/');
      }
    } catch (error: any) {
      if (error.response?.status === 409) {
        setError(t('registerPage.userExists'));
      } else if (error.response?.status === 400) {
        setError(t('registerPage.invalidData'));
      } else {
        setError(t('registerPage.serverError'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Mostrar loading si hay token pero estamos esperando que cargue el usuario
  const token = localStorage.getItem('accessToken');
  if (token && !user) {
    return (
      <div className={styles.loadingContainer}>
        <p>{t('general.loading')}</p>
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
          <h1 className={styles.pageTitle}>{t('registerPage.title')}</h1>
          <p className={styles.pageSubtitle}>{t('registerPage.subtitle')}</p>
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
        
        <Register 
          onRegister={handleRegister}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

export default RegisterPage;