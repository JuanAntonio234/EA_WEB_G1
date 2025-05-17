import styles from './RegisterPage.module.css';
import { useNavigate } from 'react-router-dom';
import { register } from '../../services/userService';
import { useAuth } from '../../hooks/useAuth';
import { RegisterData} from '../../types/userTypes';
import Register from '../../components/Register/Register';

function RegisterPage() {
    const navigate = useNavigate();
  const { login } = useAuth();

    const handleRegister = async (newUser: RegisterData) => {
        try {
          const user = await register(newUser);
          login(user);
            navigate('/home');
            console.log('Register successful:', user);
        } catch (error) {
            console.error('Register failed:', error);
            alert('Register fallido');
        }
    }

  return (
    <div className={styles.pageContainer}>
      <Register onRegister={({ username, email, password }) => handleRegister({ username, email, password })} />
    </div>
  );
}

export default RegisterPage;