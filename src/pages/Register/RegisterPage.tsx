import styles from './RegisterPage.module.css';
import { useNavigate } from 'react-router-dom';
import { register } from '../../services/userService';
import { useAuth } from '../../hooks/useAuth';
import { RegisterData } from '../../types/userTypes';
import Register from '../../components/Register/Register';
import { jwtDecode } from 'jwt-decode';
import { User } from '../../context/AuthContext';

function RegisterPage() {
    const navigate = useNavigate();
  const { login } = useAuth();

    const handleRegister = async (newUser: RegisterData) => {
        try {
          const token = await register(newUser);
          const user: User = jwtDecode(token);
          login(user);
            navigate('/');
            console.log('Registre satisfactori:', user);
        } catch (error) {
            console.error('Registre fallit:', error);
            alert('Registre fallit');
        }
    }

  return (
    <div className={styles.pageContainer}>
      <Register onRegister={({ username, email, password }) => handleRegister({ username, email, password })} />
    </div>
  );
}

export default RegisterPage;