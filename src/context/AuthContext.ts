import { createContext, useContext } from 'react';
import { User } from '../types/userTypes'; 

export interface AuthContextType {
  user: User | null;
  login: (userData: User) => void; 
  logout: () => Promise<void>; 
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider. Make sure your component is a descendant of AuthProvider.');
  }
  return context;
};
