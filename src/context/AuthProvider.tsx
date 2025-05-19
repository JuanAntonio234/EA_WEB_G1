import React, { useState, useEffect, useCallback, ReactNode } from 'react';
import { AuthContext, AuthContextType } from './AuthContext'; 
import { User } from '../types/userTypes'; 
import { logoutUser as serviceLogoutUser } from '../services/userService'; 
import { jwtDecode } from 'jwt-decode';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loadingInitial, setLoadingInitial] = useState<boolean>(true); // Para saber cuándo ha terminado la carga inicial del token

  const login = (userData: User) => {
    setUser(userData);
    if (userData && userData._id) {
        localStorage.setItem('userId', userData._id);
    }
  };

  const logout = useCallback(async () => {
    try {
      await serviceLogoutUser(); 
    } catch (error) {
      console.error("Error durante el logout del servicio, procediendo con la limpieza del cliente:", error);
    } finally {
      setUser(null);
      localStorage.removeItem('userId');
      localStorage.removeItem('accessToken'); 
      localStorage.removeItem('refreshToken');
    }
  }, []);

  useEffect(() => {
    setLoadingInitial(true);
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const decodedUserFromToken = jwtDecode<User>(token); 
        setUser(decodedUserFromToken);

        const storedUserId = localStorage.getItem('userId');
        if (storedUserId !== decodedUserFromToken._id) {
            console.warn("El ID de usuario en localStorage no coincide con el token. Re-estableciendo userId.");
            localStorage.setItem('userId', decodedUserFromToken._id);
        }

      } catch (error) {
        console.error("Fallo al decodificar el token o el token ha expirado. Cerrando sesión.", error);
        setUser(null);
        localStorage.removeItem('userId');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
    }
    setLoadingInitial(false);
  }, []); 

  const contextValue: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated: !!user, 
  };

  if (loadingInitial) {
    return null; 
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
