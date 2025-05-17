import React from 'react';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const GoogleLoginButton: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      const { credential } = credentialResponse;
      if (!credential) return;

      const res = await axios.post('http://localhost:3000/api/google/token', { token: credential }, {
  withCredentials: true
});


      // Guarda los datos del usuario y redirige
      login(res.data.user); // Asegúrate de que tu backend devuelva el `user` correctamente
      navigate('/home');
    } catch (error) {
      console.error("Error al iniciar sesión con Google", error);
      alert("Inicio de sesión con Google fallido");
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() => console.log("Error en el login con Google")}
      useOneTap
    />
  );
};

export default GoogleLoginButton;
