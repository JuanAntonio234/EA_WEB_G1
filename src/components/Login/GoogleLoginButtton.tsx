import React from 'react';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { ApiConstants } from '../../config/api_constants';
import api from '../../config/axios_instance';

const GoogleLoginButton: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

const handleSuccess = async (credentialResponse: CredentialResponse) => {
  try {
    const { credential } = credentialResponse;
    if (!credential) return;

    const res = await api.post(`${ApiConstants.login}/token`, 
      { token: credential }, 
      { 
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    // Guarda los datos del usuario y redirige
    login(res.data.user);
    navigate('/');
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
