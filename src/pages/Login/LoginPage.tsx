import Login from '../../components/Login/Login';
import styles from './LoginPage.module.css';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../services/userService';
import { useAuth } from '../../hooks/useAuth';
import GoogleLoginButton from '../../components/Login/GoogleLoginButtton';
import { jwtDecode } from 'jwt-decode';

interface DecodedUser {
  _id: string;
  email: string;
  name: string;
  // añade aquí las propiedades que tenga tu token
}

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (username: string, password: string) => {
    try {
      const token = await loginUser(username, password);
      const user: DecodedUser = jwtDecode(token);
      login(user);
      navigate('/home');
      console.log('Login successful:', user);
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login fallido');
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
