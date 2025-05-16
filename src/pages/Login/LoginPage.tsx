import Login from '../../components/Login/Login';
import styles from './LoginPage.module.css';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../services/userService';
import { useAuth } from '../../hooks/useAuth';

function LoginPage() {
    const navigate = useNavigate();
  const { login } = useAuth();

    const handleLogin = async (username: string, password: string) => {
        try {
            const user = await loginUser(username, password);
            login(user);
            navigate('/home');
            console.log('Login successful:', user);
        } catch (error) {
            console.error('Login failed:', error);
            alert('Login fallido');
        }
    }

  return (
    <div className={styles.pageContainer}>
        <Login onLogin={({ username, password }) => handleLogin(username, password)}/>
    </div>
  );
};

export default LoginPage;