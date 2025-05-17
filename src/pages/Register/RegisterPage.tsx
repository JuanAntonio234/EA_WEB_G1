/*import Login from '../../components/Login/Login';
import styles from './RegisterPage.module.css';
import { useNavigate } from 'react-router-dom';
import { register } from '../../services/userService';
import { useAuth } from '../../hooks/useAuth';
import { User } from '../../types/userTypes';

function RegisterPage() {
    const navigate = useNavigate();
  const { login } = useAuth();

    const handleRegister = async (newUser: User) => {
        try {
            const user = await register(newUser);
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
        <Login onLogin={({ username, password }) => handleRegister({ ...newUser, username, password })}/>
    </div>
  );
};

export default RegisterPage;*/