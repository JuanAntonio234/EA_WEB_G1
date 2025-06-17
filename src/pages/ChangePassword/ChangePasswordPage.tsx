import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import ChangePasswordForm from '../../components/ChangePassword/ChangePasswordForm';
import styles from './ChangePasswordPage.module.css';

const ChangePasswordPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirigir si no está autenticado (pero dar tiempo para que cargue el contexto)
  React.useEffect(() => {
    const token = localStorage.getItem('accessToken');
    
    // Si no hay token en localStorage, redirigir inmediatamente
    if (!token) {
      navigate('/login');
      return;
    }
    
    // Si hay token pero no hay usuario en el contexto, esperar un poco
    if (!user) {
      const timeoutId = setTimeout(() => {
        if (!user) {
          navigate('/login');
        }
      }, 2000); // Esperar 2 segundos para que el contexto se inicialice
      
      return () => clearTimeout(timeoutId);
    }
  }, [user, navigate]);

  const handleSuccess = () => {
    // Redirigir al perfil después del cambio exitoso
    if (user?.id) {
      navigate(`/profile/${user.id}`);
    } else {
      navigate('/');
    }
  };

  const handleCancel = () => {
    // Volver al perfil sin cambios
    if (user?.id) {
      navigate(`/profile/${user.id}`);
    } else {
      navigate('/');
    }
  };

  // Mostrar loading si estamos esperando que cargue la autenticación
  const token = localStorage.getItem('accessToken');
  if (token && !user) {
    return (
      <div className={styles.loadingContainer}>
        <p>{t('general.loading')}</p>
      </div>
    );
  }

  // Si no hay token, no mostrar nada (se redirigirá)
  if (!token) {
    return null;
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.contentWrapper}>
        <ChangePasswordForm 
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

export default ChangePasswordPage;