import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { changePassword as changePasswordService } from '../../services/userService';
import PasswordStrengthMeter from '../PasswordStrength/PasswordStrengthMeter';
import styles from './ChangePasswordForm.module.css';

interface ChangePasswordProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const ChangePasswordForm: React.FC<ChangePasswordProps> = ({ onSuccess, onCancel }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [apiError, setApiError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar errores cuando el usuario comience a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    setApiError('');
    setSuccessMessage('');
  };

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = t('changePassword.currentPasswordRequired');
    }

    if (!formData.newPassword) {
      newErrors.newPassword = t('changePassword.newPasswordRequired');
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = t('changePassword.passwordTooShort');
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t('changePassword.confirmPasswordRequired');
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = t('changePassword.passwordsDoNotMatch');
    }

    if (formData.currentPassword === formData.newPassword) {
      newErrors.newPassword = t('changePassword.samePassword');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setApiError('');
    setSuccessMessage('');

    try {
      await changePasswordService(formData.currentPassword, formData.newPassword);
      
      setSuccessMessage(t('changePassword.passwordChangedSuccess'));
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      setTimeout(() => {
        onSuccess?.();
      }, 2000);
      
    } catch (error: any) {
      setApiError(error.message || t('changePassword.changePasswordError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const passwordsMatch = formData.newPassword === formData.confirmPassword;
  const showPasswordMatch = formData.confirmPassword.length > 0;

  return (
    <div className={styles.formContainer}>
      {/* Header */}
      <div className={styles.titleContainer}>
        <h1 className={styles.pageTitle}>
          {t('changePassword.title')}
        </h1>
        <p className={styles.pageSubtitle}>
          {t('changePassword.subtitle')}
        </p>
      </div>

      {/* Mensaje de éxito */}
      {successMessage && (
        <div className={styles.successMessage}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
          </svg>
          <span>{successMessage}</span>
        </div>
      )}

      {/* Mensaje de error */}
      {apiError && (
        <div className={styles.errorMessage}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2"/>
            <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2"/>
          </svg>
          <span>{apiError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Campo Contraseña Actual */}
        <div className={styles.inputGroup}>
          <label htmlFor="currentPassword" className={styles.label}>
            {t('changePassword.currentPassword')}
          </label>
          <div className={styles.inputContainer}>
            <input
              id="currentPassword"
              type={showPasswords.current ? "text" : "password"}
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleInputChange}
              required
              className={`${styles.input} ${errors.currentPassword ? styles.inputError : ''}`}
              placeholder={t('changePassword.currentPasswordHint')}
              disabled={isSubmitting}
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
              onClick={() => togglePasswordVisibility('current')}
              aria-label={showPasswords.current ? t('registerPage.hidePassword') : t('registerPage.showPassword')}
              disabled={isSubmitting}
            >
              {showPasswords.current ? (
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
          {errors.currentPassword && (
            <div className={styles.fieldError}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2"/>
                <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <span>{errors.currentPassword}</span>
            </div>
          )}
        </div>

        {/* Campo Nueva Contraseña */}
        <div className={styles.inputGroup}>
          <label htmlFor="newPassword" className={styles.label}>
            {t('changePassword.newPassword')}
          </label>
          <div className={styles.inputContainer}>
            <input
              id="newPassword"
              type={showPasswords.new ? "text" : "password"}
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
              required
              className={`${styles.input} ${errors.newPassword ? styles.inputError : ''}`}
              placeholder={t('changePassword.newPasswordHint')}
              disabled={isSubmitting}
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
              onClick={() => togglePasswordVisibility('new')}
              aria-label={showPasswords.new ? t('registerPage.hidePassword') : t('registerPage.showPassword')}
              disabled={isSubmitting}
            >
              {showPasswords.new ? (
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
          {/* Password Strength Meter - igual que en Register */}
          {formData.newPassword && (
            <div className={styles.passwordStrength}>
              <PasswordStrengthMeter password={formData.newPassword} />
            </div>
          )}
          {errors.newPassword && (
            <div className={styles.fieldError}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2"/>
                <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <span>{errors.newPassword}</span>
            </div>
          )}
        </div>

        {/* Campo Confirmar Contraseña */}
        <div className={styles.inputGroup}>
          <label htmlFor="confirmPassword" className={styles.label}>
            {t('changePassword.confirmNewPassword')}
          </label>
          <div className={styles.inputContainer}>
            <input
              id="confirmPassword"
              type={showPasswords.confirm ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              className={`${styles.input} ${showPasswordMatch && !passwordsMatch ? styles.inputError : ''}`}
              placeholder={t('changePassword.confirmNewPasswordHint')}
              disabled={isSubmitting}
            />
            <div className={styles.inputIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <button
              type="button"
              className={styles.passwordToggle}
              onClick={() => togglePasswordVisibility('confirm')}
              aria-label={showPasswords.confirm ? t('registerPage.hidePassword') : t('registerPage.showPassword')}
              disabled={isSubmitting}
            >
              {showPasswords.confirm ? (
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
          {/* Password Match Indicator - igual que en Register */}
          {showPasswordMatch && (
            <div className={`${styles.passwordMatch} ${passwordsMatch ? styles.match : styles.noMatch}`}>
              <div className={styles.matchIcon}>
                {passwordsMatch ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2"/>
                    <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                )}
              </div>
              <span>
                {passwordsMatch ? (t('registerPage.passwordsMatch')) : (t('registerPage.passwordsNoMatch'))}
              </span>
            </div>
          )}
          {errors.confirmPassword && (
            <div className={styles.fieldError}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2"/>
                <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <span>{errors.confirmPassword}</span>
            </div>
          )}
        </div>

        {/* Botones */}
        <div className={styles.buttonGroup}>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className={styles.cancelButton}
              disabled={isSubmitting}
            >
              <span>{t('general.cancel')}</span>
            </button>
          )}
          
          <button 
            type="submit" 
            className={styles.button} 
            disabled={isSubmitting || !passwordsMatch || !formData.currentPassword || !formData.newPassword}
          >
            {isSubmitting ? (
              <>
                <div className={styles.spinner}></div>
                <span>{t('changePassword.changing')}</span>
              </>
            ) : (
              <>
                <span>{t('changePassword.changePasswordButton')}</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="16" r="1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePasswordForm;