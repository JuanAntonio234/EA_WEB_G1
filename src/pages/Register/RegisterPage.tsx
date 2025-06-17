import { useState } from 'react';
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
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (newUser: RegisterData) => {
    setError(null);
    
    // Validación de campos vacíos
    if (!newUser.username.trim() || !newUser.email.trim() || !newUser.password.trim()) {
      setError(t('registerPage.requiredFields'));
      return;
    }

    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newUser.email)) {
      setError(t('registerPage.invalidEmail'));
      return;
    }

    // Validación de contraseña
    if (newUser.password.length < 6) {
      setError(t('registerPage.passwordTooShort'));
      return;
    }

    setIsLoading(true);

    try {
      const token = await register(newUser);
      const user: User = jwtDecode(token);
      login(user);
      navigate('/');
      console.log('Registre satisfactori:', user);
    } catch (error: any) {
      console.error('Registre fallit:', error);
      
      // Manejar diferentes tipos de error
      if (error.response?.status === 409) {
        setError(t('registerPage.userExists'));
      } else if (error.response?.status === 400) {
        setError(t('registerPage.invalidData'));
      } else if (error.message?.includes('Network')) {
        setError(t('registerPage.networkError'));
      } else {
        setError(t('registerPage.registerFailed'));
      }
    } finally {
      setIsLoading(false);
    }
  };

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
        
        <Register 
          onRegister={({ username, email, password }) => handleRegister({ username, email, password })}
          isLoading={isLoading}
        />
        
        <div className={styles.loginLink}>
          <p>
            {t('registerPage.hasAccount')}{' '}
            <a href="/login" className={styles.link}>
              {t('registerPage.loginHere')}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;