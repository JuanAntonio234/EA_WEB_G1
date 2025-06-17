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

  const handleLogin = async (email: string, password: string) => {
    try {
      const token = await loginUser(email, password);
      const user: User = jwtDecode(token);
      login(user);
      navigate('/');
    } catch (error) {
      alert(t('loginPage.loginFailed'));
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.formContainer}>
        <div className={styles.titleContainer}>
          <h1 className={styles.pageTitle}>{t('loginPage.title')}</h1>
          <p className={styles.pageSubtitle}>{t('loginPage.subtitle')}</p>
        </div>
        
        <Login onLogin={({ username, password }) => handleLogin(username, password)} />
        
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