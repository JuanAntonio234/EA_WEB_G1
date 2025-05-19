import React, { useState, useEffect, useCallback, ReactNode } from 'react';
import { AuthContext, AuthContextType } from './AuthContext'; 
import { User } from '../types/userTypes'; 
import { logoutUser as serviceLogoutUser } from '../services/userService'; 
import { jwtDecode } from 'jwt-decode';

interface AuthProviderProps {
  children: ReactNode;
}

interface JwtTokenPayload {
  id: string; 
  role: 'user' | 'admin';
  name: string; 
  email: string;
  profilePicture?: string;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loadingInitial, setLoadingInitial] = useState<boolean>(true);

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
        const decodedPayload = jwtDecode<JwtTokenPayload>(token); 
        const userFromToken: User = {
          _id: decodedPayload.id, 
          username: decodedPayload.name, 
          email: decodedPayload.email,
          profilePicture: decodedPayload.profilePicture,
          role: decodedPayload.role,
          level: 0, 
          totalDistance: 0, 
          totalTime: 0,
          activities: [], 
          achievements: [], 
          challengesCompleted: [], 
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          visibility: true, 
        };
        setUser(userFromToken);

        const idFromToken = decodedPayload.id; 
        const storedUserId = localStorage.getItem('userId');

        if (storedUserId !== idFromToken) {
          console.warn("El ID de usuario en localStorage no coincide con el ID del token o no existe. Re-estableciendo userId con el ID del token.");
          localStorage.setItem('userId', idFromToken);
        } else if (!storedUserId && idFromToken) { 
          console.log("Estableciendo userId en localStorage desde el token.");
          localStorage.setItem('userId', idFromToken);
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
