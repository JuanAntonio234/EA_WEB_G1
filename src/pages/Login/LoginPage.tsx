import Login from '../../components/Login/Login';
import styles from './LoginPage.module.css';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../services/userService';
import { useAuth } from '../../hooks/useAuth';
import GoogleLoginButton from '../../components/Login/GoogleLoginButtton';
import { jwtDecode } from 'jwt-decode';
import { User } from '../../context/AuthContext';

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (email: string, password: string) => {
    try {
      const token = await loginUser(email, password);
      const user: User = jwtDecode(token);
      login(user);
      navigate('/');
      console.log('Inici de sessió vàlid:', user);
    } catch (error) {
      console.error('Inici de sessió fallit:', error);
      alert('Inici de sessió fallit');
    }
  };

  return (
    <div className={styles.pageContainer}>
      <Login onLogin={({ username, password }) => handleLogin(username, password)} />
      <div className={styles.googleLoginContainer}>
        <GoogleLoginButton />
      </div>
    </div>
  );
}

export default LoginPage;
