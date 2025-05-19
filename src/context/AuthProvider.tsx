import React, { useState } from 'react';
import { AuthContext, User } from './AuthContext';
import { logoutUser } from '../services/userService';
import { jwtDecode } from 'jwt-decode';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (userData: User) => setUser(userData);

  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  React.useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const decoded = jwtDecode<User>(token);
        setUser(decoded);
      } catch {
        logout(); 
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
