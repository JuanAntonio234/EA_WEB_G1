import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../hooks/useAuth';
import { User } from '../context/AuthContext';

const OauthSuccess = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const refreshToken = params.get('refreshToken');

    if (token && refreshToken) {
      try {
        const user: User = jwtDecode(token);
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        login(user);
        navigate('/');
      } catch (error) {
        console.error('Error al procesar el token:', error);
        navigate('/login');
      }
    } else {
      navigate('/');
    }
  }, [login, navigate]);

  return;
};

export default OauthSuccess;
