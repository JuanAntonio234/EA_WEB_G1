import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { User as FullUserType } from '../../types/userTypes';
import { User as AuthContextUser } from '../../context/AuthContext';
import { updateUser, getUserById } from '../../services/userService';
import styles from './EditProfilePage.module.css';

const EditProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user: loggedInUserFromContext, login: updateUserInAuthContext } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    bio: '',
  });
  const [email, setEmail] = useState('');
  const [dbUserId, setDbUserId] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loadUserData = useCallback(async () => {
    if (loggedInUserFromContext && loggedInUserFromContext.id) {
      try {
        const fullUserData: FullUserType = await getUserById(loggedInUserFromContext.id);
        setFormData({
          username: fullUserData.username || '',
          bio: fullUserData.bio || '',
        });
        setEmail(fullUserData.email || '');
        setDbUserId(fullUserData._id);
      } catch (e) {
        setError(t('editProfilePage.errorNoUser'));
      }
    } else if (!loggedInUserFromContext) {
      setError(t('editProfilePage.errorNoUser'));
    }
    setInitialLoading(false);
  }, [loggedInUserFromContext, t]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!dbUserId || !loggedInUserFromContext) return;

    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const dataToUpdateApi: Partial<FullUserType> & { _id: string } = {
        _id: dbUserId, 
        username: formData.username,
        bio: formData.bio,
      };
      
      const updatedUserFromApi: FullUserType = await updateUser(dataToUpdateApi);
      
      const userForContextUpdate: AuthContextUser = {
        id: loggedInUserFromContext.id, 
        username: updatedUserFromApi.username,
        email: updatedUserFromApi.email, 
        profilePicture: updatedUserFromApi.profilePicture || loggedInUserFromContext.profilePicture,
        role: updatedUserFromApi.role || loggedInUserFromContext.role,
      };
      updateUserInAuthContext(userForContextUpdate);
      
      setSuccessMessage(t('editProfilePage.profileUpdatedSuccess'));
      setTimeout(() => {
        navigate(`/profile/${loggedInUserFromContext.id}`);
      }, 2000);

    } catch (err: any) {
      const message = err.response?.data?.message || err.message || t('editProfilePage.profileUpdatedError');
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (initialLoading) {
    return <div className={styles.messageContainer}>{t('editProfilePage.loadingUser')}</div>;
  }
  
  if (!loggedInUserFromContext || !dbUserId) {
     return <div className={`${styles.messageContainer} ${styles.error}`}>{error || t('editProfilePage.errorNoUser')}</div>;
  }

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>{t('editProfilePage.title')}</h1>
      
      {successMessage && <div className={`${styles.feedbackMessage} ${styles.success}`}>{successMessage}</div>}
      {error && !successMessage && <div className={`${styles.feedbackMessage} ${styles.error}`}>{error}</div>}

      <form onSubmit={handleSubmit} className={styles.editForm}>
        <div className={styles.formGroup}>
          <label htmlFor="username">{t('editProfilePage.usernameLabel')}</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="email">{t('editProfilePage.emailLabel')}</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            readOnly 
            className={styles.readOnlyInput}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="bio">{t('editProfilePage.bioLabel')}</label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows={4}
          />
        </div>
        <div className={styles.formActions}>
          <button type="button" onClick={() => navigate(`/profile/${loggedInUserFromContext.id}`)} className={styles.cancelButton}>
            {t('general.cancel')}
          </button>
          <button type="submit" disabled={isSubmitting} className={styles.saveButton}>
            {isSubmitting ? t('editProfilePage.savingChanges') : t('editProfilePage.saveChangesButton')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfilePage;
